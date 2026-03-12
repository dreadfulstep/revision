import fs from "fs";
import path from "path";
import {
  MultiChoiceQuestion,
  NumberQuestion,
  Question,
  TextQuestion,
  TrueFalseQuestion,
} from "@/types/quiz";
import { QuestionTemplate, GeneratedQuestion } from "@/types/template";
import { templateToQuestion } from "@/utils/template";

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

function loadSubjects(): Subject[] {
  const dir = path.join(process.cwd(), "content/subjects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
}

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

type RawEntry = Record<string, any>;

function isTemplate(entry: RawEntry): boolean {
  return (
    typeof entry.variables === "object" &&
    entry.variables !== null &&
    !Array.isArray(entry.variables)
  );
}

function loadSubjectDir(subjectId: string): { questions: Question[]; templates: QuestionTemplate[] } {
  const dir = path.join(process.cwd(), `content/questions/${subjectId}`);
  const questions: Question[] = [];
  const templates: QuestionTemplate[] = [];

  if (!fs.existsSync(dir)) return { questions, templates };

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const raw: RawEntry[] = JSON.parse(
      fs.readFileSync(path.join(dir, file), "utf-8"),
    );
    const entries = Array.isArray(raw) ? raw : [raw];

    for (const entry of entries) {
      if (isTemplate(entry)) {
        templates.push(entry as unknown as QuestionTemplate);
      } else {
        questions.push(inferQuestionType(entry));
      }
    }
  }

  return { questions, templates };
}

export const questionBank: Record<string, Question[]> = {};
export const templateBank: Record<string, QuestionTemplate[]> = {};

for (const subject of subjects) {
  const { questions, templates } = loadSubjectDir(subject.id);
  questionBank[subject.id] = questions;
  templateBank[subject.id] = templates;
}

function inferQuestionType(q: RawEntry): Question {
  if (q.type) return q as Question;
  if (typeof q.answer === "boolean") {
    return {
      id: q.id, topic: q.topic, difficulty: q.difficulty,
      question: q.question, explanation: q.explanation,
      type: "true-false", answer: q.answer,
    } satisfies TrueFalseQuestion;
  }
  if (typeof q.answer === "string") {
    return {
      id: q.id, topic: q.topic, difficulty: q.difficulty,
      question: q.question, explanation: q.explanation,
      type: "text", answer: q.answer, acceptedAnswers: q.acceptedAnswers,
    } satisfies TextQuestion;
  }
  if (typeof q.answer === "number" && Array.isArray(q.options)) {
    return {
      id: q.id, topic: q.topic, difficulty: q.difficulty,
      question: q.question, explanation: q.explanation,
      type: "multi-choice", options: q.options, answer: q.answer,
    } satisfies MultiChoiceQuestion;
  }
  if (typeof q.answer === "number") {
    return {
      id: q.id, topic: q.topic, difficulty: q.difficulty,
      question: q.question, explanation: q.explanation,
      type: "number", answer: q.answer, tolerance: q.tolerance, unit: q.unit,
    } satisfies NumberQuestion;
  }
  throw new Error(`Could not infer type for question: ${q.id}`);
}

export function getQuestions(subjectId: string, topics?: string[]): Question[] {
  const all = questionBank[subjectId] ?? [];
  if (!topics || topics.length === 0) return all;
  return all.filter((q) => topics.includes(q.topic));
}

export function getTemplates(subjectId: string, topics?: string[]): QuestionTemplate[] {
  const all = templateBank[subjectId] ?? [];
  if (!topics || topics.length === 0) return all;
  return all.filter((t) => topics.includes(t.topic));
}

export function hasTemplates(subjectId: string): boolean {
  return (templateBank[subjectId]?.length ?? 0) > 0;
}

export function generateQuestionsFromTemplates(
  subjectId: string,
  seed: string,
  count: number,
  topics?: string[],
): GeneratedQuestion[] {
  const templates = getTemplates(subjectId, topics);
  if (templates.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const template = templates[i % templates.length];
    const questionSeed = `${seed}:${i}:${template.id}`;
    return templateToQuestion(template, questionSeed);
  });
}

export function isGeneratedId(id: string): boolean {
  return id.startsWith("gen:");
}

export function resolveGeneratedQuestion(
  id: string,
  subjectId: string,
): GeneratedQuestion | null {
  // format: gen:{subjectId}:{seed}:{index}
  const parts = id.split(":");
  if (parts.length < 4 || parts[0] !== "gen") return null;
  const seed = parts[2];
  const index = parseInt(parts[3], 10);
  if (isNaN(index)) return null;

  const templates = getTemplates(subjectId);
  if (templates.length === 0) return null;

  const template = templates[index % templates.length];
  const questionSeed = `${seed}:${index}:${template.id}`;
  return templateToQuestion(template, questionSeed);
}