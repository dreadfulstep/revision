import { ResolvedVars } from "../types/template";
import { svgWrap, STROKE, TEXT_DIM, GREEN, CARD_BG } from "./colours";

export function renderNumberLine(vars: ResolvedVars): string {
  const xMin = Number(vars.x_min ?? -6);
  const xMax = Number(vars.x_max ?? 6);
  const rStart = Number(vars.region_start ?? -2);
  const rEnd = Number(vars.region_end ?? 3);
  const closedL = Number(vars.closed_left ?? 1) === 1;
  const closedR = Number(vars.closed_right ?? 0) === 1;
  const label = String(vars.show_label ?? "");

  const W = 260,
    H = 100;
  const padL = 20,
    padR = 20;
  const lineY = 52;
  const range = xMax - xMin;

  function sx(x: number) {
    return padL + ((x - xMin) / range) * (W - padL - padR);
  }

  let ticks = "";
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const px = sx(x);
    ticks += `<line x1="${px.toFixed(1)}" y1="${lineY - 6}" x2="${px.toFixed(1)}" y2="${lineY + 6}" stroke="${STROKE}" stroke-width="1.5"/>`;
    ticks += `<text x="${px.toFixed(1)}" y="${lineY + 20}" text-anchor="middle" fill="${TEXT_DIM}" font-size="11">${x}</text>`;
  }

  const lx = sx(rStart);
  const rx = sx(rEnd);

  return svgWrap(
    W,
    H,
    `
  <line x1="${padL}" y1="${lineY}" x2="${W - padR}" y2="${lineY}" stroke="${STROKE}" stroke-width="2"/>
  ${ticks}
  <line x1="${lx.toFixed(1)}" y1="${lineY}" x2="${rx.toFixed(1)}" y2="${lineY}"
    stroke="${GREEN}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  ${
    closedL
      ? `<circle cx="${lx.toFixed(1)}" cy="${lineY}" r="5" fill="${GREEN}"/>`
      : `<circle cx="${lx.toFixed(1)}" cy="${lineY}" r="5" fill="${CARD_BG}" stroke="${GREEN}" stroke-width="2"/>`
  }
  ${
    closedR
      ? `<circle cx="${rx.toFixed(1)}" cy="${lineY}" r="5" fill="${GREEN}"/>`
      : `<circle cx="${rx.toFixed(1)}" cy="${lineY}" r="5" fill="${CARD_BG}" stroke="${GREEN}" stroke-width="2"/>`
  }
  ${
    label
      ? `<text text-anchor="middle" x="${((lx + rx) / 2).toFixed(1)}" y="${lineY - 14}" fill="${GREEN}" font-size="12" font-weight="bold">${label}</text>`
      : ""
  }`,
  );
}
