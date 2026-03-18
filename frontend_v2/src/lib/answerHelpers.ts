export function norm(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}
const SUPER_MAP: Record<string, number> = {
  "²": 2,
  "³": 3,
  "⁴": 4,
  "⁵": 5,
  "⁶": 6,
  "⁷": 7,
  "⁸": 8,
  "⁹": 9,
};

export function normalisePrimeFactors(s: string): string | null {
  const cleaned = s
    .toLowerCase()
    .replace(/×|x|\*/g, "·")
    .replace(/\s+/g, "");
  const parts = cleaned.split("·");
  const factors: Record<number, number> = {};

  for (const part of parts) {
    const expMatch = part.match(/^(\d+)\^(\d+)$/);
    const superMatch = part.match(/^(\d+)([²³⁴⁵⁶⁷⁸⁹])$/);
    const plainMatch = part.match(/^(\d+)$/);

    if (expMatch) {
      const base = parseInt(expMatch[1]!);
      factors[base] = (factors[base] ?? 0) + parseInt(expMatch[2]!);
    } else if (superMatch) {
      const base = parseInt(superMatch[1]!);
      factors[base] = (factors[base] ?? 0) + (SUPER_MAP[superMatch[2]!] ?? 1);
    } else if (plainMatch) {
      const base = parseInt(plainMatch[1]!);
      factors[base] = (factors[base] ?? 0) + 1;
    } else {
      return null;
    }
  }

  return Object.entries(factors)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([base, exp]) => `${base}^${exp}`)
    .join("·");
}

export function isPrimeFactorExpr(s: string): boolean {
  return /[\^²³⁴⁵×x\*]/.test(s) && /\d/.test(s);
}

export function checkText(submitted: string, correct: string): boolean {
  const normPi = (s: string) =>
    s
      .toLowerCase()
      .replace(/π/g, "pi")
      .replace(/\s+/g, "")
      .replace(/\s*cm\s*$/, "")
      .replace(/\s*m\s*$/, "")
      .trim();

  if (isPrimeFactorExpr(submitted) || isPrimeFactorExpr(correct)) {
    const a = normalisePrimeFactors(submitted);
    const b = normalisePrimeFactors(correct);
    if (a !== null && b !== null) return a === b;
  }

  if (normPi(submitted) === normPi(correct)) return true;

  return norm(submitted) === norm(correct);
}

export function checkNumber(submitted: string, correct: string): boolean {
  const a = parseFloat(submitted.trim());
  const b = parseFloat(correct.trim());
  if (isNaN(a) || isNaN(b)) return false;
  return Math.abs(a - b) < 0.01;
}

export function checkMultiSelect(submitted: string, correct: string): boolean {
  try {
    const sub: string[] = JSON.parse(submitted);
    const cor: string[] = JSON.parse(correct);
    const normArr = (arr: string[]) => arr.map(norm).sort();
    return JSON.stringify(normArr(sub)) === JSON.stringify(normArr(cor));
  } catch {
    return false;
  }
}

export function checkMatching(submitted: string, correct: string): boolean {
  try {
    const sub: Record<string, string> = JSON.parse(submitted);
    const cor: Record<string, string> = JSON.parse(correct);
    const keys = Object.keys(cor).sort();
    if (JSON.stringify(Object.keys(sub).sort()) !== JSON.stringify(keys))
      return false;
    return keys.every((k) => norm(sub[k] ?? "") === norm(cor[k] ?? ""));
  } catch {
    return false;
  }
}

export function checkOrdering(submitted: string, correct: string): boolean {
  try {
    const sub: string[] = JSON.parse(submitted);
    const cor: string[] = JSON.parse(correct);
    if (sub.length !== cor.length) return false;
    return sub.every((v, i) => norm(v) === norm(cor[i] ?? ""));
  } catch {
    return false;
  }
}

export function checkMultiPart(submitted: string, correct: string): boolean {
  try {
    const sub: { label: string; answer: string }[] = JSON.parse(submitted);
    const cor: { label: string; answer: string }[] = JSON.parse(correct);
    if (sub.length !== cor.length) return false;
    return cor.every((corPart) => {
      const subPart = sub.find((s) => norm(s.label) === norm(corPart.label));
      if (!subPart) return false;
      return checkNumber(subPart.answer, corPart.answer);
    });
  } catch {
    return false;
  }
}

export function checkFillBlank(submitted: string, correct: string): boolean {
  try {
    const sub: string[] = JSON.parse(submitted);
    const cor: string[][] = JSON.parse(correct);

    if (!Array.isArray(sub) || !Array.isArray(cor)) return false;
    if (sub.length !== cor.length) return false;

    let correctCount = 0;

    for (let i = 0; i < cor.length; i++) {
      const user = norm(sub[i] ?? "");
      const accepted = cor[i].map(norm);

      if (accepted.includes(user) || isCloseMatch(user, accepted)) {
        correctCount++;
      }
    }

    return correctCount === cor.length;

    // 🔁 OPTIONAL: allow partial marking later
    // return correctCount / cor.length >= 0.8;
  } catch {
    return false;
  }
}

export function checkAnswer(
  type: string,
  submitted: string,
  correct: string,
): boolean {
  switch (type) {
    case "number":
      return checkNumber(submitted, correct);
    case "text":
      return checkText(submitted, correct);
    case "fill_blank":
      return checkFillBlank(submitted, correct);
    case "true_false":
      return norm(submitted) === norm(correct);
    case "multiple_choice":
      return norm(submitted) === norm(correct);
    case "multi_select":
      return checkMultiSelect(submitted, correct);
    case "matching":
      return checkMatching(submitted, correct);
    case "ordering":
      return checkOrdering(submitted, correct);
    case "multi_part":
      return checkMultiPart(submitted, correct);
    default:
      return norm(submitted) === norm(correct);
  }
}

export function getMatchingResults(
  submitted: string,
  correct: string,
): Record<string, boolean> | null {
  try {
    const sub: Record<string, string> = JSON.parse(submitted);
    const cor: Record<string, string> = JSON.parse(correct);
    return Object.fromEntries(
      Object.keys(cor).map((k) => [
        k,
        norm(sub[k] ?? "") === norm(cor[k] ?? ""),
      ]),
    );
  } catch {
    return null;
  }
}

function isCloseMatch(user: string, accepted: string[]): boolean {
  return accepted.some((ans) => {
    const dist = levenshtein(user, ans);
    return dist <= 1;
  });
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
