interface BaseQuestion {
  id: string;
  topic: string;
  type: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  explanation?: string;
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: "multi-choice";
  options: string[];
  answer: number; // index into options
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  answer: boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  answer: string; // exact match
  acceptedAnswers?: string[]; // alternatives e.g. ["4", "four", "x=4"]
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  answer: number;
  tolerance?: number; // e.g. 0.01 for floating point answers
  unit?: string; // e.g. "cm²", just for display
}

export type Question =
  | MultiChoiceQuestion 
  | TrueFalseQuestion
  | TextQuestion
  | NumberQuestion;

export interface GeneratedQuiz {
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  count: number;
  questions: Omit<Question, "answer" | "explanation">[];
}

export type StartedAttempt = {
  attemptId: string;
  quizId: string;
  questionCount: number;
}

export type AnswerQuestionParams = {
  userId: string;
  attemptId: string;
  questionId: string;
  answer: number | string | boolean;
}

export type AnswerResult = {
  correct: boolean;
  exact?: boolean;        // for text questions
  correctAnswer: number | string | boolean;
  explanation?: string;
}

export type CompletedAttempt = {
  score: number;
  correct: number;
  total: number;
  xpEarned: number;
  streak: { current: number; longest: number; }
}

export type AttemptSummary = {
  attemptId: string;
  seed: string;
  subjectId: string;
  score: number;
  completedAt: Date;
}

export type AttemptDetails = AttemptSummary & {
  answers: { questionId: string; answer: number | string | boolean; correct: boolean; }[];
}