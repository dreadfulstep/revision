export const CARD_BG   = "#1e1e2e";  // dark base
export const GRID_LINE = "#2a2a3e";  // subtle grid lines
export const STROKE    = "#a0a0c0";  // lines, axes, triangle sides
export const TEXT      = "#e2e2f0";  // primary text (off-white)
export const TEXT_DIM  = "#8888aa";  // muted labels, axis numbers
export const BLUE_FILL = "#3b5bdb";  // shape fills (triangles, sectors)
export const BLUE_STR  = "#748ffc";  // shape strokes, line labels
export const AMBER     = "#f59f00";  // unknown values, angle arcs
export const GREEN     = "#40c057";  // graph lines, number line regions
export const RED       = "#ff6b6b";  // negative highlights
export const PURPLE    = "#cc5de8";  // extra accent (bar charts etc.)
 
export function svgWrap(W: number, H: number, content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;border-radius:10px">
  <rect width="${W}" height="${H}" fill="${CARD_BG}" rx="10"/>
  <style>
    text  { font-family: sans-serif; font-size: 12px; fill: ${TEXT}; }
    .dim  { fill: ${TEXT_DIM}; }
    .lbl  { fill: ${TEXT}; font-size: 12px; }
    .unkn { fill: ${AMBER}; font-size: 14px; font-weight: bold; }
    .eq   { fill: ${BLUE_STR}; font-size: 11px; font-weight: bold; }
  </style>
  ${content}
</svg>`;
}
 