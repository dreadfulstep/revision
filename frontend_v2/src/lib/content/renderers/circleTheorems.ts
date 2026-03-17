import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  fill: string,
  sweep = 1,
  large = 0,
  opacity = 0.22,
) {
  const sx = cx + r * Math.cos(startAngle),
    sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle),
    ey = cy + r * Math.sin(endAngle);
  return `
    <path d="M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)} Z"
      fill="${fill}" fill-opacity="${opacity}" stroke="none"/>
    <path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}"
      fill="none" stroke="${fill}" stroke-width="1.3" stroke-opacity="0.7"/>
  `;
}

function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function dot(x: number, y: number, color = "oklch(0.85 0 0)") {
  return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.5" fill="${color}"/>`;
}

function seg(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 1.8,
  dash = "",
) {
  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"
    stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function rightAngleMark(
  vx: number,
  vy: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  size = 12,
) {
  const aN = { x: ax - vx, y: ay - vy };
  const bN = { x: bx - vx, y: by - vy };
  const aL = Math.sqrt(aN.x * aN.x + aN.y * aN.y);
  const bL = Math.sqrt(bN.x * bN.x + bN.y * bN.y);
  const aU = { x: (aN.x / aL) * size, y: (aN.y / aL) * size };
  const bU = { x: (bN.x / bL) * size, y: (bN.y / bL) * size };
  const p1 = { x: vx + aU.x, y: vy + aU.y };
  const p2 = { x: vx + aU.x + bU.x, y: vy + aU.y + bU.y };
  const p3 = { x: vx + bU.x, y: vy + bU.y };
  return `<polyline points="${p1.x.toFixed(2)},${p1.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} ${p3.x.toFixed(2)},${p3.y.toFixed(2)}"
    fill="none" stroke="${STROKE}" stroke-width="1.5"/>`;
}

export function renderCircleTheorem(vars: ResolvedVars): string {
  const theorem = String(vars.theorem ?? "inscribed");
  const known = Number(vars.known_angle ?? 40);
  const W = 250,
    H = 230;
  const cx = W / 2,
    cy = H / 2 + 4,
    r = 80;

  if (theorem === "inscribed") {
    const centreAngle = known * 2;
    const pDeg = 200,
      qDeg = 320,
      rDeg = 80;
    const P = pt(cx, cy, r, pDeg);
    const Q = pt(cx, cy, r, qDeg);
    const R = pt(cx, cy, r, rDeg);

    const minorArc = `<path d="M ${P.x.toFixed(2)} ${P.y.toFixed(2)}
      A ${r} ${r} 0 0 1 ${Q.x.toFixed(2)} ${Q.y.toFixed(2)}"
      fill="none" stroke="${AMBER}" stroke-width="2.5" stroke-opacity="0.6"/>`;

    const pRad = (pDeg * Math.PI) / 180;
    const qRad = (qDeg * Math.PI) / 180;
    const centreArc = arcPath(cx, cy, 28, pRad, qRad, AMBER, 1, 0);

    const rToP = Math.atan2(P.y - R.y, P.x - R.x);
    const rToQ = Math.atan2(Q.y - R.y, Q.x - R.x);
    const inscribedArc = arcPath(R.x, R.y, 22, rToP, rToQ, BLUE_STR, 1, 0);

    const midArcDeg = (pDeg + qDeg) / 2;
    const clx = cx + 40 * Math.cos((midArcDeg * Math.PI) / 180);
    const cly = cy + 40 * Math.sin((midArcDeg * Math.PI) / 180);

    const midRad = (rToP + rToQ) / 2;
    const ilx = R.x + 32 * Math.cos(midRad);
    const ily = R.y + 32 * Math.sin(midRad);

    return svgWrap(
      W,
      H,
      `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" opacity="0.5"/>
      ${minorArc}
      ${centreArc}
      ${seg(cx, cy, P.x, P.y, AMBER)}
      ${seg(cx, cy, Q.x, Q.y, AMBER)}
      ${inscribedArc}
      ${seg(R.x, R.y, P.x, P.y, BLUE_STR)}
      ${seg(R.x, R.y, Q.x, Q.y, BLUE_STR)}
      ${dot(P.x, P.y)} ${dot(Q.x, Q.y)} ${dot(R.x, R.y)}
      ${dot(cx, cy, AMBER)}
      <text text-anchor="middle" x="${clx.toFixed(2)}" y="${(cly + 4).toFixed(2)}" class="lbl">${centreAngle}°</text>
      <text text-anchor="middle" x="${ilx.toFixed(2)}" y="${(ily + 4).toFixed(2)}" class="unkn">x°</text>
    `,
    );
  }

  if (theorem === "semicircle") {
    const pDeg = 180,
      qDeg = 0;
    const rDeg = -55;
    const P = pt(cx, cy, r, pDeg);
    const Q = pt(cx, cy, r, qDeg);
    const R = pt(cx, cy, r, rDeg);

    return svgWrap(
      W,
      H,
      `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" opacity="0.5"/>
      ${seg(P.x, P.y, Q.x, Q.y, STROKE_DIM, 1.5, "5 3")}
      ${seg(P.x, P.y, R.x, R.y, BLUE_STR, 2)}
      ${seg(Q.x, Q.y, R.x, R.y, BLUE_STR, 2)}
      ${rightAngleMark(R.x, R.y, P.x, P.y, Q.x, Q.y, 13)}
      ${dot(P.x, P.y)} ${dot(Q.x, Q.y)} ${dot(R.x, R.y)}
      <text x="${(P.x - 14).toFixed(2)}" y="${(P.y + 4).toFixed(2)}" class="dim">P</text>
      <text x="${(Q.x + 6).toFixed(2)}" y="${(Q.y + 4).toFixed(2)}" class="dim">Q</text>
      <text x="${(R.x + 6).toFixed(2)}" y="${(R.y - 8).toFixed(2)}" class="unkn">x° = 90°</text>
    `,
    );
  }

  if (theorem === "cyclic-quad") {
    const aDeg = 240,
      bDeg = 330,
      cDeg = 55,
      dDeg = 145;
    const A = pt(cx, cy, r, aDeg);
    const B = pt(cx, cy, r, bDeg);
    const C = pt(cx, cy, r, cDeg);
    const D = pt(cx, cy, r, dDeg);

    const aToB = Math.atan2(B.y - A.y, B.x - A.x);
    const aToD = Math.atan2(D.y - A.y, D.x - A.x);
    const cToB = Math.atan2(B.y - C.y, B.x - C.x);
    const cToD = Math.atan2(D.y - C.y, D.x - C.x);

    function arcSpan(from: number, to: number) {
      let span = to - from;
      while (span < 0) span += Math.PI * 2;
      return span;
    }

    const arcR = 28;

    const knownArc = arcPath(
      A.x,
      A.y,
      arcR,
      aToB,
      aToD,
      AMBER,
      1,
      arcSpan(aToB, aToD) > Math.PI ? 1 : 0,
      0.28,
    );
    const unknArc = arcPath(
      C.x,
      C.y,
      arcR,
      cToD,
      cToB,
      BLUE_STR,
      1,
      arcSpan(cToD, cToB) > Math.PI ? 1 : 0,
      0.28,
    );

    const aMidAngle = (aDeg * Math.PI) / 180;
    const cMidAngle = (cDeg * Math.PI) / 180;
    const labelR = r - 24;
    const alx = cx + labelR * Math.cos(aMidAngle) + 10;
    const aly = cy + labelR * Math.sin(aMidAngle) + 15;
    const clx = cx + labelR * Math.cos(cMidAngle) - 10;
    const cly = cy + labelR * Math.sin(cMidAngle) - 15;

    return svgWrap(
      W,
      H,
      `
    <circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" opacity="0.5"/>
    <polygon points="${A.x.toFixed(2)},${A.y.toFixed(2)} ${B.x.toFixed(2)},${B.y.toFixed(2)} ${C.x.toFixed(2)},${C.y.toFixed(2)} ${D.x.toFixed(2)},${D.y.toFixed(2)}"
      fill="${AMBER}" fill-opacity="0.07" stroke="${STROKE}" stroke-width="1.8"/>
    ${knownArc}
    ${unknArc}
    ${dot(A.x, A.y)} ${dot(B.x, B.y)} ${dot(C.x, C.y)} ${dot(D.x, D.y)}
    <text text-anchor="middle" x="${alx.toFixed(2)}" y="${(aly + 4).toFixed(2)}" class="lbl">${known}°</text>
    <text text-anchor="middle" x="${clx.toFixed(2)}" y="${(cly + 4).toFixed(2)}" class="unkn">x°</text>
  `,
    );
  }

  const extX = cx + r + 65,
    extY = cy;
  const tangentAngle = Math.asin(
    r / Math.sqrt((extX - cx) ** 2 + (extY - cy) ** 2),
  );
  const lineAngle = Math.atan2(extY - cy, extX - cx);
  const t1Angle = lineAngle + Math.PI + tangentAngle;
  const t2Angle = lineAngle + Math.PI - tangentAngle;
  const T1 = pt(cx, cy, r, (t1Angle * 180) / Math.PI);
  const T2 = pt(cx, cy, r, (t2Angle * 180) / Math.PI);

  return svgWrap(
    W,
    H,
    `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STROKE_DIM}" stroke-width="1.5" opacity="0.5"/>
    ${seg(extX, extY, T1.x, T1.y, BLUE_STR, 2)}
    ${seg(extX, extY, T2.x, T2.y, BLUE_STR, 2)}
    ${seg(cx, cy, T1.x, T1.y, AMBER, 1.5, "4 3")}
    ${seg(cx, cy, T2.x, T2.y, AMBER, 1.5, "4 3")}
    ${rightAngleMark(T1.x, T1.y, cx, cy, extX, extY, 11)}
    ${rightAngleMark(T2.x, T2.y, cx, cy, extX, extY, 11)}
    ${dot(extX, extY)}
    ${dot(T1.x, T1.y)} ${dot(T2.x, T2.y)}
    ${dot(cx, cy, AMBER)}
    <text x="${(extX + 8).toFixed(2)}" y="${(extY + 4).toFixed(2)}" class="dim">P</text>
    <text text-anchor="middle" x="${(extX + T1.x) / 2 + 10}" y="${((extY + T1.y) / 2 - 8).toFixed(2)}" class="unkn">x</text>
    <text text-anchor="middle" x="${(extX + T2.x) / 2 + 10}" y="${((extY + T2.y) / 2 + 14).toFixed(2)}" class="unkn">x</text>
  `,
  );
}
