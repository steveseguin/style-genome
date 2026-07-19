// Web-utility family: the deadpan, purely functional corners of the internet —
// documentation sites, government paper forms, spreadsheets, and the raw
// unstyled default-browser page. Utilitarian on purpose; never decorated.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const webUtil = [

  // ------------------------------------------------------------------- docs
  {
    id: "docs",
    name: "Docs Site",
    family: "web",
    traits: ["technical", "minimal", "familiar"],
    blurb:
      "A modern documentation site: crisp white pages, humanist sans body, and a single classic link-blue that carries every interactive cue. Breadcrumb kickers, a tinted info callout, inline code tokens, and an underlined current page — calm, legible, and instantly familiar to anyone who reads software docs.",
    notes: [
      "The kicker is styled as a lowercase, muted breadcrumb trail with a leading 'docs /' segment.",
      "The first card is an information callout: a full light-blue tinted background with a plain neutral border and an accent info glyph — no colored edge stripe.",
      "Chips render as inline code tokens: monospaced, on a neutral surface fill, tiny 4px radius, no border.",
      "The active nav link carries an accent underline; buttons stay modest with a 6px control radius.",
    ],
    conform(g, r) {
      const accent = hslToHex(irange(r, 214, 226), 80, 53);
      g.p = pal({
        bg: "#ffffff", ink: "#1f2937", accent,
        surface: "#ffffff", surface2: "#ecedf2", border: "#e3e7ee",
        muted: "#5b6472", dark: false,
      });
      g.fonts = { display: pick(r, ["humanist", "grotesk"]), body: "humanist", mono: "mono" };
      g.radius = 8; g.ctl = 6; g.bw = 1;
      g.shadow = among(r, g.shadow, ["none", "lifted"]); g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = -0.01;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .kicker { text-transform: lowercase; letter-spacing: 0; color: var(--muted); font-weight: 500; font-size: 12px; }
${s} .kicker::before { content: "docs / "; color: var(--muted); }
${s} .display { font-size: 40px; letter-spacing: -0.02em; }
${s} .card:first-child { background: ${mix(g.p.accent, "#ffffff", 0.9)}; border-color: var(--border); }
${s} .card:first-child .card-t::before { content: "ⓘ  "; color: var(--accent); font-weight: 700; }
${s} .chip {
  font-family: var(--f-mono); background: var(--surface2); border: none;
  border-radius: 4px; color: var(--ink); font-size: 12px; padding: 2px 7px;
}
${s} .topnav .nl.on {
  color: var(--ink); text-decoration: underline; text-underline-offset: 5px;
  text-decoration-thickness: 2px; text-decoration-color: var(--accent);
}
${s} .btn-a { box-shadow: none; }
${s} .stat-delta { color: var(--accent); }
${s} .logo { border-radius: 3px; }
`;
    },
  },

  // ---------------------------------------------------------------- govform
  {
    id: "govform",
    name: "Bureaucracy",
    family: "web",
    traits: ["print", "dense", "gray"],
    blurb:
      "A government paper form rendered on screen: manila stock, jet-black ink, and hard 2px boxed fields with perfectly square corners. Tiny bold uppercase wide-tracked labels sit above every field, the header carries a monospaced form code, chips are checkboxes, and a single official red appears only as a rotated rubber-stamp figure. Dry, dense, and procedurally serious.",
    notes: [
      "Cards are boxed form fields: 2px solid black borders, square corners, white fill, and a titled label rule across the top.",
      "Labels everywhere (card titles, stat labels, kicker) are tiny, bold, uppercase, and wide-tracked; the kicker is replaced with a monospaced 'FORM SG-101 · REV 07/26' code.",
      "Chips are checkbox line items — a ballot-box glyph precedes each, no border; buttons are flat gray rectangles with a 2px ink border.",
      "The stat delta is an official red rubber stamp: uppercase, bold, letter-spaced, and slightly rotated — accent used only as text. Bar chart is black cross-hatch.",
    ],
    conform(g, r) {
      const paper = pick(r, ["#f4efe1", "#f6f2e6", "#faf7ef"]);
      const red = pick(r, ["#b3261e", "#a5170f", "#9c2115"]);
      g.p = pal({
        bg: paper, ink: "#0d0d0d", accent: red, accent2: "#4a4a4a",
        surface: "#ffffff", surface2: "#ebe7db", border: "#0d0d0d",
        muted: "#33322d", dark: false,
      });
      g.fonts = { display: "transitional", body: "transitional", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "dense";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars-hatch";
    },
    css(s, g) {
      return `
${s} .display { text-transform: uppercase; letter-spacing: 0.01em; font-size: 34px; line-height: 1.05; }
${s} .kicker { font-size: 0; }
${s} .kicker::before {
  content: "FORM SG-101 · REV 07/26"; font-family: var(--f-mono);
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; color: var(--ink); text-transform: none;
}
${s} .card { background: #ffffff; border: 2px solid var(--ink); border-radius: 0; box-shadow: none; }
${s} .card-t, ${s} .stat-label {
  text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; font-size: 10.5px;
}
${s} .card-t { border-bottom: 1px solid var(--ink); padding-bottom: 5px; }
${s} .chip {
  font-family: var(--f-mono); border: none; border-radius: 0; background: transparent;
  color: var(--ink); font-size: 12px; padding: 2px 8px 2px 0;
}
${s} .chip::before { content: "☐ "; }
${s} .btn {
  background: #e6e6e6; color: var(--ink); border: 2px solid var(--ink);
  border-radius: 0; box-shadow: none; font-weight: 700;
}
${s} .btn-a { background: #d6d6d6; }
${s} .stat-delta {
  color: var(--accent); text-transform: uppercase; font-weight: 700; letter-spacing: 0.14em;
  font-size: 12px; display: inline-block; transform: rotate(-4deg); transform-origin: left center;
}
${s} .chart { --accent: var(--ink); }
${s} .logo { border-radius: 0; background: var(--ink); }
`;
    },
  },

  // ------------------------------------------------------------- spreadsheet
  {
    id: "spreadsheet",
    name: "Spreadsheet",
    family: "web",
    traits: ["technical", "dense", "grid"],
    blurb:
      "A desktop spreadsheet application: white cells over a faint ruled grid, one Excel-green accent, and monospaced numerals. Panels read as named cell ranges with gray hairline borders and shaded column-header rows, chips are cell references, and the top bar apes a formula bar. Cool, gridded, and all business.",
    notes: [
      "A faint full-bleed grid texture underlies everything; every panel has square corners and 1px gray cell borders with no shadow.",
      "Card titles are shaded column-header rows: a surface fill spanning the full width with a bottom border and small bold text.",
      "Numerals use the monospaced face; chips are boxed cell references ('A1' style) with 1px borders and zero radius; the kicker is a monospaced 'SHEET1!B4:F12' range.",
      "The top bar reads as a formula bar with a monospaced brand and a single hairline; bars are Excel-green.",
    ],
    conform(g, r) {
      const green = pick(r, ["#217346", "#1e7145", "#137a43"]);
      g.p = pal({
        bg: "#ffffff", ink: "#1f2933", accent: green, accent2: "#3aa06b",
        surface: "#ffffff", surface2: "#eef1f4", border: "#d0d7de",
        muted: "#5b6570", dark: false,
      });
      g.fonts = { display: "grotesk", body: "humanist", mono: "mono" };
      g.radius = 0; g.ctl = 4; g.bw = 1;
      g.shadow = "none"; g.texture = "grid";
      g.density = "dense";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom: 1px solid var(--border); }
${s} .brand { font-family: var(--f-mono); font-weight: 600; letter-spacing: 0; }
${s} .kicker { font-size: 0; }
${s} .kicker::before {
  content: "SHEET1!B4:F12"; font-family: var(--f-mono); font-size: 11px;
  font-weight: 600; letter-spacing: 0; color: var(--muted); text-transform: none;
}
${s} .card { border-radius: 0; box-shadow: none; overflow: hidden; }
${s} .card-t {
  background: var(--surface2); border-bottom: 1px solid var(--border);
  margin: calc(var(--sp) * -1.9) calc(var(--sp) * -1.9) calc(var(--sp) * 0.4);
  padding: 5px calc(var(--sp) * 1.9); font-size: 11px; font-weight: 700;
  letter-spacing: 0.01em; text-transform: none;
}
${s} .stat-num { font-family: var(--f-mono); font-size: 30px; letter-spacing: 0; }
${s} .chip {
  font-family: var(--f-mono); border: 1px solid var(--border); border-radius: 0;
  background: #ffffff; color: var(--ink); font-size: 11px; padding: 1px 6px;
}
${s} .btn { padding: 6px 12px; font-size: 12.5px; }
${s} .logo { border-radius: 0; }
`;
    },
  },

  // --------------------------------------------------------------- barebones
  {
    id: "barebones",
    name: "Barebones HTML",
    family: "web",
    traits: ["minimal", "raw", "familiar"],
    blurb:
      "The unstyled default-browser page, played completely straight: Times New Roman throughout at default weights, black text on white, classic #0000EE link blue with underlines, and visited-purple for the current link. Buttons are stock gray form controls; sections are divided by plain horizontal rules. The entire gag is the total, deliberate absence of design.",
    notes: [
      "Everything is Times New Roman at browser-default sizes and weights; the logo is dropped and the brand is plain bold serif.",
      "Nav links are underlined #0000EE blue, with the current link in visited-purple; the kicker and labels are reset to ordinary black body text.",
      "Cards have no box at all — transparent, borderless, separated only by a top 1px gray groove rule like a default <hr>.",
      "Buttons are default form controls (#efefef fill, 1px #767676 border, 2px radius, black text) — the primary button gets no accent fill; chips are bracketed blue text links.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#ffffff", ink: "#000000", accent: "#0000EE", accent2: "#551A8B",
        surface: "#ffffff", surface2: "#efefef", border: "#808080",
        muted: "#000000", dark: false,
      });
      g.fonts = { display: "transitional", body: "transitional", mono: "mono" };
      g.radius = 0; g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const times = `"Times New Roman", Times, serif`;
      return `
${s} { font-family: ${times}; }
${s} .topbar { border-bottom: none; }
${s} .brand { font-family: ${times}; font-weight: 700; letter-spacing: 0; text-transform: none; }
${s} .logo { display: none; }
${s} .topnav .nl { color: #0000EE; text-decoration: underline; font-weight: 400; }
${s} .topnav .nl.on { color: #551A8B; font-weight: 400; }
${s} .kicker { text-transform: none; letter-spacing: 0; color: #000000; font-weight: 400; font-size: 15px; }
${s} .display {
  font-family: ${times}; font-size: 32px; font-weight: 700;
  letter-spacing: 0; text-transform: none; line-height: 1.1; max-width: none;
}
${s} .card-t { font-family: ${times}; font-weight: 700; font-size: 19px; letter-spacing: 0; text-transform: none; }
${s} .card {
  background: transparent; border: none; border-top: 1px solid #808080;
  border-radius: 0; box-shadow: none; padding: 10px 0 0;
}
${s} .stat-label { text-transform: none; letter-spacing: 0; color: #000000; font-weight: 400; font-size: 15px; }
${s} .stat-num { font-family: ${times}; font-weight: 700; font-size: 26px; letter-spacing: 0; }
${s} .stat-delta { color: #000000; font-weight: 400; }
${s} .chip {
  background: none; border: none; border-radius: 0; color: #0000EE;
  text-decoration: underline; padding: 0 6px 0 0; font-size: 15px;
}
${s} .chip::before { content: "["; }
${s} .chip::after { content: "]"; }
${s} .btn {
  background: #efefef; color: #000000; border: 1px solid #767676;
  border-radius: 2px; box-shadow: none; font-weight: 400; padding: 3px 10px;
}
${s} .btn-a { background: #efefef; color: #000000; border: 1px solid #767676; box-shadow: none; }
`;
    },
  },
];
