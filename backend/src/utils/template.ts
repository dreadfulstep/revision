import { QuestionTemplate, ResolvedVars, GeneratedQuestion, VariableDef } from "../types/template";
import { getRenderer } from "../renderers";

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return Math.abs(h);
}

function makeRng(seed: string) {
  return mulberry32(djb2(seed));
}

function resolveVariables(defs: Record<string, VariableDef>, rng: () => number): ResolvedVars {
  const vars: ResolvedVars = {};

  for (const [key, def] of Object.entries(defs)) {
    if (def.type === "int") {
      let val: number;
      let attempts = 0;
      do {
        val = Math.floor(rng() * (def.max - def.min + 1)) + def.min;
        attempts++;
      } while (
        attempts < 100 && (
          (def.notEqualTo && val === vars[def.notEqualTo]) ||
          (def.multipleOf && val % def.multipleOf !== 0)
        )
      );
      vars[key] = val;
    } else if (def.type === "float") {
      const raw = rng() * (def.max - def.min) + def.min;
      vars[key] = parseFloat(raw.toFixed(def.dp));
    } else if (def.type === "pick") {
      vars[key] = def.options[Math.floor(rng() * def.options.length)];
    } else if (def.type === "derived") {
      // evaluated after other vars exist
      vars[key] = safeEval(def.expr, vars);
    }
  }

  return vars;
}

function safeEval(expr: string, vars: ResolvedVars): number | string {
  try {
    const fn = new Function(...Object.keys(vars), "Math", `return ${expr}`);
    return fn(...Object.values(vars), Math);
  } catch {
    return 0;
  }
}

// ── Interpolate {{expr}} placeholders in strings ───────────────────────────
function interpolate(template: string, vars: ResolvedVars): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    const result = safeEval(expr.trim(), vars);
    return typeof result === "number" && !Number.isInteger(result)
      ? result.toFixed(2)
      : String(result);
  });
}

export function templateToQuestion(
  template: QuestionTemplate,
  seed: string
): GeneratedQuestion {
  const rng = makeRng(seed + template.id);
  const vars = resolveVariables(template.variables, rng);

  const question = interpolate(template.template, vars);
  const explanation = template.explanation ? interpolate(template.explanation, vars) : undefined;

  // Resolve image
  let image: GeneratedQuestion["image"] = null;
  if (template.image?.type === "generated") {
    const renderer = getRenderer(template.image.renderer);
    if (renderer) {
      image = { type: "svg", data: renderer(vars) };
    }
  } else if (template.image?.type === "static") {
    image = { type: "static", src: template.image.src };
  }

  let answer: number | string | boolean;
  let acceptedAnswers: string[] | undefined;
  let options: string[] | undefined;

  if (template.type === "number" && template.answer) {
    answer = Number(safeEval(template.answer, vars));
  } else if (template.type === "text" && template.textAnswer) {
    answer = String(safeEval(template.textAnswer, vars));
    if (template.acceptedAnswers) {
      acceptedAnswers = template.acceptedAnswers.map(a => interpolate(a, vars));
    }
  } else if (template.type === "multi-choice") {
    answer = template.choiceAnswer ?? 0;
    options = template.options?.map(o => interpolate(o, vars));
  } else if (template.type === "true-false") {
    answer = template.boolAnswer ?? false;
  } else {
    answer = 0;
  }

  return {
    id: `${template.id}:${seed}`,
    templateId: template.id,
    topic: template.topic,
    difficulty: template.difficulty,
    type: template.type,
    question,
    answer,
    tolerance: template.tolerance,
    unit: template.unit,
    acceptedAnswers,
    options,
    explanation,
    image,
    vars,
  };
}