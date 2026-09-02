// Starter stylesheet: a structure-agnostic baseline that already obeys the
// genome tokens and uses the SAME class contract as the archetype craft CSS.
// Tokens + starter + craft CSS pasted into any project reproduce the style,
// which is what makes the exported prompt usable by small models and the
// exported .css usable without reading the prompt at all.

import { fontStack } from "./fonts.js";
import { onColor } from "./color.js";
import { shadowValues, textureCss } from "./render.js";
import { motifsCss } from "./motifs.js";

const SPACING = { airy: 11, normal: 9, dense: 7 };
const STANDARD_ROLES = new Set(["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border", "dark"]);

export function spacingUnit(g) {
  return SPACING[g.density] || 9;
}

export function customPaletteRoles(g) {
  return Object.entries(g.p).filter(([key]) => !STANDARD_ROLES.has(key));
}

const pad = (s, n) => (s.length >= n ? s + " " : s + " ".repeat(n - s.length));

// `:root { … }` with a one-line comment per token saying where it is used.
export function tokensRootCss(g, selector = ":root") {
  const p = g.p;
  const sh = shadowValues(g);
  const caseVal = g.case === "upper" ? "uppercase" : g.case === "lower" ? "lowercase" : "none";
  const rows = [
    ["/* Palette */"],
    ["--bg", p.bg, "page background"],
    ["--surface", p.surface, "cards, panels, header, inputs"],
    ["--surface2", p.surface2, "secondary surfaces: code blocks, table stripes, hover fills, media placeholders"],
    ["--ink", p.ink, "primary text"],
    ["--muted", p.muted, "secondary text, captions, placeholders, inactive nav"],
    ["--accent", p.accent, "primary buttons, links, active/selected states, key data"],
    ["--accent2", p.accent2, "second data series, status dots, alternate tags"],
    ["--border", p.border, "every border, rule, and divider"],
    ["--on-accent", onColor(p.accent), "text placed on top of --accent"],
    ...customPaletteRoles(g).map(([key, value]) => [`--${key}`, value, `archetype decor color "${key}" (used by the craft CSS)`]),
    ["/* Typography */"],
    ["--f-display", fontStack(g.fonts.display), "headings, brand, big numbers"],
    ["--f-body", fontStack(g.fonts.body), "body text, buttons, inputs"],
    ["--f-mono", fontStack(g.fonts.mono), "code, data labels, kbd"],
    ["--hw", String(g.hw), "heading font-weight"],
    ["--track", `${g.track}em`, "heading letter-spacing"],
    ["--case", caseVal, "heading text-transform"],
    ["/* Shape & depth */"],
    ["--radius", `${g.radius}px`, "panel / card corner radius"],
    ["--r-ctl", g.ctl === 999 ? "999px" : `${g.ctl}px`, "button, chip, tag, input corner radius"],
    ["--bw", `${g.bw}px`, "panel and button border width"],
    ["--shadow", sh.card, "card shadow"],
    ["--shadow-btn", sh.btn, "primary button shadow"],
    ["/* Spacing */"],
    ["--sp", `${spacingUnit(g)}px`, "base spacing unit: pad cards ~2x, gap sections ~2.5x"],
  ];
  const lines = rows.map((row) => {
    if (row.length === 1) return `  ${row[0]}`;
    const [name, value, note] = row;
    return `  ${pad(`${name}: ${value};`, 22)}/* ${note} */`;
  });
  return `${selector} {\n${lines.join("\n")}\n}`;
}

