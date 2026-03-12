import { ResolvedVars } from "../types/template";

export function renderRightTriangle(vars: ResolvedVars): string {
  const a = Number(vars.a); // vertical leg
  const b = Number(vars.b); // horizontal leg

  // Determine which side is unknown
  const findA   = Boolean(vars.find_a);
  const findB   = Boolean(vars.find_b);
  const findHyp = !findA && !findB; // hyp is unknown only if neither leg is

  const hyp = Math.sqrt(a * a + b * b);

  const aLabel   = findA   ? "x" : `${a} cm`;
  const bLabel   = findB   ? "x" : `${b} cm`;
  const hypLabel = findHyp ? "x" : `${hyp.toFixed(2)} cm`;

  const W = 260;
  const H = 220;

  const padL = 52;
  const padR = 28;
  const padT = 24;
  const padB = 36;

  const drawW = W - padL - padR;
  const drawH = H - padT - padB;

  const scale = Math.min(drawW / b, drawH / a);
  const pw = b * scale;
  const ph = a * scale;

  const offX = (drawW - pw) / 2;
  const offY = (drawH - ph) / 2;

  const x0 = padL + offX;        // bottom-left (right angle)
  const y0 = padT + offY + ph;
  const x1 = padL + offX + pw;   // bottom-right
  const y1 = y0;
  const x2 = x0;                 // top-left
  const y2 = padT + offY;

  const sq = 9;
  const rightAngle = `M ${x0} ${y0 - sq} L ${x0 + sq} ${y0 - sq} L ${x0 + sq} ${y0}`;

  const labelAx = x0 - 22;
  const labelAy = (y0 + y2) / 2 + 4;

  const labelBx = (x0 + x1) / 2;
  const labelBy = y0 + 20;

  const hypMidX = (x1 + x2) / 2;
  const hypMidY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const normX = -dy / len;
  const normY = dx / len;
  const labelCx = hypMidX + normX * 18;
  const labelCy = hypMidY + normY * 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">
  <style>
    text { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .unknown { font-weight: bold; font-size: 14px; fill: currentColor; }
    .side { stroke: currentColor; stroke-width: 2; fill: none; }
  </style>
  <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}" class="side" />
  <path d="${rightAngle}" class="side" stroke-width="1.5" />
  <text text-anchor="middle" x="${labelAx}" y="${labelAy}" class="${findA ? "unknown" : ""}">${aLabel}</text>
  <text text-anchor="middle" x="${labelBx}" y="${labelBy}" class="${findB ? "unknown" : ""}">${bLabel}</text>
  <text text-anchor="middle" x="${labelCx}" y="${labelCy}" class="${findHyp ? "unknown" : ""}">${hypLabel}</text>
</svg>`;
}