// Legibility guards.
//
// 1. paletteIssues(g): static WCAG checks on the token pairs every design
//    uses for text. Calibrated per archetype: a genome only fails a pair
//    when it is below the standard threshold AND below what the archetype's
//    own designs achieve, so bespoke palettes are never rejected but a
//    foreign palette that breaks legibility is.
// 2. auditContrast(root): a rendered-DOM audit (browser only) that composites
//    each text element's color against its effective background. This is
//    the only thing that catches craft CSS with hardcoded surfaces — e.g. a
//    light-paper archetype with white cards handed near-white ink.

import { contrast, onColor, hexToRgb } from "./color.js";

const PAIRS = [
  ["ink", "bg", 4.5, "body text on the page"],
  ["ink", "surface", 4.5, "text on cards"],
  ["ink", "surface2", 3, "text on secondary surfaces"],
  ["muted", "bg", 3, "muted text on the page"],
  ["muted", "surface", 3, "muted text on cards"],
  ["onaccent", "accent", 3, "text on the primary button"],
];

const value = (p, role) => (role === "onaccent" ? onColor(p.accent) : p[role]);

function pairRatios(p) {
  return PAIRS.map(([fg, bg, min, label]) => ({ fg, bg, min, label, ratio: contrast(value(p, fg), value(p, bg)) }));
}

// Per-archetype floor: the lowest ratio its own conform() produces for each
// pair (sampled once), scaled a little so honest re-rolls still pass.
const designedFloor = new Map();
export function calibrate(archetypeId, sampleGenomes) {
  const floor = {};
  for (const g of sampleGenomes) {
    for (const r of pairRatios(g.p)) {
      const key = `${r.fg}/${r.bg}`;
      floor[key] = key in floor ? Math.min(floor[key], r.ratio) : r.ratio;
    }
  }
  for (const key of Object.keys(floor)) floor[key] *= 0.85;
  designedFloor.set(archetypeId, floor);
}

export function paletteIssues(g) {
  const floor = designedFloor.get(g.archetype) || {};
  const out = [];
  for (const r of pairRatios(g.p)) {
    const key = `${r.fg}/${r.bg}`;
    const required = Math.min(r.min, floor[key] ?? r.min);
    if (r.ratio < required) out.push({ ...r, required });
  }
  return out;
}

export const paletteLegible = (g) => paletteIssues(g).length === 0;

// ----------------------------------------------------------- DOM audit

function parseCss(color) {
  const m = color && color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = "1"] = m[1].split(",").map((s) => parseFloat(s.trim()));
  return { r, g, b, a: Number.isFinite(a) ? a : 1 };
}

const over = (top, bottom) => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});

const toHex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

// A gradient background is approximated by the average of its color stops
// (url() images contribute nothing). Good enough to tell a navy title bar
// from a white card; exact stop geometry is not modeled.
function gradientColor(image) {
  if (!image || image === "none" || !/gradient\(/.test(image)) return null;
  const stops = [...image.matchAll(/rgba?\([^)]+\)/g)].map((m) => parseCss(m[0])).filter(Boolean);
  if (!stops.length) return null;
  // A gradient with a fully transparent stop is a sparse decoration (confetti
  // dots, contour rings, glows) whose coverage the average cannot express;
  // the surface underneath is what text really sits on.
  if (stops.some((c) => c.a === 0)) return null;
  const n = stops.length;
  const sum = stops.reduce((acc, c) => ({ r: acc.r + c.r * c.a, g: acc.g + c.g * c.a, b: acc.b + c.b * c.a, a: acc.a + c.a }), { r: 0, g: 0, b: 0, a: 0 });
  if (sum.a === 0) return null;
  return { r: sum.r / sum.a, g: sum.g / sum.a, b: sum.b / sum.a, a: sum.a / n };
}

