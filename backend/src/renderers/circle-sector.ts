import { ResolvedVars } from "../types/template";
import {
  svgWrap,
  STROKE,
  AMBER,
  BLUE_FILL,
  BLUE_STR,
  TEXT_DIM,
} from "./colours";

export function renderCircleSector(vars: ResolvedVars): string {
  const r = Number(vars.r ?? 6);
  const angle = Number(vars.angle ?? 90);
  const showArc = Number(vars.show_arc ?? 1) === 1;

  const W = 260,
    H = 220;
  const cx = 115,
    cy = 112,
    svgR = 82;

  const sRad = -Math.PI / 2;
  const eRad = sRad + (angle * Math.PI) / 180;
  const large = angle > 180 ? 1 : 0;

  const x1 = cx + svgR * Math.cos(sRad),
    y1 = cy + svgR * Math.sin(sRad);
  const x2 = cx + svgR * Math.cos(eRad),
    y2 = cy + svgR * Math.sin(eRad);

  const midRad = sRad + (angle * Math.PI) / 360;
  const aLx = cx + 30 * Math.cos(midRad);
  const aLy = cy + 30 * Math.sin(midRad) + 4;
  const rLx = cx + (svgR / 2) * Math.cos(sRad) + 12;
  const rLy = cy + (svgR / 2) * Math.sin(sRad) - 5;
  const arcLx = cx + (svgR + 20) * Math.cos(midRad);
  const arcLy = cy + (svgR + 20) * Math.sin(midRad) + 4;

  const aArcSx = (cx + 22 * Math.cos(sRad)).toFixed(1);
  const aArcSy = (cy + 22 * Math.sin(sRad)).toFixed(1);
  const aArcEx = (cx + 22 * Math.cos(eRad)).toFixed(1);
  const aArcEy = (cy + 22 * Math.sin(eRad)).toFixed(1);

  return svgWrap(
    W,
    H,
    `
  <circle cx="${cx}" cy="${cy}" r="${svgR}" fill="none" stroke="#333355" stroke-width="1.5" stroke-dasharray="5 4"/>
  <path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${svgR} ${svgR} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z"
    fill="${BLUE_FILL}" fill-opacity="0.4" stroke="${BLUE_STR}" stroke-width="1.5"/>
  <line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${STROKE}" stroke-width="1.5"/>
  <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${STROKE}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="3" fill="${STROKE}"/>
  <path d="M ${aArcSx} ${aArcSy} A 22 22 0 ${large} 1 ${aArcEx} ${aArcEy}"
    fill="none" stroke="${AMBER}" stroke-width="1.5"/>
  <text text-anchor="middle" x="${aLx.toFixed(1)}" y="${aLy.toFixed(1)}" fill="${AMBER}" font-size="12" font-weight="bold">${angle}°</text>
  <text x="${rLx.toFixed(1)}" y="${rLy.toFixed(1)}" fill="${TEXT_DIM}" font-size="11">r = ${r} cm</text>
  ${
    showArc
      ? `<text text-anchor="middle" x="${arcLx.toFixed(1)}" y="${arcLy.toFixed(1)}" class="unkn">arc</text>`
      : `<text text-anchor="middle" x="${(cx + 14).toFixed(1)}" y="${(cy + 20).toFixed(1)}" class="unkn">A = ?</text>`
  }`,
  );
}
