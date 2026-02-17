import { StorageService } from './storageService';
import { v4 as uuidv4 } from 'uuid';

const SUBMISSIONS_KEY = 'dal_submissions';

/**
 * Submission Model:
 * {
 *   id: string,
 *   questionId: string,
 *   name: string,
 *   normalizedName: string, // Lowercase, trimmed for uniqueness check
 *   answer: string,
 *   isCorrect: boolean,
 *   submittedAt: ISOString
 * }
 */

export const SubmissionService = {
  getAll: () => {
    return StorageService.get(SUBMISSIONS_KEY, {});
  },

  getByQuestionId: (questionId) => {
    const allSubmissions = SubmissionService.getAll();
    return allSubmissions[questionId] || [];
  },

  submit: ({ user, question, answer }) => {
    if (!question || !user || !answer) {
        throw new Error("Invalid submission data.");
    }

    // 1. Check if question is still active (Server-side validation simulation)
    const now = new Date();
    const end = new Date(question.endTime);
    if (now > end) {
        throw new Error("انتهى وقت الإجابة على هذا السؤال.");
    }

    const allSubmissions = SubmissionService.getAll();
    const questionSubmissions = allSubmissions[question.id] || [];

    // 2. Normalize Name for Duplicate Check
    const normalizedName = user.trim().toLowerCase();

    // 3. Strict: One submission per person per question
    const hasSubmitted = questionSubmissions.some(s => s.normalizedName === normalizedName);
    if (hasSubmitted) {
        throw new Error("لقد قمت بالإجابة على هذا السؤال مسبقاً.");
    }

    // 4. Check Answer (Case-insensitive)
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    const newSubmission = {
        id: uuidv4(),
        questionId: question.id,
        name: user.trim(),
        normalizedName: normalizedName,
        answer: answer.trim(),
        isCorrect: isCorrect,
        submittedAt: new Date().toISOString()
    };

    // 5. Save Logic (Append to question bucket)
    allSubmissions[question.id] = [...questionSubmissions, newSubmission];
    StorageService.set(SUBMISSIONS_KEY, allSubmissions);

    return newSubmission;
  },

  hasUserAnswered: (questionId, userName) => {
      if (!userName) return false;
      const submissions = SubmissionService.getByQuestionId(questionId);
      const normalized = userName.trim().toLowerCase();
      return submissions.some(s => s.normalizedName === normalized);
  }
};
