import fs from "fs";
import path from "path";
import type { Paper, PaperMeta } from "./types";

const contentDir = path.join(process.cwd(), "./content/subjects");

export function getPaperMeta(subjectId: string): PaperMeta | null {
  const file = path.join(contentDir, subjectId, "papers", "index.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as PaperMeta;
}

export function getPaper(subjectId: string, paperNumber: number): Paper | null {
  const meta = getPaperMeta(subjectId);
  if (!meta) return null;
  const entry = meta.papers.find(p => p.number === paperNumber);
  if (!entry) return null;
  const file = path.join(contentDir, subjectId, "papers", entry.filename);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return { ...data, id: `${subjectId}-paper-${paperNumber}` } as Paper;
}

export function getAllPapers(subjectId: string): Paper[] {
  const meta = getPaperMeta(subjectId);
  if (!meta) return [];
  return meta.papers
    .map(p => getPaper(subjectId, p.number))
    .filter((p): p is Paper => p !== null);
}