// Bold family: loud, graphic, high-energy styles.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const bold = [

  // ---------------------------------------------------------------- neobrut
  {
    id: "neobrut",
    name: "Neo-Brutalist",
    family: "bold",
    traits: ["bold", "playful", "highcontrast"],
    blurb:
      "Neo-brutalism: thick uniform black outlines around everything, hard offset black shadows (no blur), flat saturated fills, and elements sitting a degree off-axis. Loud, confident, cartoon-solid — the un-design that's meticulously designed.",
    notes: [
      "Every element carries a 2–3px solid black border and a hard black offset shadow (e.g. 5px 5px 0 #000) with zero blur.",
      "Fills are flat and saturated; the stat card tilts about -1.2° for energy.",
      "Chips are filled color blocks with black borders; nothing is translucent.",
      "Corners are either fully square or one consistent small radius — pick one and commit.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      g.p = pal({
        bg: pick(r, ["#f8f4e8", hslToHex(h + 60, 75, 90), "#ffffff"]),
        ink: "#0e0e0e",
        accent: hslToHex(h, 90, 60), accent2: hslToHex(h + irange(r, 90, 180), 85, 62),
        border: "#0e0e0e", surface: "#ffffff", muted: "#3a3a3a", dark: false,
      });
      g.fonts = { display: pick(r, ["black", "grotesk", "geometric"]), body: "grotesk", mono: "mono" };
      g.radius = pick(r, [0, 8, 12]); g.ctl = g.radius; g.bw = pick(r, [2, 3]);
      g.shadow = "hard"; g.texture = "none";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 900; g.track = -0.01;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} .display { font-size: 50px; }
${s} .card:nth-child(2) { transform: rotate(-1.2deg); background: ${mix(g.p.accent2, "#ffffff", 0.6)}; }
${s} .chip { background: var(--accent2); color: ${onColor(g.p.accent2)}; border: 2px solid var(--ink); font-weight: 800; }
${s} .chip:nth-child(2) { background: var(--accent); color: ${onColor(g.p.accent)}; }
${s} .btn { border: ${g.bw}px solid var(--ink); box-shadow: 4px 4px 0 var(--ink); }
${s} .btn-b { background: var(--surface); }
${s} .kicker { color: var(--ink); background: var(--accent); padding: 3px 10px; align-self: flex-start; border: 2px solid var(--ink); color: ${onColor(g.p.accent)}; }
${s} .logo { border: 2px solid var(--ink); box-shadow: 2px 2px 0 var(--ink); }
${s} .stat-delta { color: var(--ink); }
${s} .topbar { border-bottom-width: ${g.bw}px; }
${s} .foot { border-top-width: ${g.bw}px; }
`;
    },
  },

  // ---------------------------------------------------------------- memphis
  {
    id: "memphis",
    name: "Memphis Pop",
    family: "bold",
    traits: ["playful", "pattern", "postmodern"],
    blurb:
      "Memphis Group postmodernism: clashing candy brights outlined in black, confetti geometry scattered across the page, wavy underlines, and deliberately mismatched corner radii between neighboring elements. Serious rules, playfully broken.",
    notes: [
      "A scatter of small geometric confetti (dots, a circle, a rotated square) decorates the background in the accent colors.",
      "Neighboring cards intentionally disagree: one square, one very round, one pill-ish.",
      "The headline gets a wavy accent underline; borders are 2px black.",
      "Chips rotate a few degrees each, in alternating fills.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      g.p = pal({
        bg: hslToHex(h + 40, 65, 94), ink: "#141414",
        accent: hslToHex(h, 85, 58), accent2: hslToHex(h + irange(r, 110, 170), 80, 55),
        border: "#141414", surface: "#ffffff", muted: "#454545", dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "black"]), body: "humanist", mono: "mono" };
      g.radius = 4; g.ctl = 999; g.bw = 2;
      g.shadow = "hard"; g.texture = "dots";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["dots", "bars"]);
    },
    css(s, g) {
      return `
