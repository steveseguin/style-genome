// Signage & documents: vernacular visual systems people read every day
// without noticing them — transit wayfinding, departure boards, receipts,
// broadsides, technical manuals, and raw concrete. Each one is defined by a
// production constraint (one ink, one material, one grid) rather than a
// decorative motif.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const signage = [

  // ------------------------------------------------------------ wayfinding
  {
    id: "wayfinding",
    name: "Transit Wayfinding",
    family: "modernist",
    traits: ["bold", "flat", "grid", "highcontrast"],
    blurb:
      "Subway and airport signage: a heavy neo-grotesque on solid black and white sign panels, color-coded route discs carrying a single bold letter, one big directional arrow, and rounded-square pictogram blocks. Vignelli-grade clarity — nothing decorative, everything legible from thirty metres away.",
    notes: [
      "The header is a solid black sign bar with white text; the logo is a route disc — a colored circle with a bold white letter inside it.",
      "The headline is huge, tight, and heavy; the kicker is bold sentence-case text led by a thick → arrow in the accent color.",
      "Cards are flat sign panels with no shadow and 4px corners: the first is a solid accent fill with counter-colored text, the second is solid black with white text, the rest are light gray.",
      "Chips are rounded-square badges with a 2px ink outline and bold uppercase letters; the primary button is a solid accent block with 4px corners.",
    ],
    conform(g, r) {
      const lines = ["#ee352e", "#0039a6", "#00933c", "#ff6319", "#b933ad", "#fccc0a", "#6cbe45", "#a7a9ac"];
      const accent = pick(r, lines.slice(0, 6));
      let accent2 = pick(r, lines);
      if (accent2 === accent) accent2 = "#a7a9ac";
      g.p = pal({
        bg: pick(r, ["#ffffff", "#f4f4f2"]), ink: "#111111", accent, accent2,
        surface: "#ffffff", surface2: "#e9e9e6", border: "#111111", muted: "#4a4a4a", dark: false,
      });
      g.fonts = { display: "grotesk", body: "grotesk", mono: "mono" };
      g.radius = 4; g.ctl = 4; g.bw = 0;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "none"; g.hw = 800; g.track = -0.03;
      g.chart = "bars"; g.chartGrid = "baseline";
    },
    css(s, g) {
      const on = onColor(g.p.accent);
      return `
${s} .topbar { background: #111; color: #fff; border-bottom: none; }
${s} .brand { color: #fff; gap: 10px; }
${s} .logo { width: 22px; height: 22px; border-radius: 50%; background: var(--accent); position: relative; }
${s} .logo::after { content: "A"; position: absolute; inset: 0; display: grid; place-items: center; font: 800 12px/1 var(--f-display); color: ${on}; }
${s} .topnav .nl { color: #bdbdbd; }
${s} .topnav .nl.on { color: #fff; }
${s} .topbar .btn-b { border: 2px solid #fff; color: #fff; }
${s} .kicker { color: var(--ink); font-size: 13px; letter-spacing: 0; text-transform: none; font-weight: 800; }
${s} .kicker::before { content: "→ "; color: var(--accent-text); font-size: 18px; line-height: 0; }
${s} .display { font-size: 58px; letter-spacing: -0.04em; line-height: .96; }
${s} .sub { color: var(--ink); font-weight: 500; }
${s} .card { border: none; background: var(--surface2); border-radius: 4px; }
${s} .card:nth-child(1) { background: var(--accent); color: ${on}; --ink: ${on}; --muted: ${on}; --accent-text: ${on}; --accent2-text: ${on}; }
${s} .card:nth-child(1) .card-t, ${s} .card:nth-child(1) .card-p, ${s} .card:nth-child(1) .stat-label, ${s} .card:nth-child(1) .stat-num, ${s} .card:nth-child(1) .stat-delta, ${s} .card:nth-child(1) .meta { color: ${on}; }
${s} .card:nth-child(1) .chip { border-color: ${on}; color: ${on}; }
${s} .card:nth-child(2) { background: #111; color: #fff; --ink: #ffffff; --muted: #d6d6d6; --accent-text: #ffffff; --accent2-text: #ffffff; }
${s} .card:nth-child(2) .card-t, ${s} .card:nth-child(2) .stat-label, ${s} .card:nth-child(2) .stat-num, ${s} .card:nth-child(2) .card-p, ${s} .card:nth-child(2) .meta { color: #fff; }
${s} .card:nth-child(2) .stat-delta { color: var(--accent2-text); }
${s} .card:nth-child(2) .chip { border-color: #fff; color: #fff; }
${s} .chip { border: 2px solid var(--ink); border-radius: 6px; font-weight: 800; color: var(--ink); text-transform: uppercase; font-size: 10px; letter-spacing: .04em; }
${s} .btn { border-radius: 4px; font-weight: 800; }
${s} .btn-b { border: 2px solid var(--ink); }
${s} .foot { background: #111; color: #cfcfcf; border-top: none; }
${s} .stat-num { letter-spacing: -0.03em; }
`;
    },
  },

  // ------------------------------------------------------------- splitflap
  {
    id: "splitflap",
    name: "Split-Flap Board",
    family: "retro",
    traits: ["dark", "retro", "mono2", "technical"],
    blurb:
      "An airport departures board: matte black, headline letters sitting on charcoal flap tiles split by a hairline seam, amber (or warm white) text in a condensed grotesque with wide tracking, row-striped tables of departures, and a green ON TIME status dot. Mechanical, clacking, strictly grid-aligned.",
    notes: [
      "The headline is rendered as flap tiles: an inline charcoal background with a 1px horizontal seam through each line (a repeating gradient behind the text) and wide .18em tracking so every character reads as its own tile.",
      "Cards are charcoal panels with a 1px lighter seam border and 2px corners; table rows alternate dark stripes like a departures list.",
      "Type is a condensed grotesque in uppercase; the single accent (amber or warm white) is used for the kicker, the stat number, the logo tile, and the primary button.",
      "Chips are miniature flap tiles in mono with a seam through the middle; the status/delta text is green and prefixed by a ● dot.",
    ],
    conform(g, r) {
      const accent = pick(r, ["#f2b32c", "#f5f1e6", "#ffc247"]);
      g.p = pal({
        bg: "#0e0e10", ink: "#e8e6df", accent, accent2: "#3ccf6a",
        surface: "#1a1a1e", surface2: "#232328", border: "#33333a", muted: "#9a9891", dark: true,
      });
      g.fonts = { display: "industrial", body: "grotesk", mono: "mono" };
      g.radius = 2; g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = among(r, g.texture, ["none", "lines"]);
      g.density = "dense";
      g.case = "upper"; g.hw = 700; g.track = 0.12;
      g.chart = "bars"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .display {
  font-size: 40px; letter-spacing: .18em; line-height: 1.25; padding: 2px 8px; display: inline-block;
  background: repeating-linear-gradient(0deg, var(--surface) 0 24px, var(--bg) 24px 26px, var(--surface) 26px 50px);
  color: var(--ink); -webkit-box-decoration-break: clone; box-decoration-break: clone;
}
${s} .kicker { color: var(--accent-text); font-family: var(--f-mono); letter-spacing: .2em; }
${s} .card { border-color: var(--border); background: var(--surface); }
${s} .card-t { letter-spacing: .12em; font-size: 12px; color: var(--muted); }
${s} .chip {
  border-radius: 2px; border-color: var(--border); font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px; color: var(--ink);
  background: linear-gradient(var(--surface2) 47%, var(--bg) 47% 53%, var(--surface2) 53%);
}
${s} .btn { border-radius: 2px; text-transform: uppercase; letter-spacing: .12em; font-family: var(--f-display); font-size: 12px; }
${s} .btn-a { background: var(--accent); color: #111; }
${s} .btn-b { border-color: var(--border); }
${s} .stat-num { color: var(--accent-text); font-family: var(--f-mono); letter-spacing: .1em; }
${s} .stat-delta { color: var(--accent2-text); }
${s} .stat-delta::before { content: "● "; }
${s} .logo { border-radius: 2px; background: var(--accent); height: 10px; width: 18px; }
${s} .topbar { background: var(--surface); border-bottom-color: var(--border); }
${s} .topnav .nl { text-transform: uppercase; letter-spacing: .1em; font-size: 11px; font-family: var(--f-display); }
${s} .foot { font-family: var(--f-mono); text-transform: uppercase; letter-spacing: .1em; font-size: 10px; border-top-color: var(--border); }
${s} .data-table tbody tr:nth-child(odd) td { background: var(--surface2); }
${s} .status.ok { color: var(--accent2-text); }
`;
    },
  },

  // --------------------------------------------------------------- receipt
  {
    id: "receipt",
    name: "Thermal Receipt",
    family: "craft",
    traits: ["print", "mono2", "raw", "dense"],
    blurb:
      "A thermal-printer receipt: slightly gray-white paper, every line in a dot-matrix monospace, asterisk and dash separators typed as text, right-aligned totals, a barcode band near the bottom, and a single faded stamp color for the total and the primary button. Faded, mono, and charmingly bureaucratic.",
    notes: [
      "Everything — including the headline — is monospaced; the headline is uppercase with a typed row of ===== beneath it and the kicker is wrapped in *** asterisks ***.",
      "Separators are typed rules (dashed 1px lines or '. . . .' dot leaders after titles), never solid CSS borders; cards are borderless paper regions divided by dashed rules with square corners and no shadow.",
      "A faint paper grain covers the page; the only color is one faded stamp ink (blue or red) used for the stat number and the primary button.",
      "Chips read like line items in [ BRACKETS ]; the footer is a barcode band (repeating vertical black lines) with a THANK YOU line beneath it.",
    ],
    conform(g, r) {
      const stamp = pick(r, ["#3f5fa8", "#b83a3a", "#2e7d5b"]);
      g.p = pal({
        bg: "#f2f1ec", ink: "#2b2b2b", accent: stamp, accent2: "#6f6f6f",
        surface: "#f2f1ec", surface2: "#e7e6df", border: "#b9b7ae", muted: "#6b6b66", dark: false,
      });
      g.fonts = { display: "mono", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "grain";
      g.density = "dense";
      g.case = "upper"; g.hw = 700; g.track = 0.02;
      g.chart = among(r, g.chart, ["bars-outline", "dots"]); g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom: 1px dashed var(--border); }
${s} .display { font-size: 28px; letter-spacing: .06em; line-height: 1.15; max-width: 24ch; }
${s} .display::after { content: "=============================="; display: block; font-size: 13px; letter-spacing: 0; color: var(--muted); overflow: hidden; white-space: nowrap; font-weight: 400; }
${s} .kicker { color: var(--muted); letter-spacing: .08em; }
${s} .kicker::before { content: "*** "; }
${s} .kicker::after { content: " ***"; }
${s} .sub { font-size: 12.5px; }
${s} .card { border: none; border-top: 1px dashed var(--border); border-bottom: 1px dashed var(--border); background: transparent; border-radius: 0; box-shadow: none; }
${s} .card-t { text-transform: uppercase; font-size: 12px; letter-spacing: .06em; }
${s} .card-t::after { content: " . . . . . . . . . ."; color: var(--muted); font-weight: 400; }
${s} .chip { border: none; border-radius: 0; text-transform: uppercase; padding: 0 4px; color: var(--ink); }
${s} .chip::before { content: "[ "; color: var(--muted); }
${s} .chip::after { content: " ]"; color: var(--muted); }
${s} .btn { border-radius: 0; text-transform: uppercase; letter-spacing: .08em; font-size: 11.5px; }
${s} .btn-a { background: var(--accent); color: #fff; box-shadow: none; }
${s} .btn-b { border: 1px solid var(--ink); }
${s} .stat-num { color: var(--accent-text); }
${s} .stat-delta { color: var(--ink); }
${s} .foot { border-top: none; flex-direction: column; align-items: center; gap: 6px; padding-top: 4px; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; }
${s} .foot::before {
  content: ""; width: 210px; height: 24px;
  background: repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 4px, var(--ink) 4px 5px, transparent 5px 8px, var(--ink) 8px 11px, transparent 11px 13px);
}
${s} .logo { border-radius: 0; background: var(--ink); width: 9px; height: 14px; }
${s} .data-table th, ${s} .data-table td { border-top: 1px dashed var(--border); }
${s} .alert, ${s} .code-block, ${s} .field, ${s} .form-field input { border-style: dashed; }
`;
    },
  },

  // -------------------------------------------------------------- woodtype
  {
    id: "woodtype",
    name: "Wood Type Broadside",
    family: "print",
    traits: ["print", "bold", "historic", "vivid"],
    blurb:
      "A nineteenth-century letterpress broadside set in wood type: cream stock, stacked centered lines of fat slab capitals at wildly different sizes, ornamental double rules between them, a pointing fist ☞ before the standfirst, and exactly one spot ink (red or blue) reserved for the loudest line. Circus, wanted poster, county fair.",
    notes: [
      "Everything is centered and stacked: the headline is enormous heavy slab caps with slightly open tracking; the kicker is a spaced-out uppercase line sandwiched between 3px double rules.",
      "Cards are framed by a 3px ink border with an inset 1px inner rule (a printer's double frame) and square corners; the whole page carries a paper texture.",
      "Exactly one spot color is used: the primary button, the stat number, and the logo diamond; everything else is black ink on cream.",
      "Chips are tiny uppercase slab labels wrapped in [ brackets ]; the footer is an ornamental double rule with a centered, spaced uppercase legend.",
    ],
    conform(g, r) {
      const spot = pick(r, ["#b3271e", "#1d4f9c", "#0f6a3e"]);
      g.p = pal({
        bg: "#f3e9d2", ink: "#1d1a16", accent: spot, accent2: "#6b5f4a",
        surface: "#f3e9d2", surface2: "#e9dcbd", border: "#1d1a16", muted: "#5a5040", dark: false,
      });
      g.fonts = { display: pick(r, ["slab", "black"]), body: "transitional", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 3;
      g.shadow = "none"; g.texture = "paper";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = 0.04;
      g.chart = "bars-hatch"; g.chartTreatment = "hatch";
    },
    css(s, g) {
      return `
${s} .hero { align-items: center; text-align: center; }
${s} .hero-row { align-items: flex-end; text-align: left; }
${s} .display { font-size: 50px; line-height: .95; max-width: 20ch; letter-spacing: .02em; }
${s} .kicker { color: var(--ink); letter-spacing: .32em; font-size: 11px; border-top: 3px double var(--ink); border-bottom: 3px double var(--ink); padding: 5px 16px; }
${s} .sub { text-align: center; font-style: italic; color: var(--ink); }
${s} .hero-row .sub { text-align: left; }
${s} .sub::before { content: "☞ "; font-style: normal; }
${s} .actions { justify-content: center; }
${s} .hero-row .actions { justify-content: flex-start; }
${s} .card { border: 3px solid var(--ink); outline: 1px solid var(--ink); outline-offset: -7px; padding: calc(var(--sp) * 2.2); }
${s} .card-t { text-align: center; letter-spacing: .08em; }
${s} .chip { border: none; border-radius: 0; font-family: var(--f-display); text-transform: uppercase; letter-spacing: .1em; font-size: 9.5px; color: var(--ink); padding: 3px 2px; }
${s} .chip::before { content: "[ "; }
${s} .chip::after { content: " ]"; }
${s} .btn { border-radius: 0; text-transform: uppercase; letter-spacing: .12em; font-family: var(--f-display); font-weight: 900; font-size: 12px; }
${s} .btn-b { border: 2px solid var(--ink); }
${s} .stat-num { color: var(--accent-text); font-size: 40px; }
${s} .stat-delta { color: var(--ink); }
${s} .topbar { border-bottom: 3px double var(--ink); }
${s} .foot { border-top: 3px double var(--ink); justify-content: center; gap: 24px; text-transform: uppercase; letter-spacing: .12em; font-size: 10px; color: var(--ink); }
${s} .logo { border-radius: 0; background: var(--accent); transform: rotate(45deg); width: 10px; height: 10px; }
`;
    },
  },

  // ----------------------------------------------------------- fieldmanual
  {
    id: "fieldmanual",
    name: "Field Manual",
    family: "web",
    traits: ["technical", "dense", "print"],
    blurb:
      "A military technical manual: khaki or drab stock, stencil-cut uppercase headings with wide tracking, numbered paragraphs (4-1, 4-2), dashed cut-here rules, a FIG. 1 caption under every chart, and a WARNING box in a heavy black frame. Utilitarian, typewritten where it counts, printed in one black ink.",
    notes: [
      "Headings are stencil-style: a heavy condensed sans in uppercase with .08em tracking; every card title is prefixed by a section number like 4-2 in typewriter face.",
      "Rules and card frames are 2px black, one card per row is dashed; corners are square and nothing casts a shadow; the page carries a paper texture.",
      "The kicker reads like a document header ('FM 21-76 · …') in typewriter face; chips are stamped uppercase typewriter boxes with 1.5px borders.",
      "Charts carry a 'FIG. 1' caption; the primary button is a solid black block with khaki text; the only second color is a rust red for warnings and deltas.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#c9c2a3", "#d6cfa8", "#bdb893"]);
      g.p = pal({
        bg, ink: "#1c1c18", accent: "#3f4a2c", accent2: "#8b3a2a",
        surface: mix(bg, "#ffffff", 0.22), surface2: mix(bg, "#1c1c18", 0.07), border: "#1c1c18", muted: "#45453a", dark: false,
      });
      g.fonts = { display: "industrial", body: "typewriter", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "paper";
      g.density = "dense";
      g.case = "upper"; g.hw = 800; g.track = 0.08;
      g.chart = "bars-outline"; g.chartTreatment = "hatch"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .kicker { font-family: var(--f-mono); color: var(--ink); letter-spacing: .12em; }
${s} .kicker::before { content: "FM 21-76 · "; }
${s} .display { font-size: 38px; letter-spacing: .08em; line-height: 1.05; }
${s} .display::after { content: ""; display: block; width: 88px; height: 3px; background: var(--ink); margin-top: 10px; }
${s} .cards { counter-reset: fm; }
${s} .card { border: 2px solid var(--ink); background: var(--surface); counter-increment: fm; }
${s} .card:nth-child(3) { border-style: dashed; }
${s} .card-t::before { content: "4-" counter(fm) "  "; font-family: var(--f-mono); color: var(--muted); font-weight: 400; }
${s} .chartcard::after { content: "FIG. 1 — OUTPUT BY QUARTER"; font: 9px var(--f-mono); letter-spacing: .1em; color: var(--muted); }
${s} .chip { border: 1.5px solid var(--ink); border-radius: 0; font-family: var(--f-mono); text-transform: uppercase; color: var(--ink); font-size: 9.5px; letter-spacing: .06em; }
${s} .btn { border-radius: 0; text-transform: uppercase; letter-spacing: .1em; font-family: var(--f-mono); font-size: 11px; }
${s} .btn-a { background: var(--ink); color: var(--bg); box-shadow: none; }
${s} .btn-b { border: 2px solid var(--ink); }
${s} .stat-num { font-family: var(--f-mono); }
${s} .stat-delta { color: var(--accent2-text); }
${s} .topbar { border-bottom: 2px solid var(--ink); }
${s} .foot { border-top: 2px dashed var(--ink); font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px; letter-spacing: .08em; color: var(--ink); }
${s} .logo { border-radius: 0; background: var(--ink); }
${s} .alert { border: 2px solid var(--ink); background: var(--surface); text-transform: uppercase; font-family: var(--f-mono); font-size: 9.5px; }
${s} .alert strong::before { content: "⚠ "; }
${s} .status i { border-radius: 0; }
`;
    },
  },

  // ------------------------------------------------------------- betonbrut
  {
    id: "betonbrut",
    name: "Béton Brut",
    family: "bold",
    traits: ["raw", "gray", "bold", "highcontrast"],
    blurb:
      "Brutalist concrete architecture: poured-concrete gray with a faint vertical board-form grain and rows of small form-tie dots, monolithic slab panels with no border and no radius, ultra-heavy uppercase grotesque type, and one safety color (orange or rust) used as sparingly as a painted stair rail. Massive, honest, unpainted.",
    notes: [
      "Panels are concrete slabs: a fill slightly lighter than the page, no border, square corners, a 1px inset form line, and a row of four form-tie dots in the top-right corner drawn with a radial-gradient.",
      "The background shows vertical board-form grain (alternating 1px light/dark lines every 35px) under a photographic grain texture.",
      "Headlines are ultra-heavy uppercase grotesque with -0.04em tracking; the kicker is a stencil-like uppercase mono with .2em tracking.",
      "The single accent appears only on the primary button, the stat delta, and the logo slab; every other surface is a gray, and the header/footer are darker concrete bands.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#a3a29d", "#adaca6", "#9c9b96"]);
      g.p = pal({
        bg, ink: "#161616", accent: pick(r, ["#e0521b", "#b5421f", "#d8a21a"]), accent2: "#3d3d3b",
        surface: mix(bg, "#ffffff", 0.14), surface2: mix(bg, "#000000", 0.09), border: mix(bg, "#000000", 0.22), muted: "#333331", dark: false,
      });
      g.fonts = { display: pick(r, ["black", "grotesk"]), body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 0;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = -0.03;
      g.chart = "bars"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 34px, rgba(255,255,255,.06) 34px 35px, transparent 35px 70px); background-color: var(--bg); }
${s} .card { border: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.09); }
${s} .card::after { content: ""; position: absolute; top: 8px; right: 10px; width: 40px; height: 6px; background: radial-gradient(circle, rgba(0,0,0,.38) 0 1.8px, transparent 2.3px) 0 0 / 10px 6px repeat-x; pointer-events: none; }
${s} .display { font-size: 56px; line-height: .92; letter-spacing: -0.04em; }
${s} .kicker { font-family: var(--f-mono); color: var(--ink); letter-spacing: .2em; }
${s} .sub { color: var(--ink); opacity: .8; }
${s} .btn { border-radius: 0; text-transform: uppercase; letter-spacing: .06em; font-weight: 800; }
${s} .btn-a { background: var(--accent); color: ${onColor(g.p.accent)}; }
${s} .btn-b { border: 2px solid var(--ink); }
${s} .chip { border: none; background: var(--surface2); color: var(--ink); border-radius: 0; text-transform: uppercase; font-size: 10px; font-weight: 700; }
${s} .logo { border-radius: 0; background: var(--accent); width: 18px; height: 10px; }
${s} .topbar { border-bottom: none; background: var(--surface2); }
${s} .foot { border-top: none; background: var(--surface2); color: var(--ink); }
${s} .stat-delta { color: var(--accent-text); }
${s} .stat-num { letter-spacing: -0.03em; }
${s} .media-block, ${s} .code-block, ${s} .alert { border: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.09); }
`;
    },
  },
];