// Baseline components. Class names match the sample contract used by every
// archetype's craft CSS, so the craft rules override these directly.
export function starterCss(g, s = ".style-scope") {
  return `/* Root: add class="style-scope" to <body> (or replace ${s} with body). */
${s} { background: var(--bg); color: var(--ink); font-family: var(--f-body); font-size: 16px; line-height: 1.5; position: relative; min-height: 100vh; margin: 0; -webkit-font-smoothing: antialiased; }
${s} * { box-sizing: border-box; }
/* Texture overlay slot: fixed, non-interactive, filled by the texture rule (if any). */
${s}::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
${textureCss(g, s)}
/* Type */
${s} h1, ${s} h2, ${s} h3, ${s} .display, ${s} .card-t, ${s} .brand, ${s} .stat-num, ${s} .price { font-family: var(--f-display); font-weight: var(--hw); letter-spacing: var(--track); text-transform: var(--case); line-height: 1.1; margin: 0; }
${s} h1, ${s} .display { font-size: clamp(34px, 5.5vw, 56px); line-height: 1.06; max-width: 15ch; }
${s} h2 { font-size: clamp(24px, 3.2vw, 34px); }
${s} h3, ${s} .card-t { font-size: 17px; }
${s} p { margin: 0 0 1em; }
${s} .sub { color: var(--muted); font-size: 1.05em; max-width: 54ch; }
${s} .kicker { font-size: 11.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
${s} .stat-label, ${s} .meta { font-size: 10.5px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
${s} a { color: var(--accent); text-underline-offset: 2px; }
${s} .muted, ${s} small, ${s} .card-p { color: var(--muted); }
${s} code, ${s} pre, ${s} kbd, ${s} .list-no { font-family: var(--f-mono); }
${s} .stat-num { font-size: 33px; }
${s} .stat-delta { font-size: 12px; color: var(--accent); font-weight: 600; }

/* Header & footer */
${s} .topbar { display: flex; align-items: center; gap: calc(var(--sp) * 2.2); padding: calc(var(--sp) * 1.5) calc(var(--sp) * 3); border-bottom: var(--bw) solid var(--border); }
${s} .brand { display: flex; align-items: center; gap: 8px; font-size: 16px; }
${s} .logo { width: 14px; height: 14px; background: var(--accent); border-radius: 3px; display: inline-block; flex-shrink: 0; }
${s} .topnav { display: flex; gap: calc(var(--sp) * 1.8); font-size: 14px; }
${s} .topnav .nl { color: var(--muted); text-decoration: none; }
${s} .topnav .nl.on { color: var(--ink); font-weight: 600; }
${s} .navbtn { margin-left: auto; }
${s} .foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: calc(var(--sp) * 1.4) calc(var(--sp) * 3); border-top: var(--bw) solid var(--border); color: var(--muted); font-size: 12px; }

/* Buttons & focus */
${s} .btn { display: inline-block; padding: 9px 17px; border-radius: var(--r-ctl); font: 600 14px/1.2 var(--f-body); border: var(--bw) solid transparent; cursor: pointer; white-space: nowrap; text-decoration: none; }
${s} .btn-a { background: var(--accent); color: var(--on-accent); box-shadow: var(--shadow-btn); }
${s} .btn-b { background: transparent; color: var(--ink); border-color: var(--border); }
${s} .btn:hover { filter: brightness(1.06); }
${s} .btn:active { filter: brightness(.94); }
${s} .btn[disabled] { opacity: .42; box-shadow: none; cursor: not-allowed; filter: none; }
${s} :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Panels & media */
${s} .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: calc(var(--sp) * 2); }
${s} .card { background: var(--surface); border: var(--bw) solid var(--border); border-radius: var(--radius); padding: calc(var(--sp) * 1.9); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: calc(var(--sp) * 1.1); position: relative; min-width: 0; }
${s} .media-block { min-height: 96px; display: grid; place-items: center; overflow: hidden; background: var(--surface2); border: 1px solid var(--border); border-radius: max(0px, calc(var(--radius) * .7)); color: var(--muted); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
${s} .alert { display: flex; gap: 8px; padding: 9px 11px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); font-size: 13px; }
${s} .alert strong { color: var(--ink); }
${s} .alert.warning { border-color: var(--accent); }

/* Tags, status, tabs, pagination, progress */
${s} .chips { display: flex; gap: 6px; flex-wrap: wrap; }
${s} .chip { display: inline-block; font-size: 11px; padding: 3px 10px; border: 1px solid var(--border); border-radius: var(--r-ctl); color: var(--muted); white-space: nowrap; }
${s} .chip.on { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
${s} .status { display: inline-flex; align-items: center; gap: 5px; color: var(--muted); font-size: 12px; }
${s} .status i { width: 7px; height: 7px; border-radius: 50%; background: var(--accent2); }
${s} .status.ok { color: var(--accent2); }
${s} .status.warn { color: var(--accent); }
${s} .tabs { display: flex; gap: 3px; border-bottom: 1px solid var(--border); }
${s} .tab { padding: 6px 9px; color: var(--muted); border-bottom: 2px solid transparent; }
${s} .tab.on { color: var(--ink); border-color: var(--accent); font-weight: 700; }
${s} .pagination { display: flex; gap: 4px; }
${s} .pagination span { min-width: 28px; padding: 4px 7px; text-align: center; border: 1px solid var(--border); color: var(--muted); border-radius: var(--r-ctl); }
${s} .pagination .on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
${s} .progress-track { height: 7px; overflow: hidden; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-ctl); }
${s} .progress-track span { display: block; height: 100%; background: var(--accent); }

/* Forms */
${s} input, ${s} select, ${s} textarea { font: inherit; color: var(--ink); background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-ctl); padding: 8px 10px; }
${s} ::placeholder { color: var(--muted); }
${s} .form-field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
${s} .field-error input, ${s} input[aria-invalid="true"] { border-color: var(--accent); }
${s} .error-text { color: var(--accent); }
${s} .field { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 7px 12px; background: var(--surface); border: var(--bw) solid var(--border); border-radius: var(--r-ctl); color: var(--muted); }

/* Tables, code, rules */
${s} table, ${s} .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
${s} th { color: var(--muted); font-size: 11px; letter-spacing: .07em; text-transform: uppercase; text-align: left; }
${s} th, ${s} td { padding: 8px 10px; border-top: 1px solid var(--border); }
${s} pre, ${s} .code-block { margin: 0; padding: 10px 12px; border: 1px solid var(--border); background: var(--surface2); color: var(--ink); font: 12.5px/1.45 var(--f-mono); overflow: auto; }
${s} hr { border: 0; border-top: 1px solid var(--border); }

/* Charts */
${s} .chart { width: 100%; height: auto; display: block; }
${s} .spark { width: 100%; height: 34px; display: block; }`;
}

