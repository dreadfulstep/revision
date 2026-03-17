import { ResolvedVars } from "../types";
import { svgWrap, STROKE, AMBER, BLUE_STR } from "./colours";

function arc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  fill: string,
  largeArc = 0,
  sweep = 1,
) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const sx = cx + r * Math.cos(s),
    sy = cy + r * Math.sin(s);
  const ex = cx + r * Math.cos(e),
    ey = cy + r * Math.sin(e);
  return `
    <path d="M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)} Z"
      fill="${fill}" fill-opacity="0.22" stroke="none"/>
    <path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}"
      fill="none" stroke="${fill}" stroke-width="1.3" stroke-opacity="0.7"/>
  `;
}

export function renderAnglesOnLine(vars: ResolvedVars): string {
  const known = Number(vars.known_angle);
  const type = String(vars.type ?? "straight");
  const W = 270,
    H = 170;
  if (type === "straight") {
    const cy = 130;
    const cx = W / 2;
    const armDeg = -(180 - known);
    const armRad = (armDeg * Math.PI) / 180;
    const armLen = 90;
    const armX = cx + armLen * Math.cos(armRad);
    const armY = cy + armLen * Math.sin(armRad);
    const r1 = 32,
      r2 = 48;

    const knownArc = arc(cx, cy, r1, armDeg, 180, AMBER, 0, 0);
    const unknArc = arc(cx, cy, r2, armDeg, 0, BLUE_STR, 0, 1);

    const klx = cx - (r1 + 10);
    const kly = cy - 30;

    const ulx = cx + (r2 + 10) * Math.cos(armRad / 2);
    const uly = cy + (r2 + 10) * Math.sin(armRad / 2) - 8;

    return svgWrap(
      W,
      H,
      `
    ${knownArc}${unknArc}
    <line x1="18" y1="${cy}" x2="${W - 18}" y2="${cy}" stroke="${STROKE}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${armX.toFixed(2)}" y2="${armY.toFixed(2)}"
      stroke="${STROKE}" stroke-width="2"/>
    <text text-anchor="middle" x="${klx.toFixed(2)}" y="${(kly + 4).toFixed(2)}" class="lbl">${known}°</text>
    <text text-anchor="middle" x="${ulx.toFixed(2)}" y="${(uly + 4).toFixed(2)}" class="unkn">x°</text>
  `,
    );
  }

  const cx = W / 2,
    cy = H / 2 + 10;
  const armLen = 70;
  const armDegs = [0, known, known + 90, known + 210];
  const colors = [AMBER, BLUE_STR, AMBER, BLUE_STR];

  const arcs = armDegs.map((startDeg, i) => {
    const endDeg = armDegs[(i + 1) % armDegs.length]!;
    let span = endDeg - startDeg;
    if (span < 0) span += 360;
    const large = span > 180 ? 1 : 0;
    const r = i % 2 === 0 ? 28 : 38;
    return arc(cx, cy, r, startDeg, startDeg + span, colors[i % 2]!, large, 1);
  });

  const lines = armDegs.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return `<line x1="${cx}" y1="${cy}"
      x2="${(cx + armLen * Math.cos(rad)).toFixed(2)}"
      y2="${(cy + armLen * Math.sin(rad)).toFixed(2)}"
      stroke="${STROKE}" stroke-width="2"/>`;
  });

  const labelDegs = armDegs.map((startDeg, i) => {
    const endDeg = armDegs[(i + 1) % armDegs.length]!;
    let span = endDeg - startDeg;
    if (span < 0) span += 360;
    return startDeg + span / 2;
  });

  const sectorLabels = labelDegs.map((midDeg, i) => {
    const r = i % 2 === 0 ? 50 : 62;
    const rad = (midDeg * Math.PI) / 180;
    const lx = cx + r * Math.cos(rad);
    const ly = cy + r * Math.sin(rad);
    const isKnown = i === 0;
    return `<text text-anchor="middle" x="${lx.toFixed(2)}" y="${(ly + 4).toFixed(2)}"
      class="${isKnown ? "lbl" : "unkn"}">${isKnown ? `${known}°` : "x°"}</text>`;
  });

  return svgWrap(
    W,
    H,
    `
    ${arcs.join("")}
    ${lines.join("")}
    ${sectorLabels.slice(0, 2).join("")}
  `,
  );
}
