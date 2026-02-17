import { StorageService } from './storageService';
import { v4 as uuidv4 } from 'uuid';

const QUESTIONS_KEY = 'dal_questions';

/**
 * Question Model:
 * {
 *   id: string,
 *   text: string,
 *   correctAnswer: string,
 *   startTime: ISOString,
 *   endTime: ISOString,
 *   createdAt: ISOString
 * }
 */

export const QuestionService = {
  getAll: () => {
    return StorageService.get(QUESTIONS_KEY, []);
  },

  add: (questionData) => {
    const questions = QuestionService.getAll();
    
    // Validate inputs
    if (!questionData.text || !questionData.correctAnswer || !questionData.startTime || !questionData.endTime) {
      throw new Error("Missing required question fields.");
    }

    if (new Date(questionData.endTime) <= new Date(questionData.startTime)) {
        throw new Error("End time must be after start time.");
    }

    const newQuestion = {
      id: uuidv4(),
      text: questionData.text,
      correctAnswer: questionData.correctAnswer,
      startTime: questionData.startTime,
      endTime: questionData.endTime,
      createdAt: new Date().toISOString()
    };

    questions.push(newQuestion);
    StorageService.set(QUESTIONS_KEY, questions);
    return newQuestion;
  },

  getActive: () => {
    const questions = QuestionService.getAll();
    const now = new Date();

    return questions.find(q => {
      const start = new Date(q.startTime);
      const end = new Date(q.endTime);
      return now >= start && now <= end;
    });
  },

  // Get currently active or future questions
  getSchedule: () => {
      const questions = QuestionService.getAll();
      return questions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  },

  forceEnd: (id) => {
      const questions = QuestionService.getAll();
      const index = questions.findIndex(q => q.id === id);
      if (index === -1) throw new Error("Question not found");

      // Update endTime to now
      questions[index].endTime = new Date().toISOString();
      StorageService.set(QUESTIONS_KEY, questions);
      return questions[index];
  }
};
