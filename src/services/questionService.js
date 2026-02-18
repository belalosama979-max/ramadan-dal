import { supabase } from '../lib/supabaseClient';

/*
Question Model (App Side - camelCase):
{
  id: string,
  text: string,
  correctAnswer: string,
  startTime: ISOString,
  endTime: ISOString,
  createdAt: ISOString
}
*/

export const QuestionService = {

  // 🔹 Get all questions
  getAll: async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type || 'text',
      options: q.options || null,
      correctAnswer: q.correct_answer,
      startTime: q.start_time,
      endTime: q.end_time,
      createdAt: q.created_at
    }));
  },


  // 🔹 Add new question
  add: async (questionData) => {

    if (
      !questionData.text ||
      !questionData.correctAnswer ||
      !questionData.startTime ||
      !questionData.endTime
    ) {
      throw new Error("Missing required question fields.");
    }

    if (new Date(questionData.endTime) <= new Date(questionData.startTime)) {
      throw new Error("End time must be after start time.");
    }

    // Default to 'text' if not specified
    const type = questionData.type || 'text';
    let options = null;

    // Strict Validation for MCQ
    if (type === 'multiple_choice') {
      if (!Array.isArray(questionData.options) || questionData.options.length < 2) {
        throw new Error("Multiple choice questions must have at least 2 options.");
      }

      // Cleanup options (trim, remove empty)
      options = questionData.options
        .map(o => o.trim())
        .filter(o => o.length > 0);

      if (options.length < 2) {
        throw new Error("Multiple choice questions must have at least 2 valid options.");
      }

      // Check for duplicates
      const uniqueOptions = new Set(options);
      if (uniqueOptions.size !== options.length) {
        throw new Error("Options must be unique.");
      }

      // Validate correct answer is in options
      if (!options.includes(questionData.correctAnswer)) {
        throw new Error("Correct answer must be one of the provided options.");
      }
    } else {
      // For text questions, force options to null
      options = null;
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([{
        text: questionData.text,
        type: type,
        options: options,
        correct_answer: questionData.correctAnswer,
        start_time: new Date(questionData.startTime).toISOString(),
        end_time: new Date(questionData.endTime).toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      type: data.type || 'text',
      options: data.options || null,
      correctAnswer: data.correct_answer,
      startTime: data.start_time,
      endTime: data.end_time,
      createdAt: data.created_at
    };
  },


  // 🔹 Get currently active question (SERVER-SIDE FILTERING ONLY)
  getActive: async () => {

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .lte('start_time', now)
      .gte('end_time', now)
      .order('start_time', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching active question:", error);
      throw error;
    }

    if (!data || data.length === 0) return null;

    const q = data[0];

    return {
      id: q.id,
      text: q.text,
      type: q.type || 'text',
      options: q.options || null,
      correctAnswer: q.correct_answer,
      startTime: q.start_time,
      endTime: q.end_time,
      createdAt: q.created_at
    };
  },


  // 🔹 Get schedule (sorted by start time)
  getSchedule: async () => {
    const all = await QuestionService.getAll();
    return all.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  },


  // 🔹 Force end question immediately
  forceEnd: async (id) => {

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('questions')
      .update({ end_time: now })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      type: data.type || 'text',
      options: data.options || null,
      correctAnswer: data.correct_answer,
      startTime: data.start_time,
      endTime: data.end_time,
      createdAt: data.created_at
    };
  }
};


