import { ResolvedVars } from "../types/template";
import { svgWrap, STROKE, TEXT_DIM, BLUE_FILL, BLUE_STR, AMBER } from "./colours";

export function renderCompoundShape(vars: ResolvedVars): string {
  const W1 = Number(vars.W1 ?? 8);
  const H1 = Number(vars.H1 ?? 6);
  const W2 = Number(vars.W2 ?? 3);
  const H2 = Number(vars.H2 ?? 2);
  const hide = String(vars.hide ?? "none");

  const W3 = W1 - W2;
  const H3 = H1 - H2;

  const svgW = 260, svgH = 200;
  const pad  = 32;

  const scale = Math.min((svgW - pad * 2) / W1, (svgH - pad * 2) / H1);
  const pw1 = W1 * scale, ph1 = H1 * scale;
  const pw2 = W2 * scale, ph2 = H2 * scale;

  const ox = (svgW - pw1) / 2;
  const oy = (svgH - ph1) / 2;

  const path = [
    `M ${ox} ${oy + ph1}`,
    `L ${ox + pw1} ${oy + ph1}`,
    `L ${ox + pw1} ${oy + ph2}`,
    `L ${ox + pw3()} ${oy + ph2}`,
    `L ${ox + pw3()} ${oy}`,
    `L ${ox} ${oy}`,
    "Z",
  ].join(" ");

  function pw3() { return W3 * scale; }

  // Label helpers
  function label(val: number, key: string, x: number, y: number, anchor = "middle") {
    const isHidden = hide === key;
    const text     = isHidden ? "x" : `${val} cm`;
    const cls      = isHidden ? "unkn" : "lbl";
    return `<text text-anchor="${anchor}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="${cls}">${text}</text>`;
  }

  // Dimension line tick helper
  function dimLine(x1: number, y1: number, x2: number, y2: number) {
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${TEXT_DIM}" stroke-width="0.8" stroke-dasharray="3 2"/>`;
  }

  const labels = [
    // W1 — bottom, below shape
    label(W1, "W1", ox + pw1 / 2, oy + ph1 + 18),
    // H1 — left side
    label(H1, "H1", ox - 18, oy + ph1 / 2),
    // W2 — top notch width, above notch
    label(W2, "W2", ox + pw3() + pw2 / 2, oy - 10),
    // H2 — right notch height
    label(H2, "H2", ox + pw1 + 18, oy + ph2 / 2),
    // W3 — bottom-left width (derived)
    label(W3, "W3", ox + pw3() / 2, oy + 14),
    // H3 — right tall section height (derived)
    label(H3, "H3", ox + pw1 + 18, oy + ph2 + (H3 * scale) / 2),
  ].join("\n  ");

  return svgWrap(svgW, svgH, `
  <path d="${path}" fill="${BLUE_FILL}" fill-opacity="0.3" stroke="${BLUE_STR}" stroke-width="2" stroke-linejoin="round"/>
  ${labels}`);
}