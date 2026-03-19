import { db } from "./db";
import { aiMarkingCache } from "./db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

type MarkingResult = { marks: number; feedback: string; correct: boolean };
type AnswerTier = "deterministic" | "short" | "long";

export function getAnswerTier(type: string): AnswerTier {
  switch (type) {
    case "number":
    case "multiple_choice":
    case "true_false":
    case "matching":
    case "ordering":
    case "multi_select":
    case "fill_blank":
    case "multi_part":
      return "deterministic";
    case "text":
      return "short";
    case "long_form":
      return "long";
    case "short_form":
        return "short";
    default:
      return "deterministic";
  }
}

function cacheKey(questionId: string, answer: string): string {
  return createHash("sha256")
    .update(`${questionId}:${answer.trim().toLowerCase()}`)
    .digest("hex");
}

export async function markShortForm(
  questionId: string,
  subject: string,
  question: string,
  correctAnswer: string,
  acceptedAnswers: string[],
  studentAnswer: string,
): Promise<MarkingResult> {
  const key = cacheKey(questionId, studentAnswer);

  try {
    const cached = await db.query.aiMarkingCache.findFirst({
      where: eq(aiMarkingCache.key, key),
    });
    if (cached)
      return {
        marks: cached.marks,
        feedback: cached.feedback,
        correct: cached.correct,
      };
  } catch {}

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 80,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a lenient GCSE ${subject} marker checking short answers.

Rules:
- Award correct if the student demonstrates the right knowledge, even imperfectly worded
- Accept synonyms, paraphrases, and partial sentences
- Accept American/British spelling variants
- For biology: accept common names alongside scientific terms
- For definitions: accept if the core meaning is correct, ignore minor omissions
- Do NOT penalise for missing units unless the question specifically asks for them
- Do NOT penalise for capitalisation or punctuation
- If the answer is clearly correct science/fact, mark it correct
- Only mark incorrect if the student is factually wrong or has the opposite meaning

Respond JSON only: {"correct":boolean,"feedback":"max 12 words explaining why if incorrect"}`,
        },
        {
          role: "user",
          content: `Question: ${question}\nExpected answer: ${correctAnswer}\nAlso accepted: ${acceptedAnswers.filter((a) => a !== correctAnswer).join(", ") || "none"}\nStudent answered: ${studentAnswer}`,
        },
      ],
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  let result: MarkingResult;
  try {
    const parsed = JSON.parse(raw);
    result = {
      marks: parsed.correct ? 1 : 0,
      feedback: parsed.feedback ?? "",
      correct: Boolean(parsed.correct),
    };
  } catch {
    result = { marks: 0, feedback: "Could not mark", correct: false };
  }

  try {
    await db
      .insert(aiMarkingCache)
      .values({ key, ...result })
      .onConflictDoNothing();
  } catch {}

  return result;
}

export async function markLongForm(
  questionId: string,
  subject: string,
  question: string,
  markScheme: string,
  totalMarks: number,
  studentAnswer: string,
): Promise<MarkingResult> {
  const key = cacheKey(questionId, studentAnswer);

  try {
    const cached = await db.query.aiMarkingCache.findFirst({
      where: eq(aiMarkingCache.key, key),
    });
    if (cached)
      return {
        marks: cached.marks,
        feedback: cached.feedback,
        correct: cached.correct,
      };
  } catch {}

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 200,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are a lenient GCSE ${subject} examiner marking student answers.

IMPORTANT marking principles:
- Award marks generously for correct scientific/factual content even if not perfectly worded
- Do not penalise for poor grammar, spelling, or informal language
- Credit the science/knowledge, not the writing quality  
- If a student clearly understands a concept but expresses it imperfectly, still award the mark
- Award each mark point independently - partial credit is expected
- When in doubt, award the mark

Respond JSON only: {"marks":N,"feedback":"2-3 sentences explaining what was credited and what was missing","correct":boolean}. correct=true if marks >= 50% of total.`,
        },
        {
          role: "user",
          content: `Question (${totalMarks} marks): ${question}

Mark scheme (award 1 mark per bullet point, max ${totalMarks}):
${markScheme}

Student answer: ${studentAnswer}

Award marks for each point the student has demonstrated understanding of. Be generous but fair and realistic.`,
        },
      ],
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  console.log(data);

  let result: MarkingResult;
  try {
    const parsed = JSON.parse(raw);
    result = {
      marks: Math.min(Math.max(parseInt(parsed.marks) || 0, 0), totalMarks),
      feedback: parsed.feedback ?? "No feedback",
      correct: Boolean(parsed.correct),
    };
  } catch {
    result = { marks: 0, feedback: "Could not mark", correct: false };
  }

  try {
    await db
      .insert(aiMarkingCache)
      .values({ key, ...result })
      .onConflictDoNothing();
  } catch {}

  return result;
}
