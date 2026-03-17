import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderShapeInShape(vars: ResolvedVars): string {
  const type    = String(vars.type ?? "circle-in-square");
  const outer   = Number(vars.outer ?? 10);
  const unknown = String(vars.unknown ?? "shaded");
  const W = 260, H = 220;
  const cx = W / 2, cy = H / 2;

  if (type === "circle-in-square") {
    const half = 80;
    const r = half;
    const squareArea = (outer) * (outer);
    const circleArea = Math.PI * (outer / 2) ** 2;
    const shadedArea = squareArea - circleArea;
    const label = unknown === "shaded" ? "?" : `${shadedArea.toFixed(1)} cm²`;
    const cls   = unknown === "shaded" ? "unkn" : "lbl";

    return svgWrap(W, H, `
      <rect x="${cx-half}" y="${cy-half}" width="${half*2}" height="${half*2}"
        fill="${AMBER}" fill-opacity="0.18" stroke="${STROKE}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${BLUE_STR}" fill-opacity="0.22" stroke="${STROKE}" stroke-width="2"/>
      <!-- Shaded corners indicator -->
      <rect x="${cx-half+4}" y="${cy-half+4}" width="18" height="18"
        fill="${AMBER}" fill-opacity="0.5" stroke="none"/>
      <text text-anchor="middle" x="${cx}" y="${cy+4}" class="${cls}">${label}</text>
      <text text-anchor="middle" x="${cx-half+14}" y="${cy-half-10}" class="dim">${outer} cm</text>
      <line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}"
        stroke="${STROKE_DIM}" stroke-width="1.2" stroke-dasharray="3 2"/>
      <text text-anchor="middle" x="${cx+r/2}" y="${cy-8}" class="dim">${outer/2} cm</text>
    `);
  }

  if (type === "triangle-in-rect") {
    const rw = 160, rh = 100;
    const rx = cx - rw/2, ry = cy - rh/2;
    const h = Number(vars.h ?? 8);
    const b = Number(vars.b ?? 12);
    const triArea = 0.5 * b * h;
    const rectArea = b * h;
    const shadedArea = rectArea - triArea;
    const label = unknown === "shaded" ? "?" : `${shadedArea.toFixed(1)} cm²`;
    const cls   = unknown === "shaded" ? "unkn" : "lbl";

    const tx1 = rx, ty1 = ry + rh;
    const tx2 = rx + rw, ty2 = ry + rh;
    const tx3 = cx, ty3 = ry;

    return svgWrap(W, H, `
      <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}"
        fill="${AMBER}" fill-opacity="0.15" stroke="${STROKE}" stroke-width="2"/>
      <polygon points="${tx1},${ty1} ${tx2},${ty2} ${tx3},${ty3}"
        fill="${BLUE_STR}" fill-opacity="0.25" stroke="${STROKE}" stroke-width="2"/>
      <text text-anchor="middle" x="${cx}" y="${ry+rh+18}" class="lbl">${b} cm</text>
      <text text-anchor="end"    x="${rx-8}" y="${cy+4}"   class="lbl">${h} cm</text>
      <text text-anchor="middle" x="${cx}" y="${cy+18}" class="${cls}">${label}</text>
    `);
  }

  const R2 = 78, sectorAngle = Number(vars.sector_angle ?? 120);
  const sRad = (sectorAngle * Math.PI) / 180;
  const fullArea = Math.PI * R2 * R2;
  const shaded2 = (sectorAngle / 360) * fullArea;
  const label2 = unknown === "shaded" ? "?" : `${shaded2.toFixed(1)} cm²`;
  const cls2 = unknown === "shaded" ? "unkn" : "lbl";

  const sx = cx + R2 * Math.cos(-Math.PI/2);
  const sy = cy + R2 * Math.sin(-Math.PI/2);
  const ex = cx + R2 * Math.cos(-Math.PI/2 + sRad);
  const ey = cy + R2 * Math.sin(-Math.PI/2 + sRad);

  return svgWrap(W, H, `
    <circle cx="${cx}" cy="${cy}" r="${R2}"
      fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" opacity="0.4"/>
    <path d="M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${R2} ${R2} 0 ${sectorAngle > 180 ? 1 : 0} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z"
      fill="${AMBER}" fill-opacity="0.3" stroke="${STROKE}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${sx.toFixed(2)}" y2="${sy.toFixed(2)}"
      stroke="${STROKE_DIM}" stroke-width="1.2" stroke-dasharray="3 2"/>
    <text text-anchor="middle" x="${cx + R2/2*Math.cos(-Math.PI/2 + sRad/2)}" y="${cy + R2/2*Math.sin(-Math.PI/2 + sRad/2) + 4}" class="${cls2}">${label2}</text>
    <text text-anchor="middle" x="${cx}" y="${cy - R2 - 12}" class="lbl">${sectorAngle}°</text>
  `);
}