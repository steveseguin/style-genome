// Renders a genome: fixed sample markup + generated scoped CSS.
// The same two functions feed the live tiles, the finale preview, and the
// PNG exporter.

import { ARCHETYPES } from "./archetypes/index.js";
import { fontStack } from "./fonts.js";
import { alpha, mix, onColor } from "./color.js";
import { genomeKey } from "./genome.js";
import { NOISE_URI, SAMPLE_BASE, SAMPLE_W, SAMPLE_H } from "./sampleBase.js";
import { specimenMarkup } from "./specimens.js";
import { motifsCss } from "./motifs.js";

export { SAMPLE_BASE, SAMPLE_W, SAMPLE_H };

// ------------------------------------------------------------------ charts

const BAR_DATA = [34, 58, 44, 72, 61, 88, 52];
const LINE_DATA = [22, 40, 34, 55, 48, 70, 62, 82];
const SPARK_DATA = [30, 44, 38, 52, 47, 63, 58, 74, 70, 84];

function polyPoints(data, w, h, pad = 4) {
  const max = Math.max(...data);
  return data
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (data.length - 1);
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function chartSpec(g) {
  let mark = g.chart || "bars";
  let treatment = g.chartTreatment || "auto";
  if (mark === "bars-outline") {
    mark = "bars";
    if (treatment === "auto") treatment = "outline";
  } else if (mark === "bars-hatch") {
    mark = "bars";
    if (treatment === "auto") treatment = "hatch";
  }
  if (treatment === "auto") treatment = "solid";
  const grid = !g.chartGrid || g.chartGrid === "auto" ? "full" : g.chartGrid;
  return { mark, treatment, grid };
}

function chartPatterns(treatment, uid) {
  const id = `${treatment}-${uid}`;
  switch (treatment) {
    case "hatch":
      return { id, defs: `<pattern id="${id}" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" stroke-width="1.2"/></pattern>` };
    case "crosshatch":
      return { id, defs: `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 7L7 0M5 9L9 5M5-2L9 2M0 0L7 7M-2 5L2 9" fill="none" stroke="var(--ink)" stroke-width=".8"/></pattern>` };
    case "stipple":
      return { id, defs: `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" fill="var(--ink)"/><circle cx="4.7" cy="4.2" r=".55" fill="var(--ink)"/></pattern>` };
    case "halftone":
      return { id, defs: `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.8" cy="1.8" r="1.45" fill="var(--accent)"/><circle cx="5.3" cy="5.3" r="1.45" fill="var(--accent)"/></pattern>` };
    case "engraved":
      return { id, defs: `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 8L8-2M2 10L10 2" fill="none" stroke="var(--ink)" stroke-width=".7"/><path d="M-2 5L5-2M5 10L10 5" fill="none" stroke="var(--muted)" stroke-width=".35"/></pattern>` };
    case "rough":
      return { id, defs: `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M-1 8L2 5L4 6L10 0M-2 3L1 0M5 10L10 5" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="square"/></pattern>` };
    default:
      return { id: "", defs: "" };
  }
}

export function chartSvg(g, uid) {
  const w = 210, h = 96, pad = 6;
  const spec = chartSpec(g);
  const base = `<line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="var(--border)" stroke-width="1"/>`;
  const grid = [0.33, 0.66]
    .map((t) => `<line x1="${pad}" y1="${(h - pad) * t}" x2="${w - pad}" y2="${(h - pad) * t}" stroke="var(--border)" stroke-width="0.5" opacity="0.55"/>`)
    .join("");
  const n = BAR_DATA.length;
  const slot = (w - pad * 2) / n;
  const bw = slot * 0.62;
  const max = Math.max(...BAR_DATA);
  const bars = (fillFn, extra = "") =>
    BAR_DATA.map((v, i) => {
      const bh = (v / max) * (h - pad * 2 - 6);
      const x = pad + i * slot + (slot - bw) / 2;
      const y = h - pad - bh;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" ${fillFn(v, i)} ${extra}/>`;
    }).join("");

  const pattern = chartPatterns(spec.treatment, uid);
  let body = pattern.defs ? `<defs>${pattern.defs}</defs>` : "";
  const patterned = ["hatch", "crosshatch", "stipple", "halftone", "engraved", "rough"].includes(spec.treatment);
  switch (spec.mark) {
    case "bars": {
      if (spec.treatment === "outline") {
        body += bars(() => `fill="none" stroke="var(--ink)" stroke-width="1.5"`);
      } else if (spec.treatment === "overprint") {
        body += bars(() => `fill="var(--accent2)" opacity=".7" transform="translate(2 1.5)"`);
        body += bars((v) => `fill="var(--accent)" fill-opacity=".78" stroke="var(--ink)" stroke-width=".8"`);
      } else if (patterned) {
        body += bars(() => `fill="url(#${pattern.id})" stroke="var(--ink)" stroke-width="1.1"`);
      } else {
        body += bars((v) => `fill="${v === max ? "var(--accent)" : "var(--accent2)"}" rx="${Math.min(g.radius, 5)}"`);
      }
      break;
    }
    case "line": {
      const pts = polyPoints(LINE_DATA, w, h, pad + 2);
      const dots = pts.split(" ").map((p) => {
        const [x, y] = p.split(",");
        return `<circle cx="${x}" cy="${y}" r="2.4" fill="${spec.treatment === "outline" ? "var(--bg)" : "var(--accent)"}" stroke="var(--ink)" stroke-width="${spec.treatment === "solid" ? 0 : 0.8}"/>`;
      }).join("");
      if (spec.treatment === "engraved" || spec.treatment === "crosshatch") {
        body += `<polyline points="${pts}" transform="translate(-1 -1)" fill="none" stroke="var(--muted)" stroke-width=".7"/><polyline points="${pts}" transform="translate(1 1)" fill="none" stroke="var(--muted)" stroke-width=".7"/>`;
      }
      body += `<polyline points="${pts}" fill="none" stroke="${spec.treatment === "solid" || spec.treatment === "overprint" ? "var(--accent)" : "var(--ink)"}" stroke-width="2.2" stroke-linejoin="round"/>${dots}`;
      break;
    }
    case "area": {
      const pts = polyPoints(LINE_DATA, w, h, pad + 2);
      const fill = patterned ? `url(#${pattern.id})` : "var(--accent)";
      body +=
        `<polygon points="${pad + 2},${h - pad - 2} ${pts} ${w - pad - 2},${h - pad - 2}" fill="${fill}" opacity="${patterned ? 1 : 0.22}"/>` +
        `<polyline points="${pts}" fill="none" stroke="${spec.treatment === "solid" ? "var(--accent)" : "var(--ink)"}" stroke-width="2.2" stroke-linejoin="round"/>`;
      break;
    }
    case "dots": {
      body += BAR_DATA.map((v, i) => {
        const count = Math.max(1, Math.round((v / max) * 6));
        const x = pad + i * slot + slot / 2;
        let dots = "";
        for (let k = 0; k < count; k++) {
          const y = h - pad - 5 - k * 13;
          const fill = patterned ? `url(#${pattern.id})` : k === count - 1 ? "var(--accent)" : "var(--accent2)";
          dots += `<circle cx="${x.toFixed(1)}" cy="${y}" r="4" fill="${spec.treatment === "outline" ? "none" : fill}" stroke="${spec.treatment === "solid" ? "none" : "var(--ink)"}" stroke-width="1"/>`;
        }
        return dots;
      }).join("");
      break;
    }
  }
  const gridBody = spec.grid === "none" ? "" : spec.grid === "baseline" ? base : grid + base;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${gridBody}${body}</svg>`;
}

function sparkSvg() {
  const w = 200, h = 34;
  const pts = polyPoints(SPARK_DATA, w, h, 3);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/></svg>`;
}

// ------------------------------------------------------------------ markup

export function sampleMarkup(g, uid, specimen = "brand") {
  return specimenMarkup(specimen, { chart: chartSvg(g, uid), spark: sparkSvg() });
}

// ------------------------------------------------------------------ tokens

const SPACING = { airy: 11, normal: 9, dense: 7 };

export function shadowValues(g) {
  const p = g.p;
  const soft = p.dark ? "rgba(0,0,0,.55)" : "rgba(20,20,40,.14)";
  switch (g.shadow) {
    case "soft":   return { card: `0 12px 30px ${soft}`, btn: `0 6px 16px ${soft}` };
    case "lifted": return { card: `0 1px 2px rgba(0,0,0,.07), 0 3px 10px rgba(0,0,0,.07)`, btn: `0 1px 3px rgba(0,0,0,.14)` };
    case "hard":   return { card: `5px 5px 0 ${p.ink}`, btn: `3px 3px 0 ${p.ink}` };
    case "emboss": {
      const dark = mix(p.bg, "#0a1030", 0.16);
      const light = mix(p.bg, "#ffffff", 0.85);
      return {
        card: `7px 7px 14px ${alpha(dark, 0.75)}, -7px -7px 14px ${alpha(light, 0.9)}`,
        btn: `4px 4px 8px ${alpha(dark, 0.6)}, -4px -4px 8px ${alpha(light, 0.9)}`,
      };
    }
    case "glow":   return { card: `0 0 22px ${alpha(p.accent, 0.16)}`, btn: `0 0 16px ${alpha(p.accent, 0.45)}` };
    default:       return { card: "none", btn: "none" };
  }
}

export function textureCss(g, s) {
  const p = g.p;
  switch (g.texture) {
    case "grain":
      return `${s}::before { background-image: ${NOISE_URI}; opacity: ${p.dark ? 0.14 : 0.3}; mix-blend-mode: ${p.dark ? "screen" : "multiply"}; }`;
    case "paper":
      return `${s}::before { background-image: ${NOISE_URI}; opacity: 0.18; mix-blend-mode: multiply; }`;
    case "dots":
      return `${s}::before { background-image: radial-gradient(${alpha(p.ink, 0.14)} 1px, transparent 1.4px); background-size: 15px 15px; }`;
    case "lines":
      return `${s}::before { background-image: repeating-linear-gradient(0deg, ${alpha(p.dark ? "#000000" : p.ink, p.dark ? 0.28 : 0.05)} 0 1px, transparent 1px 3px); }`;
    case "grid":
      return `${s}::before {
  background-image:
    linear-gradient(${alpha(p.ink, p.dark ? 0.12 : 0.07)} 1px, transparent 1px),
    linear-gradient(90deg, ${alpha(p.ink, p.dark ? 0.12 : 0.07)} 1px, transparent 1px);
  background-size: 26px 26px;
}`;
    case "crosshatch":
      return `${s}::before {
  background-image:
    repeating-linear-gradient(45deg, ${alpha(p.ink, p.dark ? 0.08 : 0.055)} 0 1px, transparent 1px 9px),
    repeating-linear-gradient(-45deg, ${alpha(p.ink, p.dark ? 0.065 : 0.045)} 0 1px, transparent 1px 11px);
}`;
    case "stipple":
      return `${s}::before {
  background-image:
    radial-gradient(circle, ${alpha(p.ink, p.dark ? 0.14 : 0.09)} 0 .7px, transparent .9px),
    radial-gradient(circle, ${alpha(p.ink, p.dark ? 0.09 : 0.06)} 0 .55px, transparent .8px);
  background-position: 0 0, 5px 4px; background-size: 9px 9px, 11px 11px;
}`;
    case "halftone":
      return `${s}::before {
  background-image: radial-gradient(circle, ${alpha(p.ink, p.dark ? 0.12 : 0.075)} 0 1.25px, transparent 1.5px);
  background-size: 8px 8px;
}`;
    case "fibers":
      return `${s}::before {
  background-image: ${NOISE_URI}, repeating-linear-gradient(2deg, ${alpha(p.ink, 0.025)} 0 1px, transparent 1px 7px);
  opacity: ${p.dark ? 0.13 : 0.22}; mix-blend-mode: ${p.dark ? "screen" : "multiply"};
}`;
    case "engraved":
      return `${s}::before {
  background-image:
    repeating-linear-gradient(112deg, ${alpha(p.ink, p.dark ? 0.07 : 0.045)} 0 .7px, transparent .7px 8px),
    repeating-linear-gradient(68deg, ${alpha(p.ink, p.dark ? 0.035 : 0.025)} 0 .5px, transparent .5px 13px);
}`;
    default:
      return "";
  }
}

export function tokensCss(g, s) {
  const p = g.p;
  const sh = shadowValues(g);
  const caseVal = g.case === "upper" ? "uppercase" : g.case === "lower" ? "lowercase" : "none";
  return `
${s} {
  --bg: ${p.bg};
  --surface: ${p.surface};
  --surface2: ${p.surface2};
  --ink: ${p.ink};
  --muted: ${p.muted};
  --accent: ${p.accent};
  --accent2: ${p.accent2};
  --border: ${p.border};
  --on-accent: ${onColor(p.accent)};
  --f-display: ${fontStack(g.fonts.display)};
  --f-body: ${fontStack(g.fonts.body)};
  --f-mono: ${fontStack(g.fonts.mono)};
  --radius: ${g.radius}px;
  --r-ctl: ${g.ctl === 999 ? "999px" : g.ctl + "px"};
  --bw: ${g.bw}px;
  --shadow: ${sh.card};
  --shadow-btn: ${sh.btn};
  --sp: ${SPACING[g.density] || 9}px;
  --case: ${caseVal};
  --track: ${g.track}em;
  --hw: ${g.hw};
}
${textureCss(g, s)}
`;
}

// ------------------------------------------------------------- entry point

// Returns everything needed to show a genome: a scope class, the sample HTML,
// and the scoped CSS (tokens + archetype craft).
export function buildSample(g, specimen = "brand") {
  const uid = genomeKey(g);
  const cls = `s-${uid}`;
  const s = `.${cls}`;
  const css = tokensCss(g, s) + ARCHETYPES[g.archetype].css(s, g) + "\n" + motifsCss(g, s);
  const html = sampleMarkup(g, uid, specimen);
  return { cls, html, css, uid, specimen };
}

// Convenience: build a live DOM node (used by tiles and the finale preview).
export function sampleElement(g, specimen = "brand") {
  const { cls, html, css, uid } = buildSample(g, specimen);
  const el = document.createElement("div");
  el.className = `sample ${cls} specimen-${specimen}`;
  el.innerHTML = html;
  return { el, css, cls, uid, specimen };
}
