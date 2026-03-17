import { ResolvedVars } from "../types";
import { svgWrap, STROKE, AMBER, angleArc, arcBorder } from "./colours";

export function renderTrigRightTriangle(vars: ResolvedVars): string {
  const angle = Number(vars.angle ?? 35);
  const adj   = Number(vars.adj ?? 0);
  const opp   = Number(vars.opp ?? 0);
  const hyp   = Number(vars.hyp ?? 0);
  const unknown = String(vars.unknown ?? "opp");
  const W = 270, H = 210, margin = 38;

  const x0 = margin,     y0 = H - margin;
  const x1 = W - margin, y1 = H - margin;
  const x2 = margin,     y2 = margin;

  const r = 28;
  const angleRad = (angle * Math.PI) / 180;

  const arcFill = angleArc(x1, y1, r, Math.PI, Math.PI + angleRad, AMBER, 1);
  const arcBord = arcBorder(x1, y1, r, Math.PI, Math.PI + angleRad, AMBER, 1);

  const adjLabel = unknown === "adj" ? "?" : adj > 0 ? `${adj} cm` : "adj";
  const oppLabel = unknown === "opp" ? "?" : opp > 0 ? `${opp} cm` : "opp";
  const hypLabel = unknown === "hyp" ? "?" : hyp > 0 ? `${hyp} cm` : "hyp";

  const adjClass = unknown === "adj" ? "unkn" : "lbl";
  const oppClass = unknown === "opp" ? "unkn" : "lbl";
  const hypClass = unknown === "hyp" ? "unkn" : "lbl";

  return svgWrap(W, H, `
    ${arcFill}
    <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}"
      fill="${AMBER}" fill-opacity="0.08" stroke="${STROKE}" stroke-width="2"/>
    <!-- Right angle marker -->
    <polyline points="${x0+14},${y0} ${x0+14},${y0-14} ${x0},${y0-14}"
      fill="none" stroke="${STROKE}" stroke-width="1.5"/>
    ${arcBord}
    <!-- Angle label -->
    <text text-anchor="middle"
      x="${(x1 + (r+16)*Math.cos(Math.PI + angleRad/2)).toFixed(2)}"
      y="${(y1 + (r+16)*Math.sin(Math.PI + angleRad/2) + 4).toFixed(2)}"
      class="lbl">${angle}°</text>
    <!-- Side labels -->
    <text text-anchor="middle" x="${(x0+x1)/2}" y="${y0+18}" class="${adjClass}">${adjLabel}</text>
    <text text-anchor="middle" x="${x0-18}" y="${(y0+y2)/2+4}" class="${oppClass}">${oppLabel}</text>
    <text text-anchor="middle" x="${(x1+x2)/2+16}" y="${(y1+y2)/2-4}" class="${hypClass}">${hypLabel}</text>
    <!-- SOHCAHTOA hint -->
  `);
}