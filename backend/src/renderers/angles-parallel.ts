import { ResolvedVars } from "../types/template";
import {
  svgWrap,
  STROKE,
  AMBER,
  BLUE_FILL,
  BLUE_STR,
  TEXT_DIM,
} from "./colours";

export function renderAnglesParallel(vars: ResolvedVars): string {
  const known = Number(vars.known_angle);
  const type = String(vars.angle_type ?? "alternate");

  const W = 260,
    H = 200;
  const y1 = 72,
    y2 = 148;
  const ix1 = 88,
    ix2 = 162;

  const slope = (y2 - y1) / (ix2 - ix1);
  const tx0 = ix1 - 44 / slope;
  const tx1 = ix2 + 44 / slope;
  const transAngle = Math.atan2(y2 - y1, ix2 - ix1);
  const r = 22;

  function pt(cx: number, cy: number, a: number) {
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const uKS = pt(ix1, y1, 0);
  const uKE = pt(ix1, y1, transAngle);

  let uUS: ReturnType<typeof pt>;
  let uUE: ReturnType<typeof pt>;
  let uSweep = 1;

  if (type === "alternate") {
    uUS = pt(ix2, y2, Math.PI + transAngle);
    uUE = pt(ix2, y2, Math.PI);
  } else if (type === "corresponding") {
    uUS = pt(ix2, y2, 0);
    uUE = pt(ix2, y2, transAngle);
  } else {
    // co-interior
    uUS = pt(ix2, y2, Math.PI + transAngle);
    uUE = pt(ix2, y2, Math.PI);
    uSweep = 0;
  }

  const kMid = transAngle / 2;
  const kLx = ix1 + (r + 14) * Math.cos(kMid);
  const kLy = y1 + (r + 14) * Math.sin(kMid) + 4;

  const uMid =
    type === "corresponding" ? transAngle / 2 : Math.PI + transAngle / 2;
  const uLx = ix2 + (r + 14) * Math.cos(uMid);
  const uLy = y2 + (r + 14) * Math.sin(uMid) + 4;

  const tick = (x: number, y: number) =>
    `<line x1="${x - 5}" y1="${y - 7}" x2="${x + 5}" y2="${y + 7}" stroke="${STROKE}" stroke-width="1.5"/>`;

  const typeLabel =
    type === "alternate"
      ? "Alternate angles"
      : type === "corresponding"
        ? "Corresponding angles"
        : "Co-interior angles";

  return svgWrap(
    W,
    H,
    `
  <line x1="16" y1="${y1}" x2="${W - 16}" y2="${y1}" stroke="${STROKE}" stroke-width="2"/>
  <line x1="16" y1="${y2}" x2="${W - 16}" y2="${y2}" stroke="${STROKE}" stroke-width="2"/>
  ${tick(50, y1)}${tick(56, y1)}
  ${tick(50, y2)}${tick(56, y2)}
  <line x1="${tx0.toFixed(1)}" y1="${y1 - 44}" x2="${tx1.toFixed(1)}" y2="${y2 + 44}" stroke="${STROKE}" stroke-width="2"/>
  <path d="M ${ix1} ${y1} L ${uKS.x.toFixed(1)} ${uKS.y.toFixed(1)} A ${r} ${r} 0 0 1 ${uKE.x.toFixed(1)} ${uKE.y.toFixed(1)} Z"
    fill="${AMBER}" fill-opacity="0.3" stroke="${AMBER}" stroke-width="1"/>
  <path d="M ${ix2} ${y2} L ${uUS.x.toFixed(1)} ${uUS.y.toFixed(1)} A ${r} ${r} 0 0 ${uSweep} ${uUE.x.toFixed(1)} ${uUE.y.toFixed(1)} Z"
    fill="${BLUE_FILL}" fill-opacity="0.35" stroke="${BLUE_STR}" stroke-width="1"/>
  <text text-anchor="middle" x="${kLx.toFixed(1)}" y="${kLy.toFixed(1)}" class="lbl">${known}°</text>
  <text text-anchor="middle" x="${uLx.toFixed(1)}" y="${uLy.toFixed(1)}" class="unkn">x°</text>
  <text text-anchor="middle" x="${W / 2}" y="${H - 8}" fill="${TEXT_DIM}" font-size="11">${typeLabel}</text>`,
  );
}
