import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, BLUE_STR } from "./colours";

export function renderCoordinateGrid(vars: ResolvedVars): string {
  const m = Number(vars.m ?? 1);
  const c = Number(vars.c ?? 0);
  const W = 260, H = 260;
  const cx = W / 2, cy = H / 2;
  const scale = 22;
  const gridMax = 5;

  const gridLines: string[] = [];
  for (let i = -gridMax; i <= gridMax; i++) {
    const px = cx + i * scale;
    const py = cy + i * scale;
    const dim = STROKE_DIM;
    gridLines.push(`
      <line x1="${px}" y1="${cy - gridMax*scale}" x2="${px}" y2="${cy + gridMax*scale}"
        stroke="${dim}" stroke-width="0.5" opacity="0.4"/>
      <line x1="${cx - gridMax*scale}" y1="${py}" x2="${cx + gridMax*scale}" y2="${py}"
        stroke="${dim}" stroke-width="0.5" opacity="0.4"/>
    `);
    if (i !== 0) {
      gridLines.push(`
        <text x="${cx + i*scale}" y="${cy + 14}" text-anchor="middle" class="dim" font-size="9">${i}</text>
        <text x="${cx - 10}" y="${cy - i*scale + 4}" text-anchor="end" class="dim" font-size="9">${i}</text>
      `);
    }
  }

  const axes = `
    <line x1="${cx - gridMax*scale - 10}" y1="${cy}" x2="${cx + gridMax*scale + 10}" y2="${cy}"
      stroke="${STROKE}" stroke-width="1.5"/>
    <line x1="${cx}" y1="${cy + gridMax*scale + 10}" x2="${cx}" y2="${cy - gridMax*scale - 10}"
      stroke="${STROKE}" stroke-width="1.5"/>
    <text x="${cx + gridMax*scale + 14}" y="${cy + 4}" class="dim" font-size="10">x</text>
    <text x="${cx + 4}" y="${cy - gridMax*scale - 12}" class="dim" font-size="10">y</text>
  `;

  const x1v = -gridMax, x2v = gridMax;
  const y1v = m * x1v + c, y2v = m * x2v + c;
  const px1 = cx + x1v * scale, py1 = cy - y1v * scale;
  const px2 = cx + x2v * scale, py2 = cy - y2v * scale;

  const line = `
    <line x1="${px1}" y1="${py1}" x2="${px2}" y2="${py2}"
      stroke="${BLUE_STR}" stroke-width="2.5" stroke-linecap="round"/>
  `;

  return svgWrap(W, H, `
    ${gridLines.join("")}
    ${axes}
    ${line}
  `);
}