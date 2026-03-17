import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderTrigBearing(vars: ResolvedVars): string {
  const bearing = Number(vars.bearing ?? 65);
  const dist    = Number(vars.dist ?? 120);
  const W = 280, H = 260;

  const bRad = (bearing * Math.PI) / 180;
  const rawEx = dist * Math.sin(bRad);
  const rawNy = dist * Math.cos(bRad);

  const margin = 55;
  const scale = Math.min(
    (W - margin * 2) / Math.max(Math.abs(rawEx), 1),
    (H - margin * 2 - 30) / Math.max(Math.abs(rawNy), 1),
    1.4
  );

  const dx = rawEx * scale;
  const dy = rawNy * scale;

  const ox = W / 2 - dx / 2;
  const oy = H / 2 + dy / 2 + 10;

  const ex = ox + dx;
  const ey = oy - dy;

  function arrow(x1: number, y1: number, x2: number, y2: number, color: string, dash = "") {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const as = 9;
    return `
      <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}"
            x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"
        stroke="${color}" stroke-width="2.2"${dash ? ` stroke-dasharray="${dash}"` : ""}/>
      <polygon points="${x2.toFixed(2)},${y2.toFixed(2)}
        ${(x2 - as*Math.cos(a-0.35)).toFixed(2)},${(y2 - as*Math.sin(a-0.35)).toFixed(2)}
        ${(x2 - as*Math.cos(a+0.35)).toFixed(2)},${(y2 - as*Math.sin(a+0.35)).toFixed(2)}"
        fill="${color}"/>
    `;
  }

  const arcR = 32;
  const arcEndX = ox + arcR * Math.sin(bRad);
  const arcEndY = oy - arcR * Math.cos(bRad);
  const largeArc = bearing > 180 ? 1 : 0;

  const midBRad = bRad / 2;
  const arcLx = ox + (arcR + 16) * Math.sin(midBRad);
  const arcLy = oy - (arcR + 16) * Math.cos(midBRad);

  const distMidX = (ox + ex) / 2;
  const distMidY = (oy + ey) / 2;
  const perpAngle = bRad - Math.PI / 2;
  const distLx = distMidX + 18 * Math.cos(perpAngle);
  const distLy = distMidY + 18 * Math.sin(perpAngle);

  return svgWrap(W, H, `
    ${arrow(ox, oy, ox, oy - 48, STROKE_DIM)}
    <text text-anchor="middle" x="${ox}" y="${(oy - 55).toFixed(2)}"
      class="dim" font-size="13" font-weight="700">N</text>

    <path d="M ${ox} ${(oy - arcR).toFixed(2)}
             A ${arcR} ${arcR} 0 ${largeArc} 1
             ${arcEndX.toFixed(2)} ${arcEndY.toFixed(2)}"
      fill="none" stroke="${AMBER}" stroke-width="1.5"/>
    <text text-anchor="start" x="${arcLx.toFixed(2)}" y="${(arcLy + 4).toFixed(2)}"
      class="lbl">${bearing}°</text>

    ${arrow(ox, oy, ex, ey, BLUE_STR)}

    <!-- Distance label along bearing line -->
    <text text-anchor="middle" x="${distLx.toFixed(2)}" y="${(distLy + 4).toFixed(2)}"
      class="lbl">${dist} km</text>

    <!-- Dots -->
    <circle cx="${ox.toFixed(2)}" cy="${oy.toFixed(2)}" r="4" fill="${STROKE}"/>
    <circle cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="4" fill="${BLUE_STR}"/>
  `);
}