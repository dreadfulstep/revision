import { ResolvedVars } from "../types/template";

export function renderRightTriangle(vars: ResolvedVars): string {
  const a = Number(vars.a); // vertical leg
  const b = Number(vars.b); // horizontal leg
  const showHyp =
    vars.find_hypotenuse !== undefined ? Boolean(vars.find_hypotenuse) : true;

  const W = 200;
  const H = 160;
  const pad = 30;

  const maxLeg = Math.max(a, b);
  const scale = (Math.min(W, H) - pad * 2) / maxLeg;
  const pw = b * scale; // pixel width
  const ph = a * scale; // pixel height

  // Right angle corner is bottom-left
  const x0 = pad;
  const y0 = H - pad;
  const x1 = pad + pw; // bottom-right
  const y1 = H - pad;
  const x2 = pad; // top-left
  const y2 = H - pad - ph;

  // Right angle marker
  const sq = 10;
  const rightAngle = `M ${x0} ${y0 - sq} L ${x0 + sq} ${y0 - sq} L ${x0 + sq} ${y0}`;

  const labelAx = x0 - 18;
  const labelAy = (y0 + y2) / 2 + 4;
  const labelBx = (x0 + x1) / 2;
  const labelBy = y0 + 16;
  const labelCx = (x1 + x2) / 2 + 14;
  const labelCy = (y1 + y2) / 2 - 6;

  const hypLabel = showHyp ? "x" : `${Math.sqrt(a * a + b * b).toFixed(2)} cm`;
  const aLabel = vars.find_a ? "x" : `${a} cm`;
  const bLabel = vars.find_b ? "x" : `${b} cm`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <style>
    text { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .unknown { font-weight: bold; font-size: 14px; }
    line, path { stroke: currentColor; stroke-width: 1.8; fill: none; }
  </style>

  <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}"
    stroke="currentColor" stroke-width="1.8" fill="none" />

  <path d="${rightAngle}" stroke="currentColor" stroke-width="1.5" fill="none" />

  <text text-anchor="middle" x="${labelAx}" y="${labelAy}" class="${vars.find_a ? "unknown" : ""}">${aLabel}</text>
  <text text-anchor="middle" x="${labelBx}" y="${labelBy}" class="${vars.find_b ? "unknown" : ""}">${bLabel}</text>
  <text text-anchor="middle" x="${labelCx}" y="${labelCy}" class="${showHyp ? "unknown" : ""}">${hypLabel}</text>
</svg>`;
}