// Meaning of every class the craft CSS may reference. Only the rows whose
// class actually appears in a given craft CSS (plus the core rows) are shown.
export const CLASS_GLOSSARY = [
  [".style-scope", "root element the style applies to (put the class on <body>)", true],
  [".topbar", "site header / navigation bar"],
  [".brand", "brand name in the header"],
  [".logo", "logo mark (small square/circle) beside the brand name"],
  [".topnav", "header navigation link row"],
  [".nl", "a navigation link; `.nl.on` is the current page"],
  [".navbtn", "header call-to-action button"],
  [".hero", "hero / page-title section", true],
  [".kicker", "small label above the headline (eyebrow text)", true],
  [".display", "main headline (h1)", true],
  [".sub", "standfirst / subheading paragraph under the headline"],
  [".actions", "row of buttons"],
  [".btn", "any button", true],
  [".btn-a", "primary button", true],
  [".btn-b", "secondary / outline button", true],
  [".cards", "grid of panels"],
  [".card", "a panel or card (any bounded content surface)", true],
  [".card-t", "panel title (h3)"],
  [".card-p", "panel body text"],
  [".chips", "row of tags"],
  [".chip", "tag / badge / filter pill; `.chip.on` is selected"],
  [".stat", "KPI / metric card"],
  [".stat-label", "small caption above a big number"],
  [".stat-num", "big KPI number"],
  [".stat-delta", "change indicator text (▲ 12%)"],
  [".spark", "sparkline SVG"],
  [".chart", "chart SVG"],
  [".chartcard", "card that contains a chart"],
  [".smain", "main content area between header and footer"],
  [".foot", "site footer"],
  [".media-block", "image / media placeholder"],
  [".meta", "small metadata line (date, category, read time)"],
  [".field", "search or filter input box"],
  [".form-field", "form label + input pair"],
  [".input-group", "input with a fixed prefix"],
  [".choice", "radio / choice pill; `.checked` is selected"],
  [".alert", "callout / notice; `.success`, `.warning` variants"],
  [".data-table", "data table"],
  [".data-panel", "card wrapping a table"],
  [".panel-head", "card header row with title and controls"],
  [".list-row", "row in a numbered list"],
  [".list-no", "row number in a list"],
  [".pullquote", "pull quote"],
  [".nav-tree", "sidebar navigation list"],
  [".code-block", "code sample"],
  [".tabs", "tab strip; `.tab.on` is active"],
  [".tab", "a tab"],
  [".status", "status pill with a dot; `.ok`, `.warn` variants"],
  [".progress-track", "progress bar track (inner span is the fill)"],
  [".pagination", "pagination control; `.on` is the current page"],
  [".stepper", "step indicator for multi-step forms"],
  [".avatar", "user avatar circle"],
  [".person", "avatar + name block"],
  [".calendar", "calendar grid; `.on` is the selected day"],
  [".slot-list", "grid of time-slot chips"],
  [".product-card", "product tile"],
  [".product-media", "product image area"],
  [".price", "price"],
  [".composer", "post composer"],
  [".feed-card", "feed post"],
  [".reaction-row", "like / comment / share row"],
];

export function glossaryFor(craftCss) {
  return CLASS_GLOSSARY.filter(([cls, , core]) => core || craftCss.includes(cls));
}

// Complete standalone stylesheet: tokens + starter + craft.
export function fullStylesheet(g, archetype, id) {
  const motif = motifsCss(g, ".style-scope").trim();
  const craft = archetype.css(".style-scope", g).trim() + (motif ? `\n\n/* ---- Component motifs (free slots) ---- */\n${motif}` : "");
  return `/* Style Genome — "${archetype.name}" (${id})
   Generated stylesheet: design tokens + starter components + archetype craft CSS.
   Usage: add class="style-scope" to <body>, link this file, and use the class
   names from the prompt's glossary (.btn-a, .btn-b, .card, .chip, .kicker, …).
   Style Genome: https://style-genome.com/ */

${tokensRootCss(g)}

${starterCss(g)}

/* ---- Archetype craft: ${archetype.name} ---- */
${craft}
`;
}
