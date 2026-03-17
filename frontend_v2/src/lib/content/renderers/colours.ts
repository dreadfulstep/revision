export const STROKE    = "oklch(1 0 0)";
export const STROKE_DIM = "oklch(0.45 0 0)";
export const AMBER     = "oklch(0.78 0.17 52)";
export const BLUE_FILL = "oklch(0.65 0.18 250)";
export const BLUE_STR  = "oklch(0.72 0.18 250)";
export const GREEN     = "oklch(0.72 0.18 145)";
export const RED       = "oklch(0.65 0.22 27)";
export const PINK      = "oklch(0.72 0.18 320)";
export const TEXT_DIM  = "oklch(0.50 0 0)";

export function svgWrap(w: number, h: number, inner: string): string {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;max-width:${w}px;height:auto;display:block;margin:0 auto">
    <style>
      .lbl  { font: 600 13px system-ui,sans-serif; fill: ${STROKE}; }
      .unkn { font: 700 14px system-ui,sans-serif; fill: ${BLUE_STR}; }
      .dim  { font: 400 11px system-ui,sans-serif; fill: ${TEXT_DIM}; }
      .green { font: 700 13px system-ui,sans-serif; fill: ${GREEN}; }
      .red  { font: 700 13px system-ui,sans-serif; fill: ${RED}; }
    </style>
    ${inner}
  </svg>`;
}

export function angleArc(
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number,
  fill: string, sweep: 0 | 1 = 1,
  opacity = 0.22
): string {
  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);
  return `<path d="M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)} Z"
    fill="${fill}" fill-opacity="${opacity}" stroke="none"/>`;
}

export function arcBorder(
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number,
  color: string, sweep: 0 | 1 = 1
): string {
  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);
  return `<path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}"
    fill="none" stroke="${color}" stroke-width="1.2" stroke-opacity="0.7"/>`;
}