import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderBearingDiagram(vars: ResolvedVars): string {
  const bearing = Number(vars.bearing ?? 60);
  const W = 240, H = 230;
  const cx = W / 2, cy = H / 2 + 8;
  const lineLen = 85;
  const r = 38;

  const northAngle = -Math.PI / 2;
  const bearingAngle = northAngle + (bearing * Math.PI) / 180;

  const northEndX = cx + lineLen * Math.cos(northAngle);
  const northEndY = cy + lineLen * Math.sin(northAngle);
  const bearEndX  = cx + lineLen * Math.cos(bearingAngle);
  const bearEndY  = cy + lineLen * Math.sin(bearingAngle);

  const largeArc = bearing > 180 ? 1 : 0;
  const arcStartX = cx + r * Math.cos(northAngle);
  const arcStartY = cy + r * Math.sin(northAngle);
  const arcEndX   = cx + r * Math.cos(bearingAngle);
  const arcEndY   = cy + r * Math.sin(bearingAngle);

  const arcFill = `<path d="M ${cx} ${cy} L ${arcStartX.toFixed(2)} ${arcStartY.toFixed(2)}
    A ${r} ${r} 0 ${largeArc} 1 ${arcEndX.toFixed(2)} ${arcEndY.toFixed(2)} Z"
    fill="${AMBER}" fill-opacity="0.22" stroke="none"/>`;
  const arcBord = `<path d="M ${arcStartX.toFixed(2)} ${arcStartY.toFixed(2)}
    A ${r} ${r} 0 ${largeArc} 1 ${arcEndX.toFixed(2)} ${arcEndY.toFixed(2)}"
    fill="none" stroke="${AMBER}" stroke-width="1.4" stroke-opacity="0.8"/>`;

  function arrowHead(ex: number, ey: number, angle: number, color: string) {
    const as = 10;
    return `<polygon points="${ex.toFixed(2)},${ey.toFixed(2)}
      ${(ex - as*Math.cos(angle-0.35)).toFixed(2)},${(ey - as*Math.sin(angle-0.35)).toFixed(2)}
      ${(ex - as*Math.cos(angle+0.35)).toFixed(2)},${(ey - as*Math.sin(angle+0.35)).toFixed(2)}"
      fill="${color}"/>`;
  }

  return svgWrap(W, H, `
    ${arcFill}
    <line x1="${cx}" y1="${cy}" x2="${northEndX.toFixed(2)}" y2="${northEndY.toFixed(2)}"
      stroke="${STROKE_DIM}" stroke-width="1.8" stroke-dasharray="5 3"/>
    ${arrowHead(northEndX, northEndY, northAngle, STROKE_DIM)}
    <text text-anchor="middle" x="${northEndX.toFixed(2)}" y="${(northEndY - 8).toFixed(2)}"
      class="dim" font-size="13" font-weight="600">N</text>
    <line x1="${cx}" y1="${cy}" x2="${bearEndX.toFixed(2)}" y2="${bearEndY.toFixed(2)}"
      stroke="${BLUE_STR}" stroke-width="2.5"/>
    ${arrowHead(bearEndX, bearEndY, bearingAngle, BLUE_STR)}
    ${arcBord}
    <circle cx="${cx}" cy="${cy}" r="3.5" fill="${STROKE}"/>
    <text text-anchor="middle" x="${W/2}" y="${H - 4}" class="dim">Bearing from North, clockwise</text>
  `);
}