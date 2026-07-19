// Modernist family: reduction, grids, typography-first.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const modernist = [

  // ------------------------------------------------------------------ swiss
  {
    id: "swiss",
    name: "Swiss Modern",
    family: "modernist",
    traits: ["minimal", "flat", "grid"],
    blurb:
      "Swiss/International Typographic Style: an objective grid, generous whitespace, hairline rules, and one disciplined accent color. No decoration that isn't structure — hierarchy comes entirely from type size, weight, and placement.",
    notes: [
      "Cards are not boxes: content sits on the page grid, separated only by 1px hairline rules above each section (in the neutral border color).",
      "Oversized numbered indices (01, 02…) in the muted color label each section.",
      "Buttons are sharp rectangles; the primary button is a solid accent block.",
      "Never use gradients, shadows, or rounded corners.",
    ],
    conform(g, r) {
      g.p = basePalette(r, "paper", pick(r, [4, 8, 214, 358]), false);
      g.p.accent2 = mix(g.p.ink, g.p.bg, 0.25);
      g.fonts = { display: "grotesk", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["airy", "normal"]);
      g.case = "none"; g.hw = pick(r, [700, 800]); g.track = -0.025;
      g.chart = among(r, g.chart, ["bars", "line"]);
    },
    css(s, g) {
      return `
${s} .display { font-size: 56px; letter-spacing: -0.035em; }
${s} .kicker { color: var(--ink); font-family: var(--f-mono); font-weight: 400; letter-spacing: .08em; }
${s} .card { background: transparent; border: none; border-top: 1px solid var(--ink); padding-left: 0; padding-right: 0; counter-increment: swisscard; }
${s} .cards { counter-reset: swisscard; }
${s} .card::before { content: counter(swisscard, decimal-leading-zero); font-family: var(--f-mono); font-size: 11px; color: var(--muted); }
${s} .chip { border-radius: 0; border-color: var(--ink); color: var(--ink); }
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
${s} .logo { border-radius: 0; }
`;
    },
  },

  // ---------------------------------------------------------------- bauhaus
  {
    id: "bauhaus",
    name: "Bauhaus",
    family: "modernist",
    traits: ["geometric", "primary", "bold"],
    blurb:
      "Bauhaus: elementary geometry (circle, square, triangle) in primary red, blue, and yellow on warm paper, with heavy black structural borders. Form follows function, but the shapes themselves are celebrated as composition.",
    notes: [
      "Structural borders are thick (2px) and pure ink-black.",
      "A large flat circle and rotated square in primary colors sit behind the hero as pure composition.",
      "The logo mark is a perfect circle; headings are geometric and low-contrast in weight.",
      "No shadows, no gradients, no rounded corners except perfect circles.",
    ],
    conform(g, r) {
      const red = "#d63a2f", blue = "#1d59c4", yellow = "#e8b514";
      const combos = [[red, blue], [blue, yellow], [red, yellow]];
      const [a, b] = pick(r, combos);
      g.p = pal({ bg: "#f4efe6", ink: "#181512", accent: a, accent2: b, dark: false });
      g.fonts = { display: "geometric", body: "geometric", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = pick(r, ["lower", "none"]); g.hw = 700; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "dots"]);
    },
    css(s, g) {
      return `
${s} .logo { border-radius: 50%; width: 16px; height: 16px; }
${s} .card, ${s} .topbar, ${s} .foot { border-color: var(--ink); }
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 30px; top: -8px; width: 120px; height: 120px;
  border-radius: 50%; background: ${g.p.accent2}; opacity: .9; z-index: -1;
}
${s} .hero::before {
  content: ""; position: absolute; right: 130px; top: 60px; width: 64px; height: 64px;
  background: ${g.p.accent}; transform: rotate(20deg); z-index: -1; opacity: .85;
}
${s} .smain { z-index: 2; }
${s} .display { font-size: 47px; }
${s} .chip { border-color: var(--ink); border-width: 2px; color: var(--ink); font-weight: 600; }
${s} .btn-b { border-width: 2px; border-color: var(--ink); }
`;
    },
  },

  // ----------------------------------------------------------------- minlux
  {
    id: "minlux",
    name: "Minimal Luxury",
    family: "modernist",
    traits: ["minimal", "elegant", "airy"],
    blurb:
      "Quiet luxury: ivory space, a restrained serif at large sizes and light weight, microscopic tracked-out uppercase labels, and hairline rules. The absence of decoration is the statement — everything breathes.",
    notes: [
      "Labels (kicker, chips, footer) are tiny uppercase with very wide letter-spacing (0.25em+).",
      "The display face is a refined serif at light weight — never bold.",
      "Rules and borders are 1px hairlines in a barely-there neutral tone.",
      "The only 'color' is a muted brass/bronze used for fine accents; buttons are long, sharp rectangles.",
    ],
    conform(g, r) {
      const brass = hslToHex(irange(r, 34, 44), irange(r, 30, 45), irange(r, 38, 48));
      g.p = pal({ bg: "#f7f4ee", ink: "#211f1b", accent: brass, accent2: "#8a857c", dark: false });
      g.fonts = { display: pick(r, ["didone", "transitional", "oldstyle"]), body: "humanist", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "airy";
      g.case = "none"; g.hw = 400; g.track = 0;
      g.chart = among(r, g.chart, ["line", "bars-outline"]);
    },
    css(s, g) {
      return `
${s} .display { font-size: 50px; line-height: 1.12; }
${s} .kicker { letter-spacing: .3em; font-size: 10px; color: var(--accent); font-weight: 500; }
${s} .stat-label, ${s} .chip { letter-spacing: .22em; font-size: 9.5px; }
${s} .card { background: transparent; border: none; border-top: 1px solid var(--border); border-radius: 0; padding-left: 0; padding-right: 0; }
${s} .btn { padding: 10px 26px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; font-size: 10.5px; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .card-t { font-size: 16px; font-weight: 400; }
${s} .stat-num { font-weight: 400; font-size: 36px; }
${s} .logo { border-radius: 0; width: 10px; height: 10px; background: var(--ink); }
`;
    },
  },

  // ---------------------------------------------------------------- monoink
  {
    id: "monoink",
    name: "Monochrome Ink",
    family: "modernist",
    traits: ["bold", "highcontrast", "flat"],
    blurb:
      "Pure black and white at maximum volume (sometimes inverted to white-on-black): enormous ultra-heavy uppercase headlines, thick 2px rules, zero color, zero softness. Contrast and scale do all the work — brutal but typographic, like a protest poster set by a perfectionist.",
    notes: [
      "The entire palette is ink, paper, and one mid gray. There is no accent hue anywhere.",
      "Headlines are ultra-black weight, uppercase, tightly tracked, and oversized.",
      "All borders are 2px solid black; the primary button is a black slab with white text.",
      "Charts render in solid black with gray for secondary series.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.4); // inverted print: white ink on black
      g.p = dark
        ? pal({
            bg: "#0c0c0c", ink: "#f5f5f5", accent: "#f5f5f5", accent2: "#7a7a7a",
            border: "#f5f5f5", muted: "#b0b0b0", surface: "#0c0c0c", surface2: "#1e1e1e", dark: true,
          })
        : pal({
            bg: "#ffffff", ink: "#0a0a0a", accent: "#0a0a0a", accent2: "#8c8c8c",
            border: "#0a0a0a", muted: "#555555", surface: "#ffffff", surface2: "#f1f1f1", dark: false,
          });
      g.fonts = { display: pick(r, ["black", "industrial"]), body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 900; g.track = -0.01;
      g.chart = among(r, g.chart, ["bars", "bars-hatch"]);
    },
    css(s, g) {
      return `
${s} .display { font-size: 58px; line-height: 0.98; }
${s} .kicker { color: var(--ink); }
${s} .stat-delta { color: var(--ink); }
${s} .chip { border-width: 2px; color: var(--ink); font-weight: 700; text-transform: uppercase; font-size: 10px; }
${s} .btn-b { border-width: 2px; }
${s} .sub { color: ${g.p.dark ? "#c9c9c9" : "#444444"}; }
`;
    },
  },

  // ------------------------------------------------------------ flatneutral
  {
    id: "flatneutral",
    name: "Flat Product",
    family: "modernist",
    traits: ["clean", "familiar", "soft"],
    blurb:
      "Contemporary flat product design: a cool neutral base, one saturated brand accent, comfortable rounded corners, subtle lifted shadows, and friendly humanist type. The familiar, trustworthy SaaS look executed cleanly.",
    notes: [
      "Corners are consistently rounded (8–12px); shadows are small and crisp, never dramatic.",
      "Borders stay 1px in a light neutral gray — accents appear only in fills, links, and data.",
      "The layout is comfortable and evenly spaced with clear hierarchy.",
    ],
    conform(g, r) {
      g.p = basePalette(r, "slate", irange(r, 0, 359), chance(r, 0.3));
      g.fonts = { display: pick(r, ["grotesk", "humanist", "geometric"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [8, 10, 12]); g.ctl = pick(r, [7, 8, 999]);
      g.bw = 1;
      g.shadow = "lifted"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = -0.015;
      g.chart = among(r, g.chart, ["bars", "line", "area"]);
    },
    css(s, g) {
      return `
${s} .display { font-size: 42px; }
${s} .chip { background: var(--surface2); border-color: transparent; }
`;
    },
  },

  // ------------------------------------------------------------------ tufte
  {
    id: "tufte",
    name: "Data-Ink",
    family: "modernist",
    traits: ["scholarly", "minimal", "print"],
    blurb:
      "Tufte-style analytical elegance: warm book paper, old-style serif text, italic sidenote labels, and charts stripped to pure data-ink — thin lines, no chart junk, no boxes. It reads like a beautifully set statistics monograph.",
    notes: [
      "No card boxes: sections sit directly on the page, introduced by italic serif labels and separated by generous space.",
      "Charts are the hero: thin ink lines, direct labels, no gridlines or fills.",
      "The kicker and labels are italic lowercase serif, not tracked caps.",
      "A single deep red is permitted for the occasional emphasized number.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#fbf7ef", ink: "#22201c", accent: "#a03b2c", accent2: "#5c5850", dark: false });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "airy";
      g.case = "none"; g.hw = 500; g.track = 0;
      g.chart = among(r, g.chart, ["line", "dots"]);
    },
    css(s, g) {
      return `
${s} .kicker { text-transform: none; letter-spacing: 0; font-style: italic; font-size: 14px; font-weight: 400; color: var(--muted); }
${s} .display { font-size: 44px; }
${s} .sub { font-size: 16px; }
${s} .card { background: transparent; border: none; padding-left: 0; padding-right: 0; }
${s} .card-t { font-style: italic; font-weight: 500; }
${s} .stat-label { text-transform: none; letter-spacing: 0; font-style: italic; font-size: 12.5px; }
${s} .chip { border: none; padding-left: 0; font-style: italic; font-size: 12px; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .topbar, ${s} .foot { border-color: var(--ink); }
`;
    },
  },
];
