// Heritage family: early-modern art movements reconstructed as interfaces —
// De Stijl grids, Soviet poster energy, comic-book pop, and acid-poster swirl.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const heritageModern = [

  // ---------------------------------------------------------------- destijl
  {
    id: "destijl",
    name: "De Stijl",
    family: "heritage",
    traits: ["geometric", "primary", "bold"],
    blurb:
      "Mondrian and Rietveld rendered as a page: a pure white ground carved by thick 3px black structural lines, filled only with rectangles of primary red, cobalt blue, and canary yellow. Nothing curves, nothing shades — the composition is a rigid asymmetric grid where every division is load-bearing and every color is flat and absolute.",
    notes: [
      "Every structural edge — topbar bottom, card borders, footer top — is a thick 3px pure-black line; corners are square everywhere.",
      "An asymmetric Mondrian composition sits upper-right of the hero: four rectangles (red, yellow, white, blue) painted as layered no-repeat background rectangles separated by 3px black grid gaps.",
      "The logo is a solid red square; chips are square blocks with 2px black borders and bold ink text.",
      "Chart bars alternate the three primaries (blue / yellow / red) and each carries a 2px black outline.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#ffffff", ink: "#101010", accent: "#d42027", accent2: "#1b3d8f",
        surface: "#ffffff", surface2: "#f4f4f4", border: "#101010", muted: "#575757", dark: false,
      });
      g.fonts = { display: "geometric", body: "geometric", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 3;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
${s} .card { border-color: var(--ink); }
${s} .logo { border-radius: 0; background: var(--accent); }
${s} .display { font-size: 46px; }
${s} .kicker { color: var(--ink); letter-spacing: .14em; }
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 18px; top: -8px; width: 196px; height: 156px; z-index: -1;
  background:
    linear-gradient(var(--accent), var(--accent)) 0 0 / 62px 64px no-repeat,
    linear-gradient(#f4c400, #f4c400) 0 67px / 62px 89px no-repeat,
    linear-gradient(#ffffff, #ffffff) 65px 0 / 131px 38px no-repeat,
    linear-gradient(var(--accent2), var(--accent2)) 65px 41px / 131px 115px no-repeat,
    #101010;
}
${s} .smain { z-index: 2; }
${s} .chip { border-radius: 0; border: 2px solid var(--ink); color: var(--ink); font-weight: 700; }
${s} .btn-a { background: var(--accent); color: #ffffff; }
${s} .btn-b { border-color: var(--ink); }
${s} .stat-num { color: var(--accent2); }
${s} .stat-delta { color: var(--accent); }
${s} .chart rect { fill: var(--accent2); stroke: var(--ink); stroke-width: 2; }
${s} .chart rect:nth-of-type(3n+2) { fill: #f4c400; }
${s} .chart rect:nth-of-type(3n) { fill: var(--accent); }
`;
    },
  },

  // ---------------------------------------------------------- constructivist
  {
    id: "constructivist",
    name: "Constructivist",
    family: "heritage",
    traits: ["bold", "print", "highcontrast"],
    blurb:
      "A Soviet avant-garde poster in Rodchenko's key: aged cream stock, revolutionary red and black, and nothing else. Everything drives on the diagonal — a huge red wedge slices behind the headline and the kicker becomes a tilted red banner — while a condensed industrial display face shouts in enormous tight-set capitals. Stark, mechanical, and agitational.",
    notes: [
      "The kicker is reworked into a red banner rotated -4deg with white bold caps, anchored to the left edge as a filled label.",
      "A large red diagonal wedge (a clip-path triangle at moderate alpha) cuts across the upper-right behind the display heading.",
      "The display is condensed industrial caps at 54px with tight leading; cards are stark with 2px black borders and square corners.",
      "The primary button and logo are solid red rectangles; the chart uses red hatched bars with black outlines.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#e7dcc4", ink: "#17120e", accent: "#c1272d", accent2: "#1d130f",
        surface: "#efe7d3", surface2: "#e0d3b8", border: "#17120e", muted: "#5c4e3c", dark: false,
      });
      g.fonts = { display: "industrial", body: "grotesk", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = among(r, g.texture, ["none", "paper"]);
      g.density = "normal";
      g.case = "upper"; g.hw = 800; g.track = -0.01;
      g.chart = "bars-hatch";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 0; top: -24px; width: 380px; height: 260px; z-index: -1;
  background: ${alpha(g.p.accent, 0.85)};
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}
${s} .smain { z-index: 2; }
${s} .kicker {
  align-self: flex-start; background: var(--accent); color: #ffffff;
  padding: 4px 14px; transform: rotate(-4deg); font-weight: 800; letter-spacing: .12em;
}
${s} .display { font-size: 54px; line-height: .92; }
${s} .card { border-color: var(--ink); }
${s} .card-t { color: var(--accent); }
${s} .chip { border-radius: 0; border-color: var(--ink); color: var(--ink); font-weight: 700; text-transform: uppercase; font-size: 10px; }
${s} .btn-a { background: var(--accent); color: #ffffff; }
${s} .btn-b { border-color: var(--ink); color: var(--ink); }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent); }
${s} .logo { border-radius: 0; background: var(--accent); }
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
`;
    },
  },

  // ----------------------------------------------------------------- popart
  {
    id: "popart",
    name: "Pop Art Comic",
    family: "heritage",
    traits: ["playful", "pattern", "vivid"],
    blurb:
      "A Lichtenstein comic panel: crisp white cards float over a cream ground saturated with big visible Benday dots, everything fenced by fat 3px black outlines and hard black offset shadows. The palette is pure comic ink — hot red, process yellow, and cyan-blue — and the headline is a black slab of caps with a punchy offset color shadow, like a speech-balloon KAPOW.",
    notes: [
      "A halftone Benday field tiles the ground: an accent-colored radial-dot background on the root at ~9px, doubled by the dot texture overlay for a printed screen feel.",
      "Cards and buttons wear 3px solid black borders with hard black offset shadows; corners on chips and buttons are full pills.",
      "The display is a heavy black face in caps with a 4px offset text-shadow in the accent color.",
      "Chips are shouty process-yellow pills with black borders; chart bars carry 2px black outlines.",
    ],
    conform(g, r) {
      const red = "#e0271b", blue = "#1c86d0";
      const [a, b] = pick(r, [[red, blue], [blue, red]]);
      g.p = pal({
        bg: "#fbf5e6", ink: "#141414", accent: a, accent2: b,
        surface: "#ffffff", surface2: "#fff7dc", border: "#141414", muted: "#3c3c3c", dark: false,
      });
      g.fonts = { display: "black", body: "grotesk", mono: "mono" };
      g.radius = 6; g.ctl = 999; g.bw = 3;
      g.shadow = "hard"; g.texture = "dots";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} {
  background-color: var(--bg);
  background-image: radial-gradient(${alpha(g.p.accent, 0.25)} 2px, transparent 2.6px);
  background-size: 9px 9px;
}
${s} .display { font-size: 50px; text-shadow: 4px 4px 0 var(--accent); }
${s} .kicker { color: var(--accent); font-weight: 800; letter-spacing: .1em; }
${s} .card { border-color: var(--ink); background: var(--surface); }
${s} .card-t { letter-spacing: .01em; }
${s} .chip { background: #f6d01a; color: var(--ink); border: 2px solid var(--ink); font-weight: 800; }
${s} .btn { border: 3px solid var(--ink); box-shadow: 4px 4px 0 var(--ink); }
${s} .btn-b { background: var(--surface); color: var(--ink); }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--ink); }
${s} .chart rect { stroke: var(--ink); stroke-width: 2; }
${s} .logo { border: 2px solid var(--ink); border-radius: 50%; width: 15px; height: 15px; }
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
`;
    },
  },

  // ------------------------------------------------------------ psychedelic
  {
    id: "psychedelic",
    name: "Psychedelia",
    family: "heritage",
    traits: ["vivid", "pattern", "retro"],
    blurb:
      "A 1967 Fillmore concert poster: a warm cream or deep-purple ground pulsing with hypnotic concentric rings that radiate from off-canvas, in clashing hot oranges, magentas, and violets. The headline is a fat script set in a hot hue, tilted a couple degrees and trailed by a wavy underline; cards melt into lopsided organic corners and buttons glow with hot two-color gradients. Everything vibrates.",
    notes: [
      "The root ground carries a repeating-radial-gradient centered off-canvas (120% 20%) alternating two hot translucent hues in ~22px rings at low alpha so text stays legible.",
      "The display is a script face in the accent hue, rotated -2deg with a wavy accent2 underline.",
      "Cards take uneven organic corner radii (each neighbor different) and sit on filled surfaces.",
      "Pill buttons fill with an accent-to-accent2 hot gradient; the chart is a filled area curve.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.35);
      const hotA = pick(r, ["#ff2e88", "#e81f74", "#ff3d6e"]);
      const hotB = pick(r, ["#ff7a1e", "#ff9d1c", "#7b3ff2"]);
      g.p = dark
        ? pal({
            bg: "#221033", ink: "#fbeede", accent: hotA, accent2: hotB,
            surface: "#331a4a", surface2: "#3f2059", border: "#5a3a70", muted: "#cba9dc", dark: true,
          })
        : pal({
            bg: "#f4e6cd", ink: "#3a1c0e", accent: hotA, accent2: hotB,
            surface: "#fcf2df", surface2: "#f6e4c2", border: "#cca56d", muted: "#7a4728", dark: false,
          });
      g.fonts = { display: "script", body: "humanist", mono: "mono" };
      g.radius = 18; g.ctl = 999; g.bw = 2;
      g.shadow = dark ? "glow" : "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "area";
    },
    css(s, g) {
      return `
${s} {
  background-color: var(--bg);
  background-image: repeating-radial-gradient(circle at 120% 20%,
    ${alpha(g.p.accent, 0.12)} 0 22px,
    ${alpha(g.p.accent2, 0.12)} 22px 44px);
}
${s} .display {
  color: var(--accent); font-size: 48px; transform: rotate(-2deg);
  text-decoration: underline wavy var(--accent2); text-underline-offset: 7px;
}
${s} .kicker { color: var(--accent2); letter-spacing: .18em; }
${s} .card { background: var(--surface); border-radius: 24px 10px 22px 12px; }
${s} .card:nth-child(2) { border-radius: 10px 24px 12px 22px; }
${s} .card:nth-child(3) { border-radius: 20px 12px 26px 10px; }
${s} .chip { background: ${alpha(g.p.accent, 0.16)}; border-color: transparent; color: var(--ink); font-weight: 600; }
${s} .btn-a { background: linear-gradient(90deg, var(--accent), var(--accent2)); color: #ffffff; border: none; }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent2); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 35% 30%, var(--accent2), var(--accent)); }
`;
    },
  },
];
