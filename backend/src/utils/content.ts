import fs from "fs";
import path from "path";
import { MultiChoiceQuestion, NumberQuestion, Question, TextQuestion, TrueFalseQuestion } from "@/types/quiz";

type Subject = {
  id: string;
  name: string;
  examBoard: string;
  tier?: string;
  colour: string;
  papers: string[];
  topics: { id: string; name: string }[];
};

export const subjects: Subject[] = loadSubjects();
export const questionBank: Record<string, Question[]> = loadQuestionBank();

function loadSubjects(): Subject[] {
  const result: Subject[] = [];
  const subjectsDir = fs.readdirSync(path.join(process.cwd(), "content/subjects"));
  for (const subjectFile of subjectsDir) {
    const subject = fs.readFileSync(path.join(process.cwd(), `content/subjects/${subjectFile}`), "utf-8");
    result.push(JSON.parse(subject));
  }
  return result;
}

function loadQuestionBank(): Record<string, Question[]> {
  const result: Record<string, Question[]> = {};
  for (const subject of subjects) {
    const raw = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), `content/questions/${subject.id}.json`),
        "utf-8",
      ),
    );
    result[subject.id] = raw.map(inferQuestionType);
  }
  return result;
}

function inferQuestionType(q: any): Question {
  if (q.type) return q as Question;

  if (typeof q.answer === "boolean") {
    return {
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
      type: "true-false",
      answer: q.answer,
    } satisfies TrueFalseQuestion;
  }

  if (typeof q.answer === "string") {
    return {
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
      type: "text",
      answer: q.answer,
      acceptedAnswers: q.acceptedAnswers,
    } satisfies TextQuestion;
  }

  if (typeof q.answer === "number" && Array.isArray(q.options)) {
    return {
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
      type: "multi-choice",
      options: q.options,
      answer: q.answer,
    } satisfies MultiChoiceQuestion;
  }

  if (typeof q.answer === "number") {
    return {
      id: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      explanation: q.explanation,
      type: "number",
      answer: q.answer,
      tolerance: q.tolerance,
      unit: q.unit,
    } satisfies NumberQuestion;
  }

  throw new Error(`Could not infer type for question: ${q.id}`);
}

export function getSubject(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export function getQuestions(subjectId: string, topics?: string[]): Question[] {
  const all = questionBank[subjectId] ?? [];
  if (!topics || topics.length === 0) return all;
  return all.filter((q) => topics.includes(q.topic));
}