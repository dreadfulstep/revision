import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderTransformationGrid(vars: ResolvedVars): string {
  const type = String(vars.type ?? "reflection");
  const W = 260, H = 260;
  const cx = W / 2, cy = H / 2;
  const scale = 22, gridMax = 5;

  const grid = Array.from({ length: gridMax * 2 + 1 }, (_, i) => {
    const v = i - gridMax;
    const px = cx + v * scale;
    const py = cy + v * scale;
    return `
      <line x1="${px}" y1="${cy-gridMax*scale}" x2="${px}" y2="${cy+gridMax*scale}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>
      <line x1="${cx-gridMax*scale}" y1="${py}" x2="${cx+gridMax*scale}" y2="${py}"
        stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>
      ${v !== 0 ? `<text x="${cx + v*scale}" y="${cy + 14}" text-anchor="middle" class="dim" font-size="9">${v}</text>` : ""}
      ${v !== 0 ? `<text x="${cx - 10}" y="${cy - v*scale + 4}" text-anchor="end" class="dim" font-size="9">${v}</text>` : ""}
    `;
  }).join("");

  const axes = `
    <line x1="${cx-gridMax*scale-8}" y1="${cy}" x2="${cx+gridMax*scale+8}" y2="${cy}" stroke="${STROKE}" stroke-width="1.5"/>
    <line x1="${cx}" y1="${cy+gridMax*scale+8}" x2="${cx}" y2="${cy-gridMax*scale-8}" stroke="${STROKE}" stroke-width="1.5"/>
  `;

  function polygon(points: [number, number][], color: string, opacity: number, stroke: string) {
    const pts = points.map(([x, y]) => `${(cx + x*scale).toFixed(1)},${(cy - y*scale).toFixed(1)}`).join(" ");
    return `<polygon points="${pts}" fill="${color}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="2"/>`;
  }

  function label(x: number, y: number, text: string, cls: string) {
    return `<text text-anchor="middle" x="${(cx + x*scale).toFixed(1)}" y="${(cy - y*scale + 5).toFixed(1)}" class="${cls}" font-size="12">${text}</text>`;
  }

  const origPts: [number, number][] = [[1,1],[3,1],[2,3]];

  if (type === "reflection") {
    const reflPts = origPts.map(([x, y]) => [-x, y] as [number, number]);
    return svgWrap(W, H, `
      ${grid}${axes}
      <!-- Mirror line (y-axis highlighted) -->
      <line x1="${cx}" y1="${cy-gridMax*scale}" x2="${cx}" y2="${cy+gridMax*scale}"
        stroke="${AMBER}" stroke-width="2.5" opacity="0.6"/>
      <text x="${cx + 4}" y="${cy - gridMax*scale - 6}" class="lbl" font-size="10">mirror line</text>
      ${polygon(origPts, AMBER, 0.2, AMBER)}
      ${polygon(reflPts, BLUE_STR, 0.2, BLUE_STR)}
      ${label(2, 1.3, "A", "lbl")}
      ${label(-2, 1.3, "A'", "unkn")}
      <text text-anchor="middle" x="${W/2}" y="${H-4}" class="dim">Reflection in the y-axis</text>
    `);
  }

  if (type === "rotation") {
    const rotPts = origPts.map(([x, y]) => [-y, x] as [number, number]);
    return svgWrap(W, H, `
      ${grid}${axes}
      ${polygon(origPts, AMBER, 0.2, AMBER)}
      ${polygon(rotPts, BLUE_STR, 0.2, BLUE_STR)}
      <!-- Rotation arc -->
      <path d="M ${(cx + 1.5*scale).toFixed(1)} ${(cy - 0.5*scale).toFixed(1)}
        A ${(1.6*scale).toFixed(1)} ${(1.6*scale).toFixed(1)} 0 0 0
        ${(cx + 0.5*scale).toFixed(1)} ${(cy - 1.5*scale).toFixed(1)}"
        fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" stroke-dasharray="4 3"/>
      <circle cx="${cx}" cy="${cy}" r="4" fill="${STROKE}"/>
      ${label(2, 2, "A", "lbl")}
      ${label(-2.2, 2, "A'", "unkn")}
      <text text-anchor="middle" x="${W/2}" y="${H-4}" class="dim">Rotation 90° anticlockwise about origin</text>
    `);
  }

  const tx = 2, ty = -1;
  const transPts = origPts.map(([x, y]) => [x + tx, y + ty] as [number, number]);
  return svgWrap(W, H, `
    ${grid}${axes}
    ${polygon(origPts, AMBER, 0.2, AMBER)}
    ${polygon(transPts, BLUE_STR, 0.2, BLUE_STR)}
    <!-- Translation arrows -->
    ${origPts.map(([x, y], i) => {
      const nx = transPts[i]![0], ny = transPts[i]![1];
      return `<line x1="${(cx+x*scale).toFixed(1)}" y1="${(cy-y*scale).toFixed(1)}"
        x2="${(cx+nx*scale).toFixed(1)}" y2="${(cy-ny*scale).toFixed(1)}"
        stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/>`;
    }).join("")}
    ${label(2, 2, "A", "lbl")}
    ${label(2+tx, 2+ty+0.5, "A'", "unkn")}
  `);
}