${s} {
  background-image:
    radial-gradient(circle at 88% 12%, ${alpha(g.p.accent, 0.9)} 0 9px, transparent 10px),
    radial-gradient(circle at 94% 55%, ${alpha(g.p.accent2, 0.9)} 0 6px, transparent 7px),
    radial-gradient(circle at 72% 88%, ${alpha(g.p.accent, 0.8)} 0 5px, transparent 6px);
  background-color: var(--bg);
}
${s} .display { text-decoration: underline wavy var(--accent) 3px; text-underline-offset: 8px; font-size: 45px; }
${s} .card:nth-child(1) { border-radius: 0; }
${s} .card:nth-child(2) { border-radius: 24px; }
${s} .card:nth-child(3) { border-radius: 4px 28px 4px 28px; }
${s} .chip { background: var(--accent2); color: ${onColor(g.p.accent2)}; border: 2px solid var(--ink); transform: rotate(-2deg); font-weight: 700; }
${s} .chip:nth-child(2) { background: var(--accent); color: ${onColor(g.p.accent)}; transform: rotate(1.5deg); }
${s} .chip:nth-child(3) { background: var(--surface); color: var(--ink); transform: rotate(-1deg); }
${s} .btn { border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); }
${s} .logo { border-radius: 50% 0 50% 50%; border: 2px solid var(--ink); }
${s} .topbar { border-bottom-width: 2px; border-bottom-color: var(--ink); }
${s} .foot { border-top-width: 2px; border-top-color: var(--ink); }
`;
    },
  },

  // ---------------------------------------------------------------- duotone
  {
    id: "duotone",
    name: "Duotone Poster",
    family: "bold",
    traits: ["bold", "print", "graphic"],
    blurb:
      "A two-ink silkscreen poster: cream paper, near-black ink, and one screaming spot color used in big honest slabs — including a full-bleed color block behind the hero. Massive type, hard edges, zero gradients.",
    notes: [
      "Exactly two inks on paper: near-black and one vivid spot color. Grays are forbidden — use the spot color or ink at full strength.",
      "The hero sits inside a full-width spot-color block; its text switches to the readable counter-color.",
      "Buttons and chips are solid ink or spot fills with square corners.",
      "The chart uses solid ink bars with the maximum bar in spot color.",
    ],
    conform(g, r) {
      const spot = pick(r, ["#e8480f", "#0f62e8", "#e80f6b", "#0fa348", "#7a1fe0"]);
      g.p = pal({
        bg: "#f6f1e5", ink: "#14120e", accent: spot, accent2: "#14120e",
        border: "#14120e", surface: "#f6f1e5", muted: "#43403a", dark: false,
      });
      g.fonts = { display: pick(r, ["black", "industrial"]), body: "grotesk", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = -0.005;
      g.chart = "bars";
    },
    css(s, g) {
      const on = onColor(g.p.accent);
      return `
${s} .hero {
  background: var(--accent); color: ${on};
  margin: calc(var(--sp) * -1) calc(var(--sp) * -3) 0;
  padding: calc(var(--sp) * 2.4) calc(var(--sp) * 3);
}
${s} .hero .sub { color: ${on}; opacity: .85; }
${s} .hero .kicker { color: ${on}; }
${s} .hero .btn-a { background: ${on}; color: var(--accent); }
${s} .hero .btn-b { border-color: ${on}; color: ${on}; }
${s} .display { font-size: 54px; line-height: .96; }
${s} .chip { border-color: var(--ink); border-width: 2px; border-radius: 0; color: var(--ink); font-weight: 700; }
${s} .stat-num { color: var(--accent); }
${s} .topbar { border-bottom: 2px solid var(--ink); }
${s} .foot { border-top: 2px solid var(--ink); }
${s} .logo { border-radius: 0; background: var(--accent); }
`;
    },
  },

  // ---------------------------------------------------------------- playful
  {
    id: "playful",
    name: "Toybox",
    family: "bold",
    traits: ["playful", "friendly", "round"],
    blurb:
      "A children's-app toybox: thick dark outlines with fat rounded corners, candy fills, elements tilted like scattered blocks, and chubby rounded type. Everything looks pick-up-able and slightly bouncy.",
    notes: [
      "Borders are thick (3px) in the deep ink color with very round corners (18–22px).",
      "Cards tilt alternately ±1°, like toys set down by hand.",
      "Chips are solid candy fills with white text; the palette is bright but the ink is a warm dark brown-black.",
      "Type is rounded and heavy; charts use fat rounded bars in alternating colors.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      g.p = pal({
        bg: "#fffdf6", ink: "#33261f",
        accent: hslToHex(h, 80, 55), accent2: hslToHex(h + irange(r, 100, 160), 75, 55),
        border: "#33261f", surface: "#ffffff", muted: "#6b5c50", dark: false,
      });
      g.fonts = { display: "rounded", body: pick(r, ["rounded", "humanist"]), mono: "mono" };
      g.radius = 20; g.ctl = 999; g.bw = 3;
      g.shadow = "hard"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "dots"]);
    },
    css(s, g) {
      return `
