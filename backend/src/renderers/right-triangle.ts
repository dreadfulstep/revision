import { ResolvedVars } from "../types/template";

export function renderRightTriangle(vars: ResolvedVars): string {
  const a = Number(vars.a); // vertical leg
  const b = Number(vars.b); // horizontal leg

  const showHyp = vars.find_hypotenuse !== undefined ? Boolean(vars.find_hypotenuse) : true;

  const W = 260;
  const H = 220;

  // Generous padding to prevent clipping of labels
  const padL = 52; // left — room for vertical label
  const padR = 28;
  const padT = 24;
  const padB = 36; // bottom — room for horizontal label

  const drawW = W - padL - padR;
  const drawH = H - padT - padB;

  // Scale so triangle fills the draw area, maintaining aspect ratio
  const scale = Math.min(drawW / b, drawH / a);
  const pw = b * scale;
  const ph = a * scale;

  // Centre the triangle in the draw area
  const offX = (drawW - pw) / 2;
  const offY = (drawH - ph) / 2;

  // Right-angle corner at bottom-left of draw area
  const x0 = padL + offX;           // bottom-left (right angle)
  const y0 = padT + offY + ph;      // bottom-left
  const x1 = padL + offX + pw;      // bottom-right
  const y1 = y0;                    // same row
  const x2 = x0;                    // top-left
  const y2 = padT + offY;           // top-left

  // Right-angle square marker
  const sq = 9;
  const rightAngle = `M ${x0} ${y0 - sq} L ${x0 + sq} ${y0 - sq} L ${x0 + sq} ${y0}`;

  // Label positions — kept well clear of edges
  const labelAx = x0 - 22;
  const labelAy = (y0 + y2) / 2 + 4;

  const labelBx = (x0 + x1) / 2;
  const labelBy = y0 + 20;

  // Hypotenuse midpoint + perpendicular offset
  const hypMidX = (x1 + x2) / 2;
  const hypMidY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const normX = -dy / len;
  const normY = dx / len;
  const labelCx = hypMidX + normX * 18;
  const labelCy = hypMidY + normY * 18;

  const hypLabel = showHyp ? "x" : `${Math.sqrt(a * a + b * b).toFixed(2)} cm`;
  const aLabel = vars.find_a ? "x" : `${a} cm`;
  const bLabel = vars.find_b ? "x" : `${b} cm`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">
  <style>
    text { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .unknown { font-weight: bold; font-size: 14px; fill: currentColor; }
    .side { stroke: currentColor; stroke-width: 2; fill: none; }
  </style>
  <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}" class="side" />
  <path d="${rightAngle}" class="side" stroke-width="1.5" />
  <text text-anchor="middle" x="${labelAx}" y="${labelAy}" class="${vars.find_a ? "unknown" : ""}">${aLabel}</text>
  <text text-anchor="middle" x="${labelBx}" y="${labelBy}" class="${vars.find_b ? "unknown" : ""}">${bLabel}</text>
  <text text-anchor="middle" x="${labelCx}" y="${labelCy}" class="${showHyp ? "unknown" : ""}">${hypLabel}</text>
</svg>`;
}