// "#rrggbb" → "rgb(r, g, b)" so parseCss can read a custom property value.
function cssColorToRgb(value) {
  const m = value && value.match(/^#([0-9a-f]{6})$/i);
  if (!m) return value;
  const n = parseInt(m[1], 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

function hasOwnText(el) {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) return true;
  }
  return false;
}

function shortLabel(el, root) {
  const parts = [];
  let node = el;
  while (node && node !== root && parts.length < 2) {
    const cls = [...node.classList].find((c) => !c.startsWith("s-") && c !== "sample" && !c.startsWith("specimen-"));
    if (cls) parts.unshift(`.${cls}`);
    else if (parts.length === 0) parts.unshift(node.tagName.toLowerCase());
    node = node.parentElement;
  }
  return parts.join(" ");
}

// Returns [{ label, text, ratio, required, fg, bg }] sorted worst-first.
// `root` should be a rendered .sample element in the document.
export function auditContrast(root, { rootBg } = {}) {
  if (!root || typeof getComputedStyle !== "function") return [];
  const rootCs = getComputedStyle(root);
  // Base = the page color. A root whose background is a gradient reports a
  // transparent background-color, so fall back to the --bg token, then
  // composite the root gradient on top.
  let base = parseCss(rootBg) || parseCss(rootCs.backgroundColor);
  if (!base || base.a === 0) base = parseCss(cssColorToRgb(rootCs.getPropertyValue("--bg").trim())) || { r: 255, g: 255, b: 255, a: 1 };
  base = { ...base, a: 1 };
  const rootGradient = gradientColor(rootCs.backgroundImage);
  if (rootGradient && rootGradient.a > 0) base = over(rootGradient, base);
  const issues = [];
  const elements = root.querySelectorAll("*");
  for (const el of elements) {
    if (el.closest("svg")) continue;
    if (!hasOwnText(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
    if (el.matches("[disabled], [disabled] *, [aria-hidden='true'], [aria-hidden='true'] *")) continue;
    // Gradient-filled (background-clip: text) and transparent text is a
    // deliberate effect the color channel cannot describe.
    if ((cs.webkitBackgroundClip || cs.backgroundClip) === "text") continue;
    const fill = cs.webkitTextFillColor && parseCss(cs.webkitTextFillColor);
    if (fill && fill.a === 0) continue;
    // Effective background: composite ancestor background-colors root→el.
    const chain = [];
    for (let node = el; node && node !== root; node = node.parentElement) chain.unshift(node);
    let bg = { ...base, a: 1 };
    for (const node of chain) {
      const ncs = getComputedStyle(node);
      const c = parseCss(ncs.backgroundColor);
      if (c && c.a > 0) bg = over(c, bg);
      const gc = gradientColor(ncs.backgroundImage);
      if (gc && gc.a > 0) bg = over(gc, bg);
    }
    const fgRaw = parseCss(cs.color);
    if (!fgRaw || fgRaw.a === 0) continue;
    const fg = fgRaw.a < 1 ? over(fgRaw, bg) : fgRaw;
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;
    const ratio = contrast(toHex(fg), toHex(bg));
    if (ratio < required) {
      // A text-shadow (outline, emboss, glow) adds legibility the color
      // channel cannot show; report it, but never as a hard failure.
      const shadowed = cs.textShadow && cs.textShadow !== "none";
      issues.push({ label: shortLabel(el, root), text: el.textContent.trim().slice(0, 28), ratio, required, fg: toHex(fg), bg: toHex(bg), size, shadowed });
    }
  }
  return issues.sort((a, b) => a.ratio - b.ratio);
}

// A rendering is unusable when readable-size text falls under 2:1 (or large
// text under 1.5:1) — white-on-white territory rather than a soft WCAG miss.
// Soft misses are reported in the editor, not rejected: many archetypes are
// designed with low-contrast decorative labels on purpose.
export function hardFailures(issues) {
  return issues.filter((i) => !i.shadowed && i.ratio < (i.required === 3 ? 1.5 : 2));
}

export function summarizeIssues(issues) {
  if (!issues.length) return "All text passes WCAG contrast in this preview.";
  const worst = issues.slice(0, 3).map((i) => `${i.label} ${i.ratio.toFixed(1)}:1`).join(", ");
  return `${issues.length} contrast ${issues.length === 1 ? "issue" : "issues"} (needs ${issues[0].required}:1): ${worst}${issues.length > 3 ? "…" : ""}`;
}

export { hexToRgb };
