// Renders a genome: fixed sample markup + generated scoped CSS.
// The same two functions feed the live tiles, the finale preview, and the
// PNG exporter.

import { ARCHETYPES } from "./archetypes/index.js";
import { fontStack } from "./fonts.js";
import { alpha, mix, onColor } from "./color.js";
import { genomeKey } from "./genome.js";
import { NOISE_URI, SAMPLE_BASE, SAMPLE_W, SAMPLE_H } from "./sampleBase.js";

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

function chartSvg(g, uid) {
  const w = 210, h = 96, pad = 6;
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

  let body = "";
  switch (g.chart) {
    case "bars":
      body = bars((v) => `fill="${v === max ? "var(--accent)" : "var(--accent2)"}" rx="${Math.min(g.radius, 5)}"`);
      break;
    case "bars-outline":
      body = bars(() => `fill="none" stroke="var(--ink)" stroke-width="1.5"`);
      break;
    case "bars-hatch": {
      const hatch = `<defs><pattern id="h${uid}" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--accent)" stroke-width="1.6"/></pattern></defs>`;
      body = hatch + bars((v) => `fill="url(#h${uid})" stroke="var(--ink)" stroke-width="1.2"`);
      break;
    }
    case "line": {
      const pts = polyPoints(LINE_DATA, w, h, pad + 2);
      const dots = pts.split(" ").map((p) => {
        const [x, y] = p.split(",");
        return `<circle cx="${x}" cy="${y}" r="2.4" fill="var(--accent)"/>`;
      }).join("");
      body = `<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/>` + dots;
      break;
    }
    case "area": {
      const pts = polyPoints(LINE_DATA, w, h, pad + 2);
      body =
        `<polygon points="${pad + 2},${h - pad - 2} ${pts} ${w - pad - 2},${h - pad - 2}" fill="var(--accent)" opacity="0.22"/>` +
        `<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/>`;
      break;
    }
    case "dots": {
      body = BAR_DATA.map((v, i) => {
        const count = Math.max(1, Math.round((v / max) * 6));
        const x = pad + i * slot + slot / 2;
        let dots = "";
        for (let k = 0; k < count; k++) {
          const y = h - pad - 5 - k * 13;
          dots += `<circle cx="${x.toFixed(1)}" cy="${y}" r="4" fill="${k === count - 1 ? "var(--accent)" : "var(--accent2)"}"/>`;
        }
        return dots;
      }).join("");
      break;
    }
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${grid}${base}${body}</svg>`;
}

function sparkSvg() {
  const w = 200, h = 34;
  const pts = polyPoints(SPARK_DATA, w, h, 3);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/></svg>`;
}

// ------------------------------------------------------------------ markup

export function sampleMarkup(g, uid) {
  return `
<header class="topbar">
  <span class="brand"><span class="logo"></span>Nordwind</span>
  <nav class="topnav"><span class="nl on">Work</span><span class="nl">Notes</span><span class="nl">About</span></nav>
  <span class="btn btn-b navbtn">Contact</span>
</header>
<main class="smain">
  <div class="hero">
    <span class="kicker">Field notes · 04</span>
    <h1 class="display">Make it feel deliberate</h1>
    <p class="sub">A short standfirst that sets the tone — cadence, contrast, and a point of view carried through every surface.</p>
    <div class="actions"><span class="btn btn-a">Get started</span><span class="btn btn-b">Browse the notes</span></div>
  </div>
  <div class="cards">
    <section class="card">
      <h3 class="card-t">Palette &amp; texture</h3>
      <p class="card-p">Surfaces, ink, and accent working in proportion — the quiet parts doing most of the talking.</p>
      <div class="chips"><span class="chip">design</span><span class="chip">systems</span><span class="chip">type</span></div>
    </section>
    <section class="card stat">
      <span class="stat-label">Monthly readers</span>
      <span class="stat-num">48,210</span>
      <span class="stat-delta">▲ 12.4% vs last month</span>
      ${sparkSvg()}
    </section>
    <section class="card chartcard">
      <h3 class="card-t">Output by quarter</h3>
      ${chartSvg(g, uid)}
    </section>
  </div>
</main>
<footer class="foot"><span>© Nordwind Studio</span><span>Imprint · Colophon · RSS</span></footer>`;
}

// ------------------------------------------------------------------ tokens

const SPACING = { airy: 12, normal: 9, dense: 7 };

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

function textureCss(g, s) {
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
export function buildSample(g) {
  const uid = genomeKey(g);
  const cls = `s-${uid}`;
  const s = `.${cls}`;
  const css = tokensCss(g, s) + ARCHETYPES[g.archetype].css(s, g);
  const html = sampleMarkup(g, uid);
  return { cls, html, css, uid };
}

// Convenience: build a live DOM node (used by tiles and the finale preview).
export function sampleElement(g) {
  const { cls, html, css, uid } = buildSample(g);
  const el = document.createElement("div");
  el.className = `sample ${cls}`;
  el.innerHTML = html;
  return { el, css, cls, uid };
}
