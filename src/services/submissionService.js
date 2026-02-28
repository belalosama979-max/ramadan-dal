import { supabase } from '../lib/supabaseClient';

/**
 * Submission Model:
 * {
 *   id: string,
 *   questionId: string,
 *   name: string,
 *   normalizedName: string, // Lowercase, trimmed for uniqueness check
 *   answer: string,
 *   isCorrect: boolean,
 *   resultViewed: boolean,   // true once user has seen their result post-question
 *   submittedAt: ISOString
 * }
 */

export const SubmissionService = {
  getAll: async () => {
    const { data, error } = await supabase
        .from('submissions')
        .select('*');
    if (error) throw error;
    return data.map(mapSubmission);
  },

  getByQuestionId: async (questionId) => {
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('question_id', questionId);
        
    if (error) throw error;
    return data.map(mapSubmission);
  },

  submit: async ({ user, question, answer }) => {
    if (!question || !user || !answer) {
        throw new Error("Invalid submission data.");
    }

    // 1. Check personal timer first, fall back to global end_time
    const now = new Date();
    const timer = await SubmissionService.getPersonalTimer(question.id, user);
    const deadline = timer ? new Date(timer.personalEndTime) : new Date(question.endTime);
    if (now > deadline) {
        throw new Error("انتهى وقت الإجابة على هذا السؤال.");
    }

    const personalStart = timer ? new Date(timer.personalStartTime) : new Date(question.startTime);
    const responseTimeSeconds = Math.floor((now.getTime() - personalStart.getTime()) / 1000);

    // 2. Normalize Name
    const normalizedName = user.trim().toLowerCase();

    // 3. Strict: One submission per person per question (Async Check)
    const hasSubmitted = await SubmissionService.hasUserAnswered(question.id, user);
    if (hasSubmitted) {
        throw new Error("لقد قمت بالإجابة على هذا السؤال مسبقاً.");
    }

    // 4. Check Answer (Case-insensitive)
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    // 5. Save to Supabase
    const { data, error } = await supabase
        .from('submissions')
        .insert([{
            question_id: question.id,
            name: user.trim(),
            normalized_name: normalizedName,
            answer: answer.trim(),
            is_correct: isCorrect,
            response_time_seconds: Math.max(0, responseTimeSeconds),
            // id and submitted_at handled by DB
        }])
        .select()
        .single();

    if (error) throw error;

    return mapSubmission(data);
  },

  hasUserAnswered: async (questionId, userName) => {
      if (!userName) return false;
      const normalized = userName.trim().toLowerCase();
      
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('question_id', questionId)
        .eq('normalized_name', normalized);

      if (error) {
          console.error("Error checking submission:", error);
          return false;
      }
      
      return count > 0;
  },

  /**
   * Get a specific user's submission for a question.
   * Returns the submission with isCorrect, or null if not found.
   */
  getUserSubmission: async (questionId, userName) => {
      if (!questionId || !userName) return null;
      const normalized = userName.trim().toLowerCase();

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('question_id', questionId)
        .eq('normalized_name', normalized)
        .maybeSingle();

      if (error) {
          console.error("Error fetching user submission:", error);
          return null;
      }

      return data ? mapSubmission(data) : null;
  },

  /**
   * Mark a submission's result as viewed. Called once when the user sees their result.
   * Only updates the result_viewed flag — no other data is modified.
   */
  markResultViewed: async (submissionId) => {
      if (!submissionId) return;

      const { error } = await supabase
        .from('submissions')
        .update({ result_viewed: true })
        .eq('id', submissionId);

      if (error) {
          console.error('Error marking result as viewed:', error);
      }
  },

  // ===== PERSONAL TIMER FUNCTIONS =====

  /**
   * Get or create a personal timer for a user on a specific question.
   */
  getOrCreatePersonalTimer: async (questionId, userName, questionEndTime, personalDurationSeconds = 120) => {
      if (!questionId || !userName || !questionEndTime) return null;
      const normalized = userName.trim().toLowerCase();

      // Safety: prevent creating timer after global window ended
      const now = new Date();
      const globalEnd = new Date(questionEndTime);
      if (now > globalEnd) {
          throw new Error("لا يمكن بدء المؤقت بعد انتهاء وقت السؤال.");
      }

      // Check if timer already exists (handles refresh / second device)
      const { data: existing, error: fetchError } = await supabase
        .from('personal_timers')
        .select('*')
        .eq('question_id', questionId)
        .eq('normalized_name', normalized)
        .maybeSingle();

      if (fetchError) {
          console.error('Error fetching personal timer:', fetchError);
          return null;
      }

      if (existing) {
          return mapPersonalTimer(existing);
      }

      // Create new timer: capped by global end_time
      const durationMs = (personalDurationSeconds || 120) * 1000;
      const personalEnd = new Date(Math.min(now.getTime() + durationMs, globalEnd.getTime()));

      const { data: inserted, error: insertError } = await supabase
        .from('personal_timers')
        .insert([{
            question_id: questionId,
            normalized_name: normalized,
            personal_start_time: now.toISOString(),
            personal_end_time: personalEnd.toISOString(),
        }])
        .select()
        .single();

      // Handle race condition: if another tab inserted between our check and insert
      if (insertError) {
          if (insertError.code === '23505') { // unique_violation
              // Another tab/device just created it — fetch and return
              const { data: raceData } = await supabase
                .from('personal_timers')
                .select('*')
                .eq('question_id', questionId)
                .eq('normalized_name', normalized)
                .maybeSingle();
              return raceData ? mapPersonalTimer(raceData) : null;
          }
          console.error('Error creating personal timer:', insertError);
          return null;
      }

      return mapPersonalTimer(inserted);
  },

  /**
   * Get existing personal timer (read-only). Returns null if none exists.
   */
  getPersonalTimer: async (questionId, userName) => {
      if (!questionId || !userName) return null;
      const normalized = userName.trim().toLowerCase();

      const { data, error } = await supabase
        .from('personal_timers')
        .select('*')
        .eq('question_id', questionId)
        .eq('normalized_name', normalized)
        .maybeSingle();

      if (error) {
          console.error('Error fetching personal timer:', error);
          return null;
      }

      return data ? mapPersonalTimer(data) : null;
  }
};

// Helper to map snake_case DB to camelCase model
const mapSubmission = (s) => ({
    id: s.id,
    questionId: s.question_id,
    name: s.name,
    normalizedName: s.normalized_name,
    answer: s.answer,
    isCorrect: s.is_correct,
    responseTimeSeconds: s.response_time_seconds,
    resultViewed: s.result_viewed ?? false,
    submittedAt: s.submitted_at
});

// Helper to map personal_timers row
const mapPersonalTimer = (t) => ({
    id: t.id,
    questionId: t.question_id,
    normalizedName: t.normalized_name,
    personalStartTime: t.personal_start_time,
    personalEndTime: t.personal_end_time,
});
