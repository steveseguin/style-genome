// Component motifs: independent sub-component treatments that are sampled
// per design, so a genome is a combination — palette × type × shape × depth ×
// texture × chart × one optional motif per component slot — rather than a
// preset. An archetype's own craft CSS keeps authority over every slot it
// styles; motifs only fill the slots it leaves open, so bespoke archetypes
// stay bespoke and plain ones gain combinatorial variety.

import { alpha, mix, onColor } from "./color.js";
import { pick, chance } from "./rng.js";

export const MOTIF_SLOTS = ["backdrop", "hero", "heading", "kicker", "card", "button", "chip", "logo", "chrome"];

export const SLOT_LABELS = {
  backdrop: "Backdrop", hero: "Hero decoration", heading: "Headline", kicker: "Eyebrow label",
  card: "Panels", button: "Buttons", chip: "Tags", logo: "Logo mark", chrome: "Header & footer",
};

// Which slots does a craft stylesheet already claim? Detected from the
// selectors it uses, so archetypes need no extra declarations.
const SLOT_CLAIMS = {
  backdrop: (css, s) => new RegExp(`${esc(s)}\\s*\\{|${esc(s)}::(before|after)`).test(css),
  hero: (css) => /\.hero(?![-\w])/.test(css),
  heading: (css) => /\.display(?![-\w])/.test(css),
  kicker: (css) => /\.kicker(?![-\w])/.test(css),
  card: (css) => /\.card(?![-\w])/.test(css),
  button: (css) => /\.btn(?![-\w])|\.btn-a|\.btn-b/.test(css),
  chip: (css) => /\.chip(?![-\w])/.test(css),
  logo: (css) => /\.logo(?![-\w])/.test(css),
  chrome: (css) => /\.topbar(?![-\w])|\.foot(?![-\w])/.test(css),
};
const esc = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function claimedSlots(craftCss, scope = ".x") {
  return MOTIF_SLOTS.filter((slot) => SLOT_CLAIMS[slot](craftCss, scope));
}

export function freeSlots(craftCss, scope = ".x") {
  const claimed = new Set(claimedSlots(craftCss, scope));
  return MOTIF_SLOTS.filter((slot) => !claimed.has(slot));
}

// A motif marked `additive` only adds a decoration (a prefix glyph, an index
// label, an accent initial, a nav underline) and may stack on a slot the
// archetype styles, as long as none of its `conflicts` patterns appear in
// the archetype's CSS. Everything else is confined to free slots.
export function motifAllowed(motif, craftCss, scope = ".x") {
  if (!SLOT_CLAIMS[motif.slot](craftCss, scope)) return true;
  if (!motif.additive) return false;
  return !(motif.conflicts || []).some((pattern) => craftCss.includes(pattern));
}

export function allowedMotifs(slot, craftCss, scope = ".x") {
  return MOTIFS_BY_SLOT[slot].filter((m) => motifAllowed(m, craftCss, scope));
}

