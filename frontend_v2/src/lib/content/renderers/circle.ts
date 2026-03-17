import { ResolvedVars } from "../types";
import { svgWrap, STROKE, BLUE_FILL, AMBER } from "./colours";

export function renderCircle(vars: ResolvedVars): string {
  const r = Number(vars.r ?? 1);
  const showDiameter = Number(vars.show_diameter ?? 0);
  const unknown = String(vars.unknown ?? "area");
  const W = 220, H = 200;
  const cx = W / 2, cy = H / 2, vr = 72;

  const label = unknown === "r"
    ? "r = ?"
    : unknown === "d"
      ? "d = ?"
      : `r = ${r} cm`;

  const labelClass = (unknown === "r" || unknown === "d") ? "unkn" : "lbl";

  return svgWrap(W, H, `
    <circle cx="${cx}" cy="${cy}" r="${vr}"
      fill="${BLUE_FILL}" fill-opacity="0.1" stroke="${STROKE}" stroke-width="2"/>
    ${showDiameter
      ? `<line x1="${cx - vr}" y1="${cy}" x2="${cx + vr}" y2="${cy}"
           stroke="${AMBER}" stroke-width="1.5" stroke-dasharray="4 3"/>
         <text text-anchor="middle" x="${cx}" y="${cy - 8}" class="${labelClass}">${label}</text>`
      : `<line x1="${cx}" y1="${cy}" x2="${cx + vr}" y2="${cy}"
           stroke="${AMBER}" stroke-width="1.5" stroke-dasharray="4 3"/>
         <text text-anchor="start" x="${cx + 8}" y="${cy - 6}" class="${labelClass}">${label}</text>`
    }
    <circle cx="${cx}" cy="${cy}" r="3" fill="${AMBER}"/>
  `);
}