import { ResolvedVars, Question } from "./types";
import { helpers } from "./helpers";

function buildContext(): string {
  const order = [
    "gcd",
    "lcm",
    "hcf",
    "isPrime",
    "primeFactors",
    "simplifyFraction",
    "percentChange",
    "compound",
    "hypotenuse",
    "triangleArea",
    "circleArea",
    "circumference",
    "round",
    "clamp",
    "nthRoot",
    "sign",
    "sinDeg",
    "cosDeg",
    "tanDeg",
    "asinDeg",
    "acosDeg",
    "atanDeg",
  ];

  return order
    .map((name) => {
      const fn = helpers[name];
      if (!fn) return "";
      return `function ${name}(...args) { return (${fn.toString()})(...args); }`;
    })
    .join("\n");
}

function evalExpr(expr: string, vars: ResolvedVars): number {
  const keys = Object.keys(vars);
  const vals = Object.values(vars);
  const fn = new Function(
    ...keys,
    `"use strict";
     const sqrt = Math.sqrt;
     const pow  = Math.pow;
     const abs  = Math.abs;
     const floor = Math.floor;
     const ceil  = Math.ceil;
     ${buildContext()}
     return (${expr});`,
  );
  return fn(...vals);
}

export function resolveVars(question: Question): ResolvedVars {
  const vars = question.variables;
  const resolved: ResolvedVars = {};

  for (const [key, def] of Object.entries(vars)) {
    if (def.type === "int") {
      resolved[key] =
        Math.floor(Math.random() * (def.max - def.min + 1)) + def.min;
    } else if (def.type === "float") {
      const raw = Math.random() * (def.max - def.min) + def.min;
      resolved[key] = parseFloat(raw.toFixed(def.dp));
    } else if (def.type === "pick") {
      resolved[key] =
        def.options[Math.floor(Math.random() * def.options.length)]!;
    } else if (def.type === "derived") {
      resolved[key] = evalExpr(def.expr, resolved);
    }
  }

  return resolved;
}

export function resolveTemplate(template: string, vars: ResolvedVars): string {
  return template.replace(/\{\{(.+?)\}\}/g, (_, expr) => {
    try {
      return String(evalExpr(expr.trim(), vars));
    } catch {
      return `{{${expr}}}`;
    }
  });
}

export function resolveAnswer(question: Question, vars: ResolvedVars): string {
  const cfg = question.answerConfig;

  switch (cfg.type) {
    case "number":
      return String(evalExpr(cfg.answer, vars));

    case "text":
      return resolveTemplate(
        cfg.textAnswer ?? (cfg as { answer?: string }).answer ?? "",
        vars,
      );

    case "fill_blank":
      return JSON.stringify(
        cfg.answers.map((blank) =>
          blank.map((ans) => resolveTemplate(ans, vars)),
        ),
      );

    case "true_false":
      return String(cfg.answer);

    case "multiple_choice":
      return resolveTemplate(cfg.answer, vars);

    case "multi_select":
      return JSON.stringify(
        cfg.correctOptions.map((o) => resolveTemplate(o, vars)).sort(),
      );

    case "matching":
      return JSON.stringify(
        Object.fromEntries(cfg.pairs.map((p) => [p.left, p.right])),
      );

    case "ordering":
      return JSON.stringify(cfg.items);

    case "multi_part":
      return JSON.stringify(
        cfg.parts.map((p) => ({
          label: p.label,
          answer: String(evalExpr(p.answer, vars)),
          unit: p.unit,
        })),
      );

    case "long_form":
      return "";

    default:
      return "";
  }
}
