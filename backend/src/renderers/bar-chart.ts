import { ResolvedVars } from "../types/template";
import { svgWrap, STROKE, TEXT_DIM, BLUE_FILL, BLUE_STR, AMBER, GREEN, PURPLE } from "./colours";

const BAR_COLOURS = [BLUE_FILL, AMBER, GREEN, PURPLE, BLUE_STR];

export function renderBarChart(vars: ResolvedVars): string {
  let labels: string[] = [];
  let values: number[] = [];
  try { labels = JSON.parse(String(vars.labels ?? "[]")); } catch { labels = []; }
  try { values = JSON.parse(String(vars.values ?? "[]")); } catch { values = []; }

  const yLabel  = String(vars.y_label  ?? "Frequency");
  const hideBar = vars.hide_bar !== undefined ? Number(vars.hide_bar) : -1;
  const n       = Math.min(labels.length, values.length);

  const W = 260, H = 200;
  const padL = 36, padR = 12, padT = 16, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...values, 1);
  // Nice y-axis max: round up to nearest 2
  const yMax   = Math.ceil(maxVal / 2) * 2;
  const barW   = chartW / n;
  const gapPct = 0.25; // 25% gap each side

  function vy(v: number) { return padT + chartH * (1 - v / yMax); }

  // Y-axis gridlines + labels
  let yLines = "";
  const yStep = yMax <= 8 ? 1 : yMax <= 20 ? 2 : 5;
  for (let y = 0; y <= yMax; y += yStep) {
    const py = vy(y);
    yLines += `<line x1="${padL}" y1="${py.toFixed(1)}" x2="${W - padR}" y2="${py.toFixed(1)}" stroke="#2a2a3e" stroke-width="0.8"/>`;
    yLines += `<text x="${(padL - 4).toFixed(1)}" y="${(py + 4).toFixed(1)}" text-anchor="end" fill="${TEXT_DIM}" font-size="10">${y}</text>`;
  }

  // Bars
  let bars = "";
  for (let i = 0; i < n; i++) {
    const bx     = padL + i * barW + barW * gapPct;
    const bw     = barW * (1 - gapPct * 2);
    const val    = values[i];
    const by     = vy(val);
    const bh     = chartH - (by - padT);
    const colour = BAR_COLOURS[i % BAR_COLOURS.length];
    const hidden = i === hideBar;

    if (hidden) {
      bars += `<rect x="${bx.toFixed(1)}" y="${padT}" width="${bw.toFixed(1)}" height="${chartH}" fill="#2a2a3e" stroke="#444466" stroke-width="1" stroke-dasharray="4 3"/>`;
      bars += `<text text-anchor="middle" x="${(bx + bw / 2).toFixed(1)}" y="${(padT + chartH / 2 + 5).toFixed(1)}" fill="${AMBER}" font-size="14" font-weight="bold">?</text>`;
    } else {
      bars += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${colour}" fill-opacity="0.8" rx="2"/>`;
      bars += `<text text-anchor="middle" x="${(bx + bw / 2).toFixed(1)}" y="${(by - 4).toFixed(1)}" fill="${colour}" font-size="10">${val}</text>`;
    }

    bars += `<text text-anchor="middle" x="${(bx + bw / 2).toFixed(1)}" y="${(H - padB + 14).toFixed(1)}" fill="${TEXT_DIM}" font-size="10">${labels[i]}</text>`;
  }

  const axes = `
  <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="${STROKE}" stroke-width="1.5"/>
  <line x1="${padL}" y1="${padT + chartH}" x2="${W - padR}" y2="${padT + chartH}" stroke="${STROKE}" stroke-width="1.5"/>`;

  const yLabelSvg = `<text transform="rotate(-90)" x="${-(padT + chartH / 2)}" y="11" text-anchor="middle" fill="${TEXT_DIM}" font-size="10">${yLabel}</text>`;

  return svgWrap(W, H, `${yLines}${axes}${bars}${yLabelSvg}`);
}