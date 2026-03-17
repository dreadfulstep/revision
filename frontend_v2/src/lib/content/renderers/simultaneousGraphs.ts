import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderSimultaneousGraphs(vars: ResolvedVars): string {
  const m1 = Number(vars.m1 ?? 2);
  const c1 = Number(vars.c1 ?? 1);
  const m2 = Number(vars.m2 ?? -1);
  const c2 = Number(vars.c2 ?? 4);
  const W = 260, H = 260;
  const cx = W / 2, cy = H / 2;
  const scale = 22;
  const gridMax = 5;

  function linePoints(m: number, c: number) {
    const x1 = -gridMax, x2 = gridMax;
    return {
      x1: cx + x1 * scale, y1: cy - (m * x1 + c) * scale,
      x2: cx + x2 * scale, y2: cy - (m * x2 + c) * scale,
    };
  }

  const l1 = linePoints(m1, c1);
  const l2 = linePoints(m2, c2);

  const gridLines = Array.from({ length: gridMax * 2 + 1 }, (_, i) => {
    const v = i - gridMax;
    const px = cx + v * scale;
    const py = cy + v * scale;
    return `
      <line x1="${px}" y1="${cy-gridMax*scale}" x2="${px}" y2="${cy+gridMax*scale}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>
      <line x1="${cx-gridMax*scale}" y1="${py}" x2="${cx+gridMax*scale}" y2="${py}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>
    `;
  }).join("");

  return svgWrap(W, H, `
    ${gridLines}
    <line x1="${cx-gridMax*scale-8}" y1="${cy}" x2="${cx+gridMax*scale+8}" y2="${cy}" stroke="${STROKE}" stroke-width="1.5"/>
    <line x1="${cx}" y1="${cy+gridMax*scale+8}" x2="${cx}" y2="${cy-gridMax*scale-8}" stroke="${STROKE}" stroke-width="1.5"/>
    <text x="${cx+gridMax*scale+10}" y="${cy+4}" class="dim" font-size="10">x</text>
    <text x="${cx+3}" y="${cy-gridMax*scale-10}" class="dim" font-size="10">y</text>
    <line x1="${l1.x1}" y1="${l1.y1}" x2="${l1.x2}" y2="${l1.y2}"
      stroke="${AMBER}" stroke-width="2.2"/>
    <text x="${l1.x2 - 30}" y="${l1.y2 - 6}" class="lbl" font-size="11">y=${m1}x+${c1}</text>
    <line x1="${l2.x1}" y1="${l2.y1}" x2="${l2.x2}" y2="${l2.y2}"
      stroke="${BLUE_STR}" stroke-width="2.2"/>
    <text x="${l2.x2 - 30}" y="${l2.y2 + 14}" class="lbl" font-size="11">y=${m2}x+${c2}</text>
  `);
}