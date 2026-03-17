import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, BLUE_STR, AMBER } from "./colours";

export function renderAlgebraGraph(vars: ResolvedVars): string {
  const type = String(vars.graph_type ?? "quadratic");
  const a    = Number(vars.a ?? 1);
  const b    = Number(vars.b ?? 0);
  const c    = Number(vars.c ?? -4);
  const W = 260, H = 250;
  const cx = W / 2, cy = H / 2;
  const scale = 22, gridMax = 5;

  const grid = Array.from({ length: gridMax * 2 + 1 }, (_, i) => {
    const v = i - gridMax;
    const px = cx + v * scale;
    const py = cy + v * scale;
    return `
      <line x1="${px}" y1="${cy - gridMax*scale}" x2="${px}" y2="${cy + gridMax*scale}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.25"/>
      <line x1="${cx - gridMax*scale}" y1="${py}" x2="${cx + gridMax*scale}" y2="${py}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.25"/>
      ${v !== 0 ? `<text x="${cx + v*scale}" y="${cy + 14}" text-anchor="middle" class="dim" font-size="9">${v}</text>` : ""}
      ${v !== 0 ? `<text x="${cx - 8}" y="${cy - v*scale + 4}" text-anchor="end" class="dim" font-size="9">${v}</text>` : ""}
    `;
  }).join("");

  const axes = `
    <line x1="${cx - gridMax*scale - 10}" y1="${cy}" x2="${cx + gridMax*scale + 10}" y2="${cy}"
      stroke="${STROKE}" stroke-width="1.8"/>
    <line x1="${cx}" y1="${cy + gridMax*scale + 10}" x2="${cx}" y2="${cy - gridMax*scale - 10}"
      stroke="${STROKE}" stroke-width="1.8"/>
    <text x="${cx + gridMax*scale + 12}" y="${cy + 4}" class="dim" font-size="10">x</text>
    <text x="${cx + 4}" y="${cy - gridMax*scale - 12}" class="dim" font-size="10">y</text>
  `;

  function plotCurve(fn: (x: number) => number, color: string, steps = 200) {
    const xMin = -gridMax, xMax = gridMax;
    const segments: string[][] = [];
    let current: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * i / steps;
      const y = fn(x);

      if (!isFinite(y) || Math.abs(y) > gridMax * 2) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }

      const px = cx + x * scale;
      const py = cy - y * scale;
      if (py < -10 || py > H + 10 || px < -10 || px > W + 10) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }

      current.push(`${current.length === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
    }
    if (current.length > 1) segments.push(current);

    return segments.map(seg =>
      `<path d="${seg.join(" ")}" fill="none" stroke="${color}" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>`
    ).join("");
  }

  if (type === "quadratic") {
    const curve = plotCurve(x => a*x*x + b*x + c, BLUE_STR);
    const label = `y = ${a !== 1 ? a : ""}x²${b !== 0 ? (b > 0 ? `+${b}x` : `${b}x`) : ""}${c !== 0 ? (c > 0 ? `+${c}` : c) : ""}`;
    return svgWrap(W, H, `
      ${grid}${axes}${curve}
      <text text-anchor="end" x="${cx + gridMax*scale - 4}" y="${cy - gridMax*scale + 16}"
        class="lbl" font-size="11">${label}</text>
    `);
  }

  if (type === "cubic") {
    const curve = plotCurve(x => a*x*x*x + b*x + c, BLUE_STR);
    const label = `y = ${a !== 1 ? a : ""}x³${b !== 0 ? (b > 0 ? `+${b}x` : `${b}x`) : ""}${c !== 0 ? (c > 0 ? `+${c}` : c) : ""}`;
    return svgWrap(W, H, `
      ${grid}${axes}${curve}
      <text text-anchor="end" x="${cx + gridMax*scale - 4}" y="${cy - gridMax*scale + 16}"
        class="lbl" font-size="11">${label}</text>
    `);
  }

  if (type === "reciprocal") {
    const gap = 0.15;
    const positiveBranch = plotCurve(x => x > gap ? a / x : NaN, BLUE_STR);
    const negativeBranch = plotCurve(x => x < -gap ? a / x : NaN, BLUE_STR);
    const label = `y = ${a}/x`;
    return svgWrap(W, H, `
      ${grid}${axes}
      ${positiveBranch}
      ${negativeBranch}
      <text text-anchor="end" x="${cx + gridMax*scale - 4}" y="${cy - gridMax*scale + 16}"
        class="lbl" font-size="11">${label}</text>
    `);
  }

  if (type === "exponential") {
    const curve = plotCurve(x => a * Math.pow(2, x) + c, AMBER);
    const label = `y = ${a}·2ˣ${c !== 0 ? (c > 0 ? `+${c}` : c) : ""}`;
    return svgWrap(W, H, `
      ${grid}${axes}${curve}
      <text text-anchor="end" x="${cx + gridMax*scale - 4}" y="${cy - gridMax*scale + 16}"
        class="lbl" font-size="11">${label}</text>
    `);
  }

  return svgWrap(W, H, `${grid}${axes}`);
}