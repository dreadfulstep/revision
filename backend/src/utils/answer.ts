import { distance } from "fastest-levenshtein";
import { MultiChoiceQuestion, NumberQuestion, Question, TextQuestion, TrueFalseQuestion } from "@/types/quiz";

export function checkAnswer(question: Question, answer: number | string | boolean): AnswerResult {
  switch (question.type) {
    case "multi-choice":
      return checkMultiChoice(question, answer as number);
    case "true-false":
      return checkTrueFalse(question, answer as boolean);
    case "text":
      return checkText(question, answer as string);
    case "number":
      return checkNumber(question, answer as number);
  }
}

function checkMultiChoice(question: MultiChoiceQuestion, answer: number): AnswerResult {
  return {
    correct: answer === question.answer,
    correctAnswer: question.answer,
    explanation: question.explanation,
  };
}

function checkTrueFalse(question: TrueFalseQuestion, answer: boolean): AnswerResult {
  return {
    correct: answer === question.answer,
    correctAnswer: question.answer,
    explanation: question.explanation,
  };
}

function checkText(question: TextQuestion, answer: string): AnswerResult {
  const normalise = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const input = normalise(answer);
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalise);

  if (accepted.includes(input)) {
    return { correct: true, exact: true, correctAnswer: question.answer, explanation: question.explanation };
  }

  for (const a of accepted) {
    const threshold = Math.max(1, Math.floor(a.length * 0.2));
    const d = distance(input, a);
    if (d <= threshold) {
      return { correct: true, exact: false, correctAnswer: question.answer, explanation: question.explanation };
    }
  }

  return { correct: false, exact: false, correctAnswer: question.answer, explanation: question.explanation };
}

function checkNumber(question: NumberQuestion, answer: number): AnswerResult {
  const tolerance = question.tolerance ?? 0;
  const correct = Math.abs(answer - question.answer) <= tolerance;
  return {
    correct,
    correctAnswer: question.answer,
    explanation: question.explanation,
  };
}

export type AnswerResult = {
  correct: boolean;
  exact?: boolean;
  correctAnswer: number | string | boolean;
  explanation?: string;
}