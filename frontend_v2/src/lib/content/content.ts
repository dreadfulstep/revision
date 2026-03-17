import fs from "fs";
import path from "path";
import { Question, Subject } from "./types";

const contentDir = path.join(process.cwd(), "./content/subjects");

export function getSubjects(): Subject[] {
  const folders = fs.readdirSync(contentDir, { withFileTypes: true });
  return folders
    .filter((f) => f.isDirectory())
    .map((f) => {
      const file = path.join(contentDir, f.name, "index.json");
      const data = JSON.parse(fs.readFileSync(file, "utf-8"));
      return { id: f.name, ...data } as Subject;
    });
}

export function getSubject(id: string): Subject {
  const file = path.join(contentDir, id, "index.json");
  return { id, ...JSON.parse(fs.readFileSync(file, "utf-8")) };
}

export function getQuestions(subjectId: string, topicId?: string): Question[] {
  const questionsDir = path.join(contentDir, subjectId, "questions");
  const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
  const all = files.flatMap(
    (f) =>
      JSON.parse(
        fs.readFileSync(path.join(questionsDir, f), "utf-8"),
      ) as Question[],
  );
  return topicId ? all.filter((q) => q.topic === topicId) : all;
}
