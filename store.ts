// Mock database store for Ramadan Dal quiz

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  name: string;
  answer: string;
  timestamp: string; // ISO string
}

const QUESTIONS_KEY = "ramadan_dal_questions";
const ANSWERS_KEY = "ramadan_dal_answers";
const USER_KEY = "ramadan_dal_user";

export function getQuestions(): Question[] {
  const data = localStorage.getItem(QUESTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addQuestion(q: Omit<Question, "id" | "createdAt">): Question {
  const questions = getQuestions();
  const newQ: Question = {
    ...q,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  questions.push(newQ);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  return newQ;
}

export function getActiveQuestion(): Question | null {
  const questions = getQuestions();
  const now = new Date();
  return questions.find((q) => {
    const start = new Date(q.startTime);
    const end = new Date(q.endTime);
    return now >= start && now <= end;
  }) || null;
}

export function getLatestQuestion(): Question | null {
  const questions = getQuestions();
  return questions.length > 0 ? questions[questions.length - 1] : null;
}

export function getAnswers(questionId?: string): Answer[] {
  const data = localStorage.getItem(ANSWERS_KEY);
  const answers: Answer[] = data ? JSON.parse(data) : [];
  if (questionId) return answers.filter((a) => a.questionId === questionId);
  return answers;
}

export function submitAnswer(questionId: string, name: string, answer: string): Answer {
  const answers = getAnswers();
  const newA: Answer = {
    id: Date.now().toString(),
    questionId,
    name,
    answer,
    timestamp: new Date().toISOString(),
  };
  answers.push(newA);
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  return newA;
}

export function hasUserAnswered(questionId: string, name: string): boolean {
  const answers = getAnswers(questionId);
  return answers.some((a) => a.name.trim().toLowerCase() === name.trim().toLowerCase());
}

export function setUserName(name: string) {
  localStorage.setItem(USER_KEY, name);
}

export function getUserName(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function getWinner(questionId: string, correctAnswer: string): Answer | null {
  const answers = getAnswers(questionId);
  const correct = answers
    .filter((a) => a.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase())
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return correct.length > 0 ? correct[0] : null;
}