// fit: { mode: "dark" | "light" | undefined, like: [traits that make it more
// likely], avoid: [traits that exclude it] }. Notes feed the LLM prompt.
export const MOTIFS = [
  // ------------------------------------------------------------ backdrop
  { id: "starfield", slot: "backdrop", name: "Star field", fit: { mode: "dark", avoid: ["minimal", "print"] },
    note: "The page background is a star field: three layered radial-gradient dot patterns at different tile sizes and opacities.",
    css: (s, g) => `${s} { background-image: radial-gradient(circle, ${alpha(g.p.ink, 0.7)} 0 .7px, transparent 1.1px), radial-gradient(circle, ${alpha(g.p.ink, 0.45)} 0 .5px, transparent .9px), radial-gradient(circle, ${alpha(g.p.accent, 0.8)} 0 .9px, transparent 1.3px); background-size: 97px 83px, 131px 109px, 211px 173px; background-position: 0 0, 31px 47px, 61px 17px; background-color: var(--bg); }` },
  { id: "contours", slot: "backdrop", name: "Contour rings", fit: { like: ["natural", "historic", "print", "calm"], avoid: ["minimal"] },
    note: "Faint concentric contour rings (two repeating radial gradients in the ink color at ≤8% opacity) ripple across the page background like topography.",
    css: (s, g) => `${s} { background-image: repeating-radial-gradient(circle at 78% 28%, transparent 0 22px, ${alpha(g.p.ink, 0.07)} 22px 23px), repeating-radial-gradient(circle at 14% 88%, transparent 0 30px, ${alpha(g.p.ink, 0.05)} 30px 31px); background-color: var(--bg); }` },
  { id: "gingham", slot: "backdrop", name: "Gingham check", fit: { mode: "light", like: ["warm", "friendly", "handmade", "playful"], avoid: ["minimal", "technical", "dark"] },
    note: "The page background is a gingham check: two crossing repeating-linear-gradients in the accent at ~7.5% opacity with 18px cells.",
    css: (s, g) => `${s} { background-image: repeating-linear-gradient(0deg, ${alpha(g.p.accent, 0.075)} 0 9px, transparent 9px 18px), repeating-linear-gradient(90deg, ${alpha(g.p.accent, 0.075)} 0 9px, transparent 9px 18px); background-color: var(--bg); }` },
  { id: "confetti", slot: "backdrop", name: "Confetti dots", fit: { like: ["playful", "bold", "vivid", "pattern"], avoid: ["minimal", "elegant", "calm"] },
    note: "A scatter of three flat confetti dots in the accent colors sits in the background near the right edge (radial-gradient circles at fixed positions).",
    css: (s, g) => `${s} { background-image: radial-gradient(circle at 88% 12%, ${alpha(g.p.accent, 0.85)} 0 9px, transparent 10px), radial-gradient(circle at 94% 55%, ${alpha(g.p.accent2, 0.85)} 0 6px, transparent 7px), radial-gradient(circle at 72% 88%, ${alpha(g.p.accent, 0.75)} 0 5px, transparent 6px); background-color: var(--bg); }` },
  { id: "pinstripe", slot: "backdrop", name: "Diagonal pinstripe", fit: { like: ["technical", "print", "retro"], avoid: ["soft"] },
    note: "A sparse diagonal pinstripe (1px ink lines every 14px at -45°, ~5% opacity) covers the page background.",
    css: (s, g) => `${s} { background-image: repeating-linear-gradient(-45deg, ${alpha(g.p.ink, 0.05)} 0 1px, transparent 1px 14px); background-color: var(--bg); }` },
  { id: "glowcorner", slot: "backdrop", name: "Corner glow", fit: { like: ["modern", "soft", "neon", "dark", "gradient"], avoid: ["print", "historic"] },
    note: "A soft radial glow in the accent color (~28% opacity on dark pages, ~12% on light) fades to transparent from the top-right corner of the page background.",
    css: (s, g) => `${s} { background-image: radial-gradient(circle at 86% 8%, ${alpha(g.p.accent, g.p.dark ? 0.28 : 0.12)}, transparent 42%); background-color: var(--bg); }` },
  { id: "duoglow", slot: "backdrop", name: "Twin glows", fit: { like: ["modern", "soft", "neon", "gradient", "vivid"], avoid: ["print", "historic", "minimal"] },
    note: "Two soft radial glows — accent at the top-left, second accent at the bottom-right — tint opposite corners of the page background.",
    css: (s, g) => `${s} { background-image: radial-gradient(circle at 8% 4%, ${alpha(g.p.accent, g.p.dark ? 0.22 : 0.1)}, transparent 40%), radial-gradient(circle at 96% 96%, ${alpha(g.p.accent2, g.p.dark ? 0.22 : 0.1)}, transparent 40%); background-color: var(--bg); }` },
  { id: "boardform", slot: "backdrop", name: "Board-form planks", fit: { like: ["raw", "gray", "natural", "texture"], avoid: ["soft", "elegant"] },
    note: "Vertical board-form grain — alternating 1px dark and light lines every 35px — runs down the page background.",
    css: (s, g) => `${s} { background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 34px, rgba(255,255,255,.06) 34px 35px, transparent 35px 70px); background-color: var(--bg); }` },
  { id: "traces", slot: "backdrop", name: "Circuit traces", fit: { like: ["technical", "dark", "grid"], avoid: ["elegant", "natural", "historic"] },
    note: "Low-contrast orthogonal trace lines on a 64/88px rhythm plus a sparse 45° diagonal run behind the layout, like copper traces.",
    css: (s, g) => `${s} { background-image: repeating-linear-gradient(90deg, ${alpha(g.p.accent2, 0.14)} 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, ${alpha(g.p.accent2, 0.1)} 0 1px, transparent 1px 88px), repeating-linear-gradient(45deg, transparent 0 150px, ${alpha(g.p.accent2, 0.12)} 150px 151px, transparent 151px 320px); background-color: var(--bg); }` },
  { id: "bigring", slot: "backdrop", name: "Large hairline ring", fit: { like: ["minimal", "elegant", "geometric", "modern"] },
    note: "One large hairline ring (about 240px across, 1px, ink at 12%) floats behind the top-right of the page.",
    css: (s, g) => `${s} { background-image: radial-gradient(circle at 86% 22%, transparent 118px, ${alpha(g.p.ink, 0.14)} 119px 120px, transparent 121px); background-color: var(--bg); }` },
  { id: "halftonecorner", slot: "backdrop", name: "Halftone corner", fit: { like: ["print", "retro", "bold", "pattern"], avoid: ["soft", "elegant"] },
    note: "A halftone dot field in the ink color fades in toward the top-right corner of the page (a dot pattern under a large radial gradient of the background color).",
    css: (s, g) => `${s} { background-image: radial-gradient(circle at 100% 0%, transparent 0 140px, var(--bg) 320px), radial-gradient(circle, ${alpha(g.p.ink, 0.18)} 0 1.4px, transparent 1.9px); background-size: auto, 9px 9px; background-color: var(--bg); }` },
  { id: "sunrays", slot: "backdrop", name: "Radiating rays", fit: { like: ["ornate", "retro", "bold", "elegant"], avoid: ["minimal", "technical"] },
    note: "Faint radiating rays (a repeating conic gradient in the accent at ~6% opacity) fan out from the top-right corner behind the content.",
    css: (s, g) => `${s} { background-image: repeating-conic-gradient(from 200deg at 100% 0%, ${alpha(g.p.accent, g.p.dark ? 0.07 : 0.045)} 0deg 4deg, transparent 4deg 14deg); background-color: var(--bg); }` },
  { id: "bottomwash", slot: "backdrop", name: "Bottom wash", fit: { like: ["soft", "natural", "calm", "airy"], avoid: ["print"] },
    note: "A soft elliptical wash of the second accent (~14% opacity) rises from the bottom center of the page background.",
    css: (s, g) => `${s} { background-image: radial-gradient(ellipse at 50% 100%, ${alpha(g.p.accent2, g.p.dark ? 0.16 : 0.09)}, transparent 58%); background-color: var(--bg); }` },

  // ---------------------------------------------------------------- hero
  { id: "bigcircle", slot: "hero", name: "Big circle", fit: { like: ["geometric", "bold", "playful", "modern"], avoid: ["minimal", "historic"] },
    note: "A large flat circle in the second accent (~120px, 85% opacity) sits behind the hero at the right as pure composition.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::after { content: ""; position: absolute; right: 34px; top: -8px; width: 120px; height: 120px; border-radius: 50%; background: ${g.p.accent2}; opacity: .85; z-index: -1; } ${s} .smain { z-index: 2; }` },
  { id: "rotsquare", slot: "hero", name: "Rotated square", fit: { like: ["geometric", "bold", "primary", "modern"], avoid: ["minimal", "soft"] },
    note: "A flat accent square (~70px) rotated 20° sits behind the hero on the right.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::before { content: ""; position: absolute; right: 120px; top: 40px; width: 70px; height: 70px; background: ${g.p.accent}; transform: rotate(20deg); opacity: .8; z-index: -1; } ${s} .smain { z-index: 2; }` },
  { id: "numeral", slot: "hero", name: "Watermark numeral", fit: { like: ["print", "elegant", "modern", "grid"], avoid: ["playful"] },
    note: "A giant watermark numeral '04' in the display face at ~7% opacity sits behind the hero on the right.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::after { content: "04"; position: absolute; right: 24px; top: -30px; font: ${g.hw} 190px/1 var(--f-display); color: var(--ink); opacity: .07; letter-spacing: -0.05em; pointer-events: none; z-index: 0; } ${s} .hero > * { position: relative; z-index: 1; }` },
  { id: "eclipse", slot: "hero", name: "Eclipse sigil", fit: { like: ["dark", "ornate", "elegant", "airy"], avoid: ["technical", "playful"] },
    note: "A concentric sigil — three thin rings at inset offsets plus a translucent accent disc offset like an eclipse — sits behind the hero on the right.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::before { content: ""; position: absolute; right: 40px; top: -26px; width: 180px; height: 180px; border-radius: 50%; z-index: 0; border: 1px solid ${alpha(g.p.accent, 0.7)}; box-shadow: inset 0 0 0 14px transparent, inset 0 0 0 15px ${alpha(g.p.accent, 0.45)}, inset 0 0 0 34px transparent, inset 0 0 0 35px ${alpha(g.p.accent, 0.3)}; } ${s} .hero::after { content: ""; position: absolute; right: 96px; top: 30px; width: 72px; height: 72px; border-radius: 50%; background: var(--accent); opacity: .16; z-index: 0; } ${s} .hero > * { position: relative; z-index: 1; }` },
  { id: "frameline", slot: "hero", name: "Hairline frame", fit: { like: ["elegant", "print", "minimal", "historic"], avoid: ["raw", "playful"] },
    note: "A 1px hairline rectangle in the border color frames the hero, inset by 10px, with the content sitting inside it.",
    css: (s) => `${s} .hero { position: relative; padding: 18px 20px; } ${s} .hero::before { content: ""; position: absolute; inset: 0; border: 1px solid var(--border); pointer-events: none; z-index: 0; } ${s} .hero > * { position: relative; z-index: 1; }` },
  { id: "quotemark", slot: "hero", name: "Giant quote mark", fit: { like: ["literary", "print", "elegant", "scholarly"], avoid: ["technical"] },
    note: "A giant opening quotation mark in the display face and accent color at ~14% opacity sits behind the hero's left edge.",
    css: (s) => `${s} .hero { position: relative; } ${s} .hero::before { content: "\\201C"; position: absolute; left: -12px; top: -46px; font: 700 200px/1 var(--f-display); color: var(--accent-text); opacity: .14; pointer-events: none; z-index: 0; } ${s} .hero > * { position: relative; z-index: 1; }` },
  { id: "triangles", slot: "hero", name: "Twin triangles", fit: { like: ["geometric", "bold", "primary", "retro"], avoid: ["minimal", "soft", "elegant"] },
    note: "Two flat triangles (clip-path) in the accent and second accent overlap behind the hero on the right.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::before { content: ""; position: absolute; right: 60px; top: -10px; width: 130px; height: 130px; background: ${g.p.accent}; clip-path: polygon(50% 0, 100% 100%, 0 100%); opacity: .8; z-index: -1; } ${s} .hero::after { content: ""; position: absolute; right: 20px; top: 30px; width: 110px; height: 110px; background: ${g.p.accent2}; clip-path: polygon(0 0, 100% 50%, 0 100%); opacity: .8; z-index: -1; } ${s} .smain { z-index: 2; }` },
  { id: "blob", slot: "hero", name: "Organic blob", fit: { like: ["natural", "soft", "round", "friendly"], avoid: ["technical", "geometric", "print"] },
    note: "A soft organic blob (uneven border-radius) in the second accent at ~22% opacity floats behind the hero on the right.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::after { content: ""; position: absolute; right: 30px; top: -20px; width: 200px; height: 150px; background: ${g.p.accent2}; opacity: .22; border-radius: 62% 38% 46% 54% / 55% 44% 56% 45%; z-index: -1; } ${s} .smain { z-index: 2; }` },
  { id: "arc", slot: "hero", name: "Quarter arc", fit: { like: ["modern", "soft", "geometric", "calm"], avoid: ["print", "historic"] },
    note: "A large quarter-circle in an accent tint (~12%) anchors the bottom-right corner of the hero.",
    css: (s, g) => `${s} .hero { position: relative; } ${s} .hero::after { content: ""; position: absolute; right: -10px; bottom: -24px; width: 220px; height: 220px; background: ${alpha(g.p.accent, 0.12)}; border-radius: 220px 0 0 0; z-index: -1; } ${s} .smain { z-index: 2; }` },
  { id: "elbow", slot: "hero", name: "Side slab", fit: { like: ["technical", "retro", "bold", "round"], avoid: ["minimal", "elegant", "print"] },
    note: "A tall rounded slab in the second accent (44px wide, pill-ended) frames the hero's left side; the hero content is indented beside it.",
    css: (s) => `${s} .hero { position: relative; padding-left: 62px; } ${s} .hero::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 44px; background: var(--accent2); border-radius: 22px 0 0 22px; }` },
  { id: "baseline", slot: "hero", name: "Baseline rule", fit: { like: ["minimal", "print", "elegant", "grid"] },
    note: "A full-width hairline rule in the border color closes the hero at its bottom edge.",
    css: (s) => `${s} .hero { padding-bottom: calc(var(--sp) * 1.4); border-bottom: 1px solid var(--border); }` },

  // -------------------------------------------------------------- heading
  { id: "stitch", slot: "heading", name: "Stitched outline", fit: { like: ["bold", "playful", "retro", "chunky"], avoid: ["minimal", "elegant"] },
    note: "The headline carries a layered text-shadow outline in the second accent so it reads like stitched or outlined letters.",
    css: (s, g) => `${s} .display { text-shadow: 2px 2px 0 ${g.p.accent2}, -1px -1px 0 ${g.p.accent2}, 1px -1px 0 ${g.p.accent2}, -1px 1px 0 ${g.p.accent2}; }` },
  { id: "wavy", slot: "heading", name: "Wavy underline", fit: { like: ["playful", "postmodern", "friendly", "vivid"], avoid: ["minimal", "elegant", "technical"] },
    note: "The headline gets a wavy accent underline (text-decoration: underline wavy, 3px, offset 8px).",
    css: (s) => `${s} .display { text-decoration: underline wavy var(--accent) 3px; text-underline-offset: 8px; }` },
  { id: "thickunder", slot: "heading", name: "Thick ink underline", fit: { like: ["bold", "print", "grid", "flat"], avoid: ["soft", "elegant"] },
    note: "The headline is underlined by a thick solid ink rule (text-decoration underline 6px, offset 6px).",
    css: (s) => `${s} .display { text-decoration: underline solid var(--ink) 6px; text-underline-offset: 6px; text-decoration-skip-ink: none; }` },
  { id: "glow", slot: "heading", name: "Accent glow", fit: { mode: "dark", like: ["neon", "dark", "technical", "vivid"], avoid: ["print", "historic"] },
    note: "The headline glows: an accent-colored text-shadow (0 0 18px at ~55% opacity).",
    css: (s, g) => `${s} .display { text-shadow: 0 0 18px ${alpha(g.p.accent, 0.55)}; }` },
  { id: "offsetshadow", slot: "heading", name: "Hard offset shadow", fit: { like: ["bold", "retro", "playful", "chunky"], avoid: ["minimal", "elegant"] },
    note: "The headline casts a hard offset shadow in the second accent (text-shadow 4px 4px 0, no blur).",
    css: (s, g) => `${s} .display { text-shadow: 4px 4px 0 ${g.p.accent2}; }` },
  { id: "smallcaps", slot: "heading", name: "Small caps", fit: { like: ["elegant", "print", "historic", "literary"], avoid: ["technical", "playful"] },
    note: "The headline is set in small caps with slightly open tracking (.04em).",
    css: (s) => `${s} .display { font-variant: small-caps; letter-spacing: .04em; text-transform: none; }` },
  { id: "italiclight", slot: "heading", name: "Light italic", fit: { like: ["elegant", "literary", "airy", "calm"], avoid: ["bold", "technical", "raw"] },
    note: "The headline is a light-weight italic (font-style italic, weight 400) — the only italic on the page.",
    css: (s) => `${s} .display { font-style: italic; font-weight: 400; }` },
  { id: "marker", slot: "heading", name: "Marker block", fit: { like: ["bold", "playful", "raw", "vivid"], avoid: ["elegant", "minimal"] },
    note: "The headline sits on a flat accent-tint block (~18% opacity) with a little padding, like a marker highlight.",
    css: (s, g) => `${s} .display { background: ${alpha(g.p.accent, 0.18)}; padding: .06em .18em; align-self: flex-start; }` },
  { id: "trackedcaps", slot: "heading", name: "Tracked capitals", fit: { like: ["elegant", "minimal", "geometric", "modern"], avoid: ["playful", "raw"] },
    note: "The headline is set in uppercase with wide .12em tracking at a lighter weight (600) and a smaller size.",
    css: (s) => `${s} .display { text-transform: uppercase; letter-spacing: .12em; font-weight: 600; font-size: 36px; line-height: 1.15; }` },
  { id: "firstletter", slot: "heading", name: "Accent initial", additive: true, conflicts: ["::first-letter"], fit: { like: ["print", "literary", "elegant", "historic"], avoid: ["technical"] },
    note: "The first letter of the headline is set in the accent color.",
    css: (s) => `${s} .display::first-letter { color: var(--accent-text); }` },
  { id: "numbered", slot: "heading", name: "Index prefix", additive: true, conflicts: [".display::before"], fit: { like: ["grid", "minimal", "technical", "print"], avoid: ["playful"] },
    note: "The headline is prefixed by a small mono index ('01 —') in the accent color at 40% of the headline size.",
    css: (s) => `${s} .display::before { content: "01 \\2014  "; font: 400 .38em/1 var(--f-mono); color: var(--accent-text); vertical-align: middle; letter-spacing: .08em; }` },

  // --------------------------------------------------------------- kicker
  { id: "pill", slot: "kicker", name: "Filled pill", fit: { like: ["playful", "modern", "friendly", "soft"], avoid: ["print", "historic"] },
    note: "The eyebrow label is a filled accent pill with counter-colored text.",
    css: (s, g) => `${s} .kicker { background: var(--accent); color: ${onColor(g.p.accent)}; padding: 3px 10px; border-radius: 999px; align-self: flex-start; }` },
  { id: "boxed", slot: "kicker", name: "Ink box", fit: { like: ["print", "technical", "bold", "flat"], avoid: ["soft"] },
    note: "The eyebrow label sits in a 1px ink-outlined box with square corners.",
    css: (s) => `${s} .kicker { border: 1px solid var(--ink); color: var(--ink); padding: 3px 8px; align-self: flex-start; }` },
  { id: "bracketed", slot: "kicker", name: "Brackets", fit: { like: ["technical", "print", "raw", "mono2"], avoid: ["soft", "elegant"] },
    note: "The eyebrow label is wrapped in [ square brackets ] and set in the mono face.",
    css: (s) => `${s} .kicker { font-family: var(--f-mono); } ${s} .kicker::before { content: "[ "; } ${s} .kicker::after { content: " ]"; }` },
  { id: "slashes", slot: "kicker", name: "Slash prefix", additive: true, conflicts: [".kicker::before"], fit: { like: ["technical", "dark", "neon", "modern"], avoid: ["historic", "natural"] },
    note: "The eyebrow label is prefixed by '// ' and set in the mono face.",
    css: (s) => `${s} .kicker { font-family: var(--f-mono); } ${s} .kicker::before { content: "// "; }` },
  { id: "arrow", slot: "kicker", name: "Arrow prefix", additive: true, conflicts: [".kicker::before"], fit: { like: ["modern", "bold", "flat", "grid"] },
    note: "The eyebrow label is led by a bold → arrow in the accent color.",
    css: (s) => `${s} .kicker::before { content: "\\2192  "; color: var(--accent-text); }` },
  { id: "numero", slot: "kicker", name: "Numero prefix", additive: true, conflicts: [".kicker::before"], fit: { like: ["print", "elegant", "historic", "literary"], avoid: ["technical"] },
    note: "The eyebrow label is prefixed by '№' in the display face.",
    css: (s) => `${s} .kicker::before { content: "\\2116 "; font-family: var(--f-display); font-weight: 500; }` },
  { id: "ruleprefix", slot: "kicker", name: "Rule prefix", fit: { like: ["minimal", "elegant", "modern", "grid"] },
    note: "A short 24px ink rule precedes the eyebrow label on the same line.",
    css: (s) => `${s} .kicker { display: flex; align-items: center; gap: 10px; } ${s} .kicker::before { content: ""; width: 24px; height: 1px; background: var(--ink); }` },
  { id: "pennant", slot: "kicker", name: "Pennant", fit: { like: ["playful", "bold", "retro", "chunky"], avoid: ["minimal", "elegant"] },
    note: "The eyebrow label is a pennant: a solid accent block with a notched right end (clip-path) and counter-colored text.",
    css: (s, g) => `${s} .kicker { background: var(--accent); color: ${onColor(g.p.accent)}; padding: 4px 22px 4px 12px; clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%); align-self: flex-start; }` },
  { id: "scriptline", slot: "kicker", name: "Italic script line", fit: { like: ["elegant", "literary", "natural", "warm", "handmade"], avoid: ["technical", "bold"] },
    note: "The eyebrow label is an italic lowercase line at 14px in the accent — no tracking, no caps.",
    css: (s) => `${s} .kicker { font-style: italic; text-transform: none; letter-spacing: 0; font-size: 14px; font-weight: 400; font-family: var(--f-display); }` },
  { id: "dotted", slot: "kicker", name: "Dot leaders", additive: true, conflicts: [".kicker::after"], fit: { like: ["print", "literary", "retro"], avoid: ["technical"] },
    note: "The eyebrow label is followed by a run of dot leaders in the muted color.",
    css: (s) => `${s} .kicker::after { content: " \\00B7 \\00B7 \\00B7 \\00B7 \\00B7 \\00B7"; color: var(--muted); letter-spacing: .2em; }` },
  { id: "stamp", slot: "kicker", name: "Stamp", fit: { like: ["print", "raw", "handmade", "retro"], avoid: ["soft", "elegant"] },
    note: "The eyebrow label is a stamp: 2px ink outline, tiny padding, rotated -2°.",
    css: (s) => `${s} .kicker { border: 2px solid var(--ink); color: var(--ink); padding: 2px 8px; transform: rotate(-2deg); align-self: flex-start; }` },

  // ----------------------------------------------------------------- card
  { id: "doubleframe", slot: "card", name: "Double frame", fit: { like: ["print", "historic", "elegant", "ornate"], avoid: ["soft", "modern"] },
    note: "Every panel has a second hairline frame inset 5px inside its border (outline in the border color).",
    css: (s) => `${s} .card { outline: 1px solid var(--border); outline-offset: -5px; }` },
  { id: "brackets", slot: "card", name: "Corner brackets", fit: { like: ["technical", "elegant", "dark", "ornate"], avoid: ["soft", "playful"] },
    note: "Each panel shows 10px bracket ticks (2px, border color) at its top-left and bottom-right corners.",
    css: (s) => `${s} .card { position: relative; } ${s} .card::before, ${s} .card::after { content: ""; position: absolute; width: 10px; height: 10px; border: 2px solid var(--border); pointer-events: none; } ${s} .card::before { top: -1px; left: -1px; border-right: none; border-bottom: none; } ${s} .card::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }` },
  { id: "tilt", slot: "card", name: "Hand-set tilt", additive: true, conflicts: ["rotate("], fit: { like: ["playful", "handmade", "raw", "bold"], avoid: ["minimal", "elegant", "technical"] },
    note: "Panels tilt alternately by ±0.8°, like cards set down by hand.",
    css: (s) => `${s} .card:nth-child(odd) { transform: rotate(-0.8deg); } ${s} .card:nth-child(even) { transform: rotate(0.8deg); }` },
  { id: "clipped", slot: "card", name: "Clipped corner", fit: { like: ["technical", "dark", "geometric", "bold"], avoid: ["soft", "natural", "round"] },
    note: "Panels have one 45° clipped top-right corner (clip-path) instead of a rounded one.",
    css: (s) => `${s} .card { clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%); border-radius: 0; }` },
  { id: "insetplate", slot: "card", name: "Inset plate", fit: { like: ["historic", "elegant", "scholarly", "print"], avoid: ["playful", "technical"] },
    note: "Each panel carries an inner plate frame: a 1px rule in the border color inset 6px, drawn with a pseudo-element.",
    css: (s) => `${s} .card { position: relative; } ${s} .card::before { content: ""; position: absolute; inset: 6px; border: 1px solid var(--border); border-radius: max(0px, calc(var(--radius) - 6px)); pointer-events: none; }` },
  { id: "mixedradii", slot: "card", name: "Mismatched corners", fit: { like: ["playful", "postmodern", "soft", "friendly"], avoid: ["minimal", "print", "technical"] },
    note: "Neighboring panels deliberately disagree on corners: one square, one very round, one round on two opposite corners.",
    css: (s) => `${s} .card:nth-child(3n+1) { border-radius: 2px; } ${s} .card:nth-child(3n+2) { border-radius: 24px; } ${s} .card:nth-child(3n) { border-radius: 4px 24px 4px 24px; }` },
  { id: "inktop", slot: "card", name: "Ink top rule", fit: { like: ["print", "grid", "minimal", "flat"], avoid: ["soft", "round"] },
    note: "Panels carry a 3px solid ink rule along their top edge (ink, never the accent).",
    css: (s) => `${s} .card { border-top: 3px solid var(--ink); }` },
  { id: "numberedcards", slot: "card", name: "Index labels", additive: true, conflicts: [".card::after", "counter("], fit: { like: ["grid", "minimal", "technical", "print"], avoid: ["playful"] },
    note: "Each panel is labeled with a small mono index (01, 02, 03) in the muted color at its top-right corner.",
    css: (s) => `${s} .cards { counter-reset: motifcard; } ${s} .card { position: relative; counter-increment: motifcard; } ${s} .card::after { content: counter(motifcard, decimal-leading-zero); position: absolute; top: 7px; right: 9px; font: 9.5px var(--f-mono); color: var(--muted); letter-spacing: .08em; pointer-events: none; }` },
  { id: "stackshadow", slot: "card", name: "Stacked shadow", fit: { mode: "light", like: ["bold", "playful", "print", "retro"], avoid: ["soft", "minimal"] },
    note: "Panels cast a two-layer hard shadow: 4px in the border color, then 8px in the secondary surface — like stacked paper.",
    css: (s) => `${s} .card { box-shadow: 4px 4px 0 var(--border), 8px 8px 0 var(--surface2); }` },
  { id: "altsurface", slot: "card", name: "Alternating surfaces", fit: { like: ["modern", "soft", "minimal", "flat"] },
    note: "Every second panel uses the secondary surface color instead of the primary one.",
    css: (s) => `${s} .card:nth-child(even) { background: var(--surface2); }` },
  { id: "dogear", slot: "card", name: "Dog-ear corner", fit: { like: ["print", "handmade", "playful", "warm"], avoid: ["technical", "dark"] },
    note: "Each panel has a folded dog-ear at its top-right corner drawn with a two-tone linear gradient.",
    css: (s) => `${s} .card { background-image: linear-gradient(225deg, var(--bg) 0 11px, var(--surface2) 11px 12px, transparent 12px); border-top-right-radius: 0; }` },

  // --------------------------------------------------------------- button
  { id: "capsbtn", slot: "button", name: "Tracked capitals", additive: true, conflicts: ["text-transform", "letter-spacing", ".btn {"], fit: { like: ["elegant", "minimal", "print", "bold"] },
    note: "Buttons are set in uppercase with .1em tracking at 11.5px.",
    css: (s) => `${s} .btn { text-transform: uppercase; letter-spacing: .1em; font-size: 11.5px; padding: 10px 18px; }` },
  { id: "inkoutline", slot: "button", name: "Ink outlines", fit: { like: ["bold", "print", "flat", "raw"], avoid: ["soft"] },
    note: "Both buttons carry a 2px ink border; the primary keeps its accent fill.",
    css: (s) => `${s} .btn { border: 2px solid var(--ink); } ${s} .btn-b { color: var(--ink); }` },
  { id: "hardbtn", slot: "button", name: "Offset shadow", fit: { like: ["bold", "playful", "retro", "chunky"], avoid: ["soft", "elegant", "minimal"] },
    note: "Buttons cast a hard 3px offset shadow in the ink color with zero blur and have a 2px ink border.",
    css: (s) => `${s} .btn { border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); }` },
  { id: "inverted", slot: "button", name: "Ink primary", fit: { like: ["minimal", "elegant", "print", "flat"] },
    note: "The primary button is a solid ink block with page-colored text; the secondary is a plain text link with an arrow.",
    css: (s) => `${s} .btn-a { background: var(--ink); color: var(--bg); box-shadow: none; } ${s} .btn-b { border-color: transparent; padding-left: 4px; text-decoration: underline; text-underline-offset: 4px; } ${s} .btn-b::after { content: " \\2192"; }` },
  { id: "glowbtn", slot: "button", name: "Neon glow", fit: { mode: "dark", like: ["neon", "dark", "vivid", "technical"], avoid: ["print"] },
    note: "The primary button emits an accent glow (0 0 18px at ~50%); the secondary has an accent-tinted border glow.",
    css: (s, g) => `${s} .btn-a { box-shadow: 0 0 18px ${alpha(g.p.accent, 0.5)}; } ${s} .btn-b { box-shadow: 0 0 10px ${alpha(g.p.accent, 0.2)}; }` },
  { id: "clippedbtn", slot: "button", name: "Clipped corners", fit: { like: ["technical", "dark", "geometric", "bold"], avoid: ["soft", "round"] },
    note: "Buttons have one clipped 45° corner (clip-path) and square corners elsewhere.",
    css: (s) => `${s} .btn { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); border-radius: 0; }` },
  { id: "bracketbtn", slot: "button", name: "Bracketed secondary", fit: { like: ["technical", "print", "mono2", "raw"] },
    note: "The secondary button loses its border and reads as [ bracketed text ] in the mono face.",
    css: (s) => `${s} .btn-b { border-color: transparent; font-family: var(--f-mono); } ${s} .btn-b::before { content: "[ "; } ${s} .btn-b::after { content: " ]"; }` },
  { id: "widebtn", slot: "button", name: "Wide and low", fit: { like: ["elegant", "minimal", "airy", "calm"] },
    note: "Buttons are wide and low: padding 9px 28px, weight 500, slight .04em tracking.",
    css: (s) => `${s} .btn { padding: 9px 28px; font-weight: 500; letter-spacing: .04em; }` },
  { id: "squarebtn", slot: "button", name: "Square blocks", fit: { like: ["bold", "print", "grid", "flat", "geometric"], avoid: ["soft", "round"] },
    note: "Buttons are strict rectangles (0px radius) with generous 10px 20px padding and weight 700.",
    css: (s) => `${s} .btn { border-radius: 0; padding: 10px 20px; font-weight: 700; }` },
  { id: "underlinebtn", slot: "button", name: "Underlined secondary", fit: { like: ["minimal", "elegant", "modern"] },
    note: "The secondary button is borderless text underlined in the accent, with the underline offset 5px.",
    css: (s) => `${s} .btn-b { border-color: transparent; padding-left: 2px; padding-right: 2px; text-decoration: underline var(--accent) 2px; text-underline-offset: 5px; }` },

  // ----------------------------------------------------------------- chip
  { id: "fillaccent", slot: "chip", name: "Accent fills", fit: { like: ["bold", "playful", "vivid", "modern"], avoid: ["minimal", "elegant"] },
    note: "Tags are solid accent fills with counter-colored text and no border.",
    css: (s, g) => `${s} .chip { background: var(--accent); color: ${onColor(g.p.accent)}; border-color: transparent; font-weight: 600; }` },
  { id: "tintchips", slot: "chip", name: "Accent tints", fit: { like: ["modern", "soft", "friendly", "clean"] },
    note: "Tags are borderless accent tints (~14%) with ink text.",
    css: (s, g) => `${s} .chip { background: ${alpha(g.p.accent, 0.14)}; border-color: transparent; color: var(--ink); }` },
  { id: "bracketchips", slot: "chip", name: "Bracketed", fit: { like: ["technical", "print", "raw", "mono2"], avoid: ["soft"] },
    note: "Tags are borderless mono text wrapped in [ brackets ].",
    css: (s) => `${s} .chip { border: none; padding: 0 4px; font-family: var(--f-mono); color: var(--ink); } ${s} .chip::before { content: "[ "; color: var(--muted); } ${s} .chip::after { content: " ]"; color: var(--muted); }` },
  { id: "monochips", slot: "chip", name: "Mono capitals", fit: { like: ["technical", "dark", "grid", "print"] },
    note: "Tags are uppercase mono at 9.5px with .08em tracking.",
    css: (s) => `${s} .chip { font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px; letter-spacing: .08em; }` },
  { id: "dotchips", slot: "chip", name: "Dot prefix", additive: true, conflicts: [".chip::before"], fit: { like: ["modern", "clean", "minimal", "technical"] },
    note: "Each tag is led by a small ● dot in the accent color.",
    css: (s) => `${s} .chip::before { content: "\\25CF "; color: var(--accent-text); font-size: 8px; vertical-align: 1px; }` },
  { id: "hashchips", slot: "chip", name: "Hashtags", fit: { like: ["modern", "playful", "friendly", "familiar"] },
    note: "Tags are borderless hashtags (#tag) in the accent color.",
    css: (s) => `${s} .chip { border: none; padding: 0 4px; color: var(--accent-text); font-weight: 600; } ${s} .chip::before { content: "#"; }` },
  { id: "squarechips", slot: "chip", name: "Square ink boxes", fit: { like: ["print", "bold", "grid", "flat", "raw"], avoid: ["soft", "round"] },
    note: "Tags are square-cornered boxes with a 1.5px ink border and ink text.",
    css: (s) => `${s} .chip { border: 1.5px solid var(--ink); border-radius: 0; color: var(--ink); }` },
  { id: "altchips", slot: "chip", name: "Alternating fills", fit: { like: ["playful", "vivid", "bold", "pattern"], avoid: ["minimal", "elegant"] },
    note: "Tags alternate between accent and second-accent fills with counter-colored text.",
    css: (s, g) => `${s} .chip { background: var(--accent); color: ${onColor(g.p.accent)}; border-color: transparent; } ${s} .chip:nth-child(even) { background: var(--accent2); color: ${onColor(g.p.accent2)}; }` },
  { id: "underlinechips", slot: "chip", name: "Underlined words", fit: { like: ["minimal", "elegant", "literary", "print"] },
    note: "Tags are plain words underlined in the border color, with no box.",
    css: (s) => `${s} .chip { border: none; border-radius: 0; padding: 0 2px; border-bottom: 1px solid var(--border); color: var(--ink); }` },

  // ----------------------------------------------------------------- logo
  { id: "logocircle", slot: "logo", name: "Circle", fit: {}, note: "The logo mark is a perfect accent circle.",
    css: (s) => `${s} .logo { border-radius: 50%; width: 15px; height: 15px; }` },
  { id: "logodiamond", slot: "logo", name: "Diamond", fit: { like: ["elegant", "ornate", "geometric", "historic"] }, note: "The logo mark is a small accent diamond (a square rotated 45°).",
    css: (s) => `${s} .logo { border-radius: 0; transform: rotate(45deg); width: 11px; height: 11px; }` },
  { id: "logoring", slot: "logo", name: "Ring", fit: { like: ["minimal", "elegant", "technical", "modern"] }, note: "The logo mark is a ring: a transparent circle with a 2.5px accent outline.",
    css: (s) => `${s} .logo { border-radius: 50%; background: transparent; border: 2.5px solid var(--accent); width: 15px; height: 15px; }` },
  { id: "logobar", slot: "logo", name: "Pill bar", fit: { like: ["modern", "technical", "retro", "round"] }, note: "The logo mark is a short accent pill bar (24×8px).",
    css: (s) => `${s} .logo { border-radius: 999px; width: 24px; height: 8px; }` },
  { id: "logotwin", slot: "logo", name: "Twin squares", fit: { like: ["geometric", "bold", "primary", "modern"] }, note: "The logo mark is two overlapping squares — accent in front, second accent offset behind (box-shadow).",
    css: (s) => `${s} .logo { border-radius: 0; width: 12px; height: 12px; box-shadow: 5px 5px 0 var(--accent2); margin-right: 5px; }` },
  { id: "logohex", slot: "logo", name: "Hexagon", fit: { like: ["technical", "geometric", "modern", "dark"] }, note: "The logo mark is an accent hexagon (clip-path polygon).",
    css: (s) => `${s} .logo { border-radius: 0; width: 16px; height: 16px; clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%); }` },
  { id: "logoslash", slot: "logo", name: "Slash", fit: { like: ["bold", "technical", "modern", "flat"] }, note: "The logo mark is a skewed accent slab, like a forward slash.",
    css: (s) => `${s} .logo { border-radius: 1px; width: 9px; height: 16px; transform: skewX(-18deg); }` },
  { id: "logodots", slot: "logo", name: "Dot pair", fit: { like: ["playful", "friendly", "soft", "modern"] }, note: "The logo mark is a pair of dots: accent, then second accent (box-shadow), each 7px.",
    css: (s) => `${s} .logo { border-radius: 50%; width: 7px; height: 7px; box-shadow: 10px 0 0 var(--accent2); margin-right: 10px; }` },
  { id: "logoringdot", slot: "logo", name: "Ring and dot", fit: { like: ["elegant", "historic", "ornate", "print"] }, note: "The logo mark is an accent dot inside a hairline ink ring.",
    css: (s) => `${s} .logo { border-radius: 50%; width: 16px; height: 16px; background: transparent; border: 1px solid var(--ink); box-shadow: inset 0 0 0 4px var(--bg), inset 0 0 0 12px var(--accent); }` },
  { id: "logotriangle", slot: "logo", name: "Triangle", fit: { like: ["geometric", "bold", "playful", "retro"] }, note: "The logo mark is an upward accent triangle (clip-path).",
    css: (s) => `${s} .logo { border-radius: 0; width: 16px; height: 14px; clip-path: polygon(50% 0, 100% 100%, 0 100%); }` },

  // --------------------------------------------------------------- chrome
  { id: "inkbar", slot: "chrome", name: "Ink header", fit: { like: ["bold", "print", "flat", "grid", "highcontrast"], avoid: ["soft"] },
    note: "The header and footer are solid ink bars with page-colored text and no rule.",
    css: (s) => `${s} .topbar, ${s} .foot { background: var(--ink); color: var(--bg); border-color: transparent; } ${s} .topnav .nl { color: var(--bg); opacity: .65; } ${s} .topnav .nl.on { color: var(--bg); opacity: 1; } ${s} .topbar .btn-b { border-color: var(--bg); color: var(--bg); } ${s} .brand { color: var(--bg); }` },
  { id: "accentbar", slot: "chrome", name: "Accent header", fit: { like: ["bold", "playful", "vivid", "retro"], avoid: ["minimal", "elegant", "print"] },
    note: "The header is a solid accent bar with counter-colored text; the footer sits on the secondary surface.",
    css: (s, g) => { const on = onColor(g.p.accent); return `${s} .topbar { background: var(--accent); color: ${on}; border-color: transparent; } ${s} .brand, ${s} .topnav .nl, ${s} .topnav .nl.on { color: ${on}; } ${s} .topnav .nl { opacity: .7; } ${s} .topnav .nl.on { opacity: 1; } ${s} .topbar .btn-b { border-color: ${on}; color: ${on}; } ${s} .logo { background: ${on}; } ${s} .foot { background: var(--surface2); border-color: transparent; }`; } },
  { id: "doublerule", slot: "chrome", name: "Double rules", fit: { like: ["print", "elegant", "historic", "ornate"], avoid: ["soft", "technical"] },
    note: "The header and footer are separated from the page by 3px double rules in the border color.",
    css: (s) => `${s} .topbar { border-bottom: 3px double var(--border); } ${s} .foot { border-top: 3px double var(--border); }` },
  { id: "thickrule", slot: "chrome", name: "Thick ink rules", fit: { like: ["bold", "print", "flat", "raw"], avoid: ["soft", "elegant"] },
    note: "The header and footer rules are 3px solid ink.",
    css: (s) => `${s} .topbar { border-bottom: 3px solid var(--ink); } ${s} .foot { border-top: 3px solid var(--ink); }` },
  { id: "norule", slot: "chrome", name: "Rule-less bands", fit: { like: ["soft", "modern", "minimal", "clean"] },
    note: "The header and footer have no rule at all; they sit on the secondary surface color.",
    css: (s) => `${s} .topbar, ${s} .foot { border-color: transparent; background: var(--surface2); }` },
  { id: "pillnav", slot: "chrome", name: "Pill navigation", fit: { like: ["modern", "friendly", "soft", "round", "playful"], avoid: ["print"] },
    note: "Navigation links are pills: padded, bordered in the border color, with the current page filled in the accent.",
    css: (s, g) => `${s} .topnav { gap: 6px; } ${s} .topnav .nl { padding: 4px 11px; border: 1px solid var(--border); border-radius: var(--r-ctl); font-size: 12px; } ${s} .topnav .nl.on { background: var(--accent); color: ${onColor(g.p.accent)}; border-color: var(--accent); }` },
  { id: "centerednav", slot: "chrome", name: "Centered navigation", fit: { like: ["elegant", "print", "minimal", "literary"] },
    note: "The header centers its navigation with wide gaps, brand at the left and the action at the right.",
    css: (s) => `${s} .topbar { justify-content: space-between; } ${s} .topnav { gap: calc(var(--sp) * 3); letter-spacing: .04em; text-transform: uppercase; font-size: 11px; } ${s} .navbtn { margin-left: 0; }` },
  { id: "mononav", slot: "chrome", name: "Mono navigation", additive: true, conflicts: [".topnav", ".nl", ".foot"], fit: { like: ["technical", "dark", "grid", "mono2", "retro"] },
    note: "Navigation links and the footer are set in uppercase mono at 11px with .1em tracking.",
    css: (s) => `${s} .topnav .nl, ${s} .foot { font-family: var(--f-mono); text-transform: uppercase; font-size: 10.5px; letter-spacing: .1em; }` },
  { id: "dashedrule", slot: "chrome", name: "Dashed rules", fit: { like: ["handmade", "print", "raw", "playful"], avoid: ["elegant", "soft"] },
    note: "The header and footer rules are dashed 1px lines in the ink color.",
    css: (s) => `${s} .topbar { border-bottom: 1px dashed var(--ink); } ${s} .foot { border-top: 1px dashed var(--ink); }` },
  { id: "underlinednav", slot: "chrome", name: "Underlined current", additive: true, conflicts: [".topnav", ".nl"], fit: { like: ["minimal", "modern", "clean", "familiar"] },
    note: "The current navigation link is underlined in the accent (2px, offset 6px) instead of being bold.",
    css: (s) => `${s} .topnav .nl.on { font-weight: inherit; color: var(--ink); text-decoration: underline var(--accent) 2px; text-underline-offset: 6px; }` },
];

export const MOTIF_BY_ID = Object.fromEntries(MOTIFS.map((m) => [m.id, m]));
export const MOTIFS_BY_SLOT = Object.fromEntries(MOTIF_SLOTS.map((slot) => [slot, MOTIFS.filter((m) => m.slot === slot)]));

// Nominal number of motif combinations (each slot: its motifs + none).
export const MOTIF_COMBOS = MOTIF_SLOTS.reduce((n, slot) => n * (MOTIFS_BY_SLOT[slot].length + 1), 1);

function fits(motif, g, traits) {
  const fit = motif.fit || {};
  if (fit.mode === "dark" && !g.p.dark) return false;
  if (fit.mode === "light" && g.p.dark) return false;
  if (fit.avoid && fit.avoid.some((t) => traits.includes(t))) return false;
  return true;
}

// Per-slot chance of taking a motif. Quiet archetypes get fewer; the two
// most decorative slots are rarer so a design gains character, not clutter.
function slotRate(slot, traits) {
  const quiet = traits.includes("minimal") || traits.includes("calm") || traits.includes("elegant");
  const base = slot === "backdrop" ? 0.16 : slot === "hero" ? 0.24 : 0.45;
  return quiet ? base * 0.5 : base;
}

export function sampleMotifs(r, g, craftCss, traits, scope = ".x") {
  const out = {};
  const free = new Set(freeSlots(craftCss, scope));
  for (const slot of MOTIF_SLOTS) {
    // Claimed slots only take additive motifs, and less often.
    const rate = free.has(slot) ? slotRate(slot, traits) : slotRate(slot, traits) * 0.5;
    if (!chance(r, rate)) continue;
    const pool = allowedMotifs(slot, craftCss, scope).filter((m) => fits(m, g, traits));
    if (!pool.length) continue;
    // Weight motifs that share a trait with the archetype 3:1 over neutral ones.
    const weighted = [];
    for (const m of pool) {
      const w = m.fit?.like && m.fit.like.some((t) => traits.includes(t)) ? 3 : 1;
      for (let i = 0; i < w; i++) weighted.push(m);
    }
    out[slot] = pick(r, weighted).id;
  }
  return out;
}

// Drop motifs that no longer apply (unknown id, wrong slot, or a slot the
// archetype's own CSS claims). Used by import, crossover, and the editor.
export function normalizeMotifs(motifs, craftCss, scope = ".x") {
  const out = {};
  for (const [slot, id] of Object.entries(motifs || {})) {
    const m = MOTIF_BY_ID[id];
    if (m && m.slot === slot && motifAllowed(m, craftCss, scope)) out[slot] = id;
  }
  return out;
}

export function activeMotifs(g) {
  return MOTIF_SLOTS.map((slot) => MOTIF_BY_ID[g.motifs?.[slot]]).filter(Boolean);
}

export function motifsCss(g, s) {
  return activeMotifs(g).map((m) => `/* motif: ${m.name} (${m.slot}) */\n${m.css(s, g)}`).join("\n");
}

export function motifNotes(g) {
  return activeMotifs(g).map((m) => `${SLOT_LABELS[m.slot]} motif "${m.name}": ${m.note}`);
}