${s} .card { box-shadow: 4px 5px 0 ${alpha(g.p.ink, 0.9)}; }
${s} .card:nth-child(1) { transform: rotate(-0.7deg); }
${s} .card:nth-child(3) { transform: rotate(0.7deg); }
${s} .chip { background: var(--accent); color: ${onColor(g.p.accent)}; border: 2.5px solid var(--ink); font-weight: 800; }
${s} .chip:nth-child(2) { background: var(--accent2); color: ${onColor(g.p.accent2)}; }
${s} .btn { border: 3px solid var(--ink); box-shadow: 0 4px 0 var(--ink); font-weight: 800; }
${s} .display { font-size: 46px; }
${s} .kicker { color: var(--accent); letter-spacing: .1em; }
${s} .logo { border: 2.5px solid var(--ink); border-radius: 50%; width: 16px; height: 16px; }
${s} .topbar { border-bottom-width: 3px; }
${s} .foot { border-top-width: 3px; }
`;
    },
  },

  // ------------------------------------------------------------------ cyber
  {
    id: "cyber",
    name: "Night City HUD",
    family: "bold",
    traits: ["dark", "neon", "technical"],
    blurb:
      "A cyberpunk heads-up display: near-black violet glass, magenta and cyan neon text glows, angular panels with one clipped corner, '//' annotation prefixes, wide-tracked uppercase micro-labels, and a faint targeting grid.",
    notes: [
      "Panels have one 45° clipped corner (clip-path) — never four round ones. Panel borders stay thin and dim; the neon lives in text, glows, and fills.",
      "The kicker and labels take a '//' prefix and wide uppercase tracking, monospaced.",
      "Headline and key numbers glow (accent-colored text-shadow).",
      "The primary button is a clipped angular accent fill; a faint grid overlays the background.",
    ],
    conform(g, r) {
      const acc = pick(r, ["#ff2e88", "#f5e942", "#ff5e2e"]);
      const acc2 = pick(r, ["#2ee6ff", "#4dffc3"]);
      g.p = pal({
        bg: "#0c0a14", ink: "#e8e6f2", accent: acc, accent2: acc2,
        surface: "#16121f", border: "#37304a", muted: "#8d86a3", dark: true,
      });
      g.fonts = { display: pick(r, ["industrial", "mono"]), body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "glow"; g.texture = "grid";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 700; g.track = 0.08;
      g.chart = among(r, g.chart, ["line", "bars-outline"]);
    },
    css(s, g) {
      return `
${s} .card { clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%); box-shadow: none; }
${s} .display { text-shadow: 0 0 16px ${alpha(g.p.accent, 0.55)}; font-size: 42px; }
${s} .kicker { font-family: var(--f-mono); color: var(--accent2); }
${s} .kicker::before { content: "// "; }
${s} .card-t { color: var(--accent2); font-size: 12.5px; letter-spacing: .14em; }
${s} .card-t::before { content: "▸ "; }
${s} .btn-a { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); box-shadow: 0 0 18px ${alpha(g.p.accent, 0.5)}; }
${s} .btn-b { border-color: var(--border); }
${s} .chip { border-radius: 0; font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; }
${s} .stat-num { color: var(--accent); text-shadow: 0 0 14px ${alpha(g.p.accent, 0.6)}; }
${s} .stat-delta { color: var(--accent2); }
${s} .logo { border-radius: 0; background: var(--accent); clip-path: polygon(0 0, 100% 0, 100% 65%, 65% 100%, 0 100%); }
`;
    },
  },

  // ------------------------------------------------------------------- deco
  {
    id: "deco",
    name: "Art Deco",
    family: "bold",
    traits: ["ornate", "dark", "elegant"],
    blurb:
      "Art Deco opulence: burnished gold linework on deep lacquer (midnight green or black), fine double-rule frames, a radiating fan motif behind the hero, high-contrast display type set in wide-tracked capitals. Gatsby-grade glamour, geometrically disciplined.",
    notes: [
      "Gold is the ink: all text, rules, and frames render in shades of champagne gold on the dark lacquer ground.",
      "Frames are fine 3px double borders; the logo is a gold diamond.",
      "A subtle radiating fan (repeating conic rays) sits behind the hero.",
      "Headings are uppercase with generous letter-spacing; the primary button is a solid gold slab with dark text.",
    ],
    conform(g, r) {
      const ground = pick(r, ["#0f1f1a", "#121212", "#1a1025"]);
      const gold = "#cfa84e";
      g.p = pal({
        bg: ground, ink: "#e9d8a8", accent: gold, accent2: "#8fae9c",
        border: mix(gold, ground, 0.35), surface: mix(ground, "#ffffff", 0.045),
        muted: mix("#e9d8a8", ground, 0.4), dark: true,
      });
      g.fonts = { display: pick(r, ["didone", "geometric"]), body: "humanist", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "upper"; g.hw = 600; g.track = 0.14;
      g.chart = among(r, g.chart, ["bars-outline", "line"]);
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::before {
  content: ""; position: absolute; right: 0; top: -20px; width: 260px; height: 200px; z-index: -1;
  background: repeating-conic-gradient(from 240deg at 100% 0%, ${alpha(g.p.accent, 0.18)} 0deg 3deg, transparent 3deg 12deg);
  opacity: .9;
}
${s} .smain { z-index: 2; }
${s} .card { border: 3px double var(--border); }
${s} .topbar { border-bottom: 3px double var(--border); }
${s} .foot { border-top: 3px double var(--border); }
${s} .display { font-size: 40px; line-height: 1.15; }
${s} .kicker { color: var(--accent); letter-spacing: .3em; }
${s} .btn-a { color: ${g.p.bg}; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; font-size: 11px; padding: 10px 20px; }
${s} .btn-b { border-color: var(--border); letter-spacing: .1em; text-transform: uppercase; font-size: 11px; }
${s} .chip { border-color: var(--border); letter-spacing: .12em; text-transform: uppercase; font-size: 9.5px; }
${s} .logo { transform: rotate(45deg); border-radius: 0; width: 11px; height: 11px; }
${s} .stat-num { color: var(--accent); }
`;
    },
  },
];
