// Future family: forward-looking interface fictions — ecological optimism,
// Victorian machinery, projected light, and dense data terminals.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const futureTech = [

  // ------------------------------------------------------------- solarpunk
  {
    id: "solarpunk",
    name: "Solarpunk",
    family: "future",
    traits: ["natural", "vivid", "soft"],
    blurb:
      "Optimistic ecological futurism: a warm ivory ground with leaf green and sun gold working together, tall arched card tops like greenhouse architecture, and a rising-sun motif of concentric gold rings behind the hero. A geometric display over humanist body — hopeful, sunlit, and deliberately built rather than grown.",
    notes: [
      "Cards get tall arched tops (border-radius like 110px 110px 14px 14px), varied per card, so the row reads as a colonnade of glasshouse arches.",
      "A rising sun of concentric gold rings (hard-stop radial gradient at low alpha) sits in the hero's upper-right corner, behind the text.",
      "Accent lives in fills only: green pill buttons, a green-to-gold leaf logo, soft green chips, and a green area chart for growth.",
      "Ivory ground with optional paper grain; corners are softly rounded and the type is warm but geometric.",
    ],
    conform(g, r) {
      const green = pick(r, ["#3f8f4e", "#2f9e57", "#4a9a3a"]);
      const gold = pick(r, ["#e8b53a", "#f0b429", "#e0a92e"]);
      g.p = pal({
        bg: "#fbf6ea", ink: "#25352a", accent: green, accent2: gold,
        surface: "#fffdf6", border: "#e3d9c2", muted: "#5c6b56", dark: false,
      });
      g.fonts = { display: "geometric", body: "humanist", mono: "mono" };
      g.radius = 14; g.ctl = 999; g.bw = 1;
      g.shadow = among(r, g.shadow, ["soft", "none"]);
      g.texture = among(r, g.texture, ["none", "paper"]);
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = 0;
      g.chart = "area";
    },
    css(s, g) {
      const gold = g.p.accent2;
      return `
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: -18px; top: -34px;
  width: 210px; height: 210px; z-index: -1;
  background: radial-gradient(circle at 100% 0%,
    ${alpha(gold, 0.6)} 0 3px, transparent 3px 30px,
    ${alpha(gold, 0.42)} 30px 33px, transparent 33px 60px,
    ${alpha(gold, 0.3)} 60px 63px, transparent 63px 92px,
    ${alpha(gold, 0.22)} 92px 95px, transparent 95px);
}
${s} .smain { z-index: 2; }
${s} .card { overflow: hidden; }
${s} .card:nth-child(1) { border-radius: 110px 110px 14px 14px; }
${s} .card:nth-child(2) { border-radius: 88px 88px 14px 14px; }
${s} .card:nth-child(3) { border-radius: 14px 110px 14px 14px; }
${s} .display { font-size: 44px; }
${s} .kicker { color: var(--accent); letter-spacing: .14em; }
${s} .sub { color: var(--muted); }
${s} .btn-a { background: var(--accent); color: #ffffff; }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .chip { background: ${mix(g.p.accent, "#ffffff", 0.82)}; border-color: transparent; color: ${mix(g.p.accent, g.p.ink, 0.35)}; }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent); }
${s} .card-t { color: var(--ink); }
${s} .logo { border-radius: 50% 50% 50% 0; background: linear-gradient(135deg, ${g.p.accent}, ${gold}); }
${s} .topnav .nl.on { color: var(--accent); }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ------------------------------------------------------------ brassworks
  {
    id: "brassworks",
    name: "Brassworks",
    family: "future",
    traits: ["retro", "ornate", "dark"],
    blurb:
      "A Victorian steampunk instrument panel: a dark espresso-leather ground under a fine grain, warm brass-cream lettering, and copper as the one live accent. Cards are riveted brass plates with double-rule frames and a screw pinned to every corner, while the key figure reads out like a copper gauge behind glass. Mechanical, ornate, and dimly gaslit.",
    notes: [
      "Cards are riveted plates: a dark leather surface, a 3px double brass frame, and four tiny warm-gray screw-heads pinned to the corners via a four-dot radial-gradient background.",
      "The stat number is framed like a gauge readout — copper monospaced digits in an inset dark well with a thin brass rule.",
      "Display is a heavy slab or high-contrast didone; labels, chips, and footer are typewriter mono for an instrument-label feel.",
      "Buttons are solid brass slabs (copper fill, dark leather text); the chart is drawn as outlined bars; grain texture covers the whole panel.",
    ],
    conform(g, r) {
      const copper = pick(r, ["#c2703d", "#bd6a35", "#cb7a44"]);
      const leather = "#241a12";
      g.p = pal({
        bg: leather, ink: "#e7d4a9", accent: copper, accent2: "#8a6b3f",
        surface: "#1b120b", surface2: "#2c2013", border: "#6b5535", muted: "#a58d61", dark: true,
      });
      g.fonts = { display: pick(r, ["slab", "didone"]), body: "humanist", mono: "typewriter" };
      g.radius = 3; g.ctl = 4; g.bw = 1;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 700; g.track = 0.02;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const dot = `radial-gradient(circle, ${alpha("#9a8a6a", 0.95)} 0 1.6px, transparent 2.3px)`;
      return `
${s} .card {
  background-color: var(--surface);
  background-image: ${dot}, ${dot}, ${dot}, ${dot};
  background-position: 7px 7px, calc(100% - 7px) 7px, 7px calc(100% - 7px), calc(100% - 7px) calc(100% - 7px);
  background-repeat: no-repeat;
  border: 3px double var(--border);
  padding: calc(var(--sp) * 2.1);
}
${s} .display { font-size: 42px; }
${s} .kicker { color: var(--accent); letter-spacing: .18em; }
${s} .card-t { color: var(--ink); }
${s} .card-p { color: var(--muted); }
${s} .stat-num {
  color: var(--accent); font-family: var(--f-mono);
  background: ${alpha("#000000", 0.32)}; border: 1px solid var(--border);
  border-radius: 3px; padding: 2px 9px; align-self: flex-start; letter-spacing: .04em;
}
${s} .stat-label, ${s} .chip, ${s} .foot { font-family: var(--f-mono); }
${s} .chip { border-color: var(--border); color: var(--ink); border-radius: 3px; }
${s} .btn-a { background: var(--accent); color: ${g.p.bg}; font-weight: 700; }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 35% 30%, ${mix(g.p.accent, "#ffffff", 0.5)}, ${g.p.accent} 72%); box-shadow: 0 0 0 1px var(--border); }
${s} .topbar { border-bottom: 1px solid var(--border); }
${s} .foot { border-top: 1px solid var(--border); }
`;
    },
  },

  // -------------------------------------------------------------- hologram
  {
    id: "hologram",
    name: "Hologram",
    family: "future",
    traits: ["dark", "technical", "translucent"],
    blurb:
      "A projected volumetric interface: near-black blue glass with a single cyan hue doing everything. Panels are barely-there cyan tints held together by thin translucent cyan rules, the type is thin and wide-tracked uppercase, and every headline, figure, and line faintly glows. Scan lines cross the whole projection. Airy, luminous, and immaterial.",
    notes: [
      "No solid surfaces: every panel is a ~5% cyan wash bounded by a 1px translucent-cyan hairline — the borders draw the interface, the fills barely register.",
      "One cyan hue is the entire palette; text, borders, chart, and glow are all that hue at varying alpha over the dark blue ground.",
      "Everything luminous: soft cyan text-shadow on the headline and stat number, glow shadows on buttons, and a drop-shadow glow on the chart and sparkline.",
      "Thin uppercase type at wide tracking; the primary button is a translucent cyan fill, the secondary a cyan outline; scan-line texture and near-square corners.",
    ],
    conform(g, r) {
      const c = pick(r, ["#4fe3ff", "#46e0d8", "#5ad3ff"]);
      const bg = "#060d18";
      g.p = pal({
        bg, ink: c, accent: c, accent2: mix(c, bg, 0.35),
        surface: mix(bg, c, 0.06), surface2: mix(bg, c, 0.1),
        border: mix(bg, c, 0.34), muted: mix(c, bg, 0.4), dark: true,
      });
      g.fonts = { display: pick(r, ["industrial", "geometric"]), body: "grotesk", mono: "mono" };
      g.radius = pick(r, [0, 2]); g.ctl = g.radius; g.bw = 1;
      g.shadow = "glow"; g.texture = "lines";
      g.density = "airy";
      g.case = "upper"; g.hw = pick(r, [400, 500]); g.track = 0.12;
      g.chart = "line";
    },
    css(s, g) {
      const c = g.p.accent;
      return `
${s} .card {
  background: ${alpha(c, 0.05)};
  border: 1px solid ${alpha(c, 0.3)};
  box-shadow: none;
  backdrop-filter: blur(1px);
}
${s} .display {
  font-size: 44px;
  text-shadow: 0 0 14px ${alpha(c, 0.55)}, 0 0 42px ${alpha(c, 0.22)};
}
${s} .kicker { color: ${alpha(c, 0.85)}; letter-spacing: .24em; }
${s} .sub { color: ${alpha(c, 0.62)}; }
${s} .card-t { color: ${c}; }
${s} .card-p, ${s} .stat-label, ${s} .stat-delta { color: ${alpha(c, 0.6)}; }
${s} .stat-num { color: ${c}; text-shadow: 0 0 12px ${alpha(c, 0.6)}; }
${s} .btn-a { background: ${alpha(c, 0.2)}; color: ${c}; border: 1px solid ${alpha(c, 0.45)}; box-shadow: 0 0 18px ${alpha(c, 0.35)}; }
${s} .btn-b { background: transparent; border: 1px solid ${alpha(c, 0.4)}; color: ${c}; }
${s} .chip { background: transparent; border: 1px solid ${alpha(c, 0.3)}; color: ${alpha(c, 0.8)}; }
${s} .chart { filter: drop-shadow(0 0 5px ${alpha(c, 0.7)}); }
${s} .spark { filter: drop-shadow(0 0 4px ${alpha(c, 0.7)}); }
${s} .logo { border-radius: 0; background: ${alpha(c, 0.2)}; border: 1px solid ${alpha(c, 0.6)}; box-shadow: 0 0 10px ${alpha(c, 0.7)}; }
${s} .topnav .nl { color: ${alpha(c, 0.55)}; }
${s} .topnav .nl.on { color: ${c}; }
${s} .topbar { border-bottom-color: ${alpha(c, 0.25)}; }
${s} .foot { border-top-color: ${alpha(c, 0.25)}; color: ${alpha(c, 0.55)}; }
`;
    },
  },

  // -------------------------------------------------------------- datadash
  {
    id: "datadash",
    name: "Data Terminal",
    family: "future",
    traits: ["dark", "technical", "dense"],
    blurb:
      "A financial data terminal in the Bloomberg key: a deep-navy ground, amber data figures, and white-ish labels, every glyph monospaced and packed dense. Cards are stacked data modules with hairline steel frames and tiny uppercase headers; the body text stripes like a spreadsheet, the headline number burns amber, and deltas post in trading green. Terse, tabular, and live.",
    notes: [
      "Cards are data modules: hairline steel borders, square corners, and a tiny uppercase mono header underlined by a full-width hairline rule.",
      "Body copy gets spreadsheet row-striping — a repeating gradient of alternating transparent and 3%-white bands.",
      "Amber is the data accent: large amber mono stat figures and amber chart bars, with trading-green deltas and a green LIVE tag on the kicker (data semantics, not decoration).",
      "Everything is monospaced at dense spacing; buttons are square amber fills with navy text; no shadows anywhere.",
    ],
    conform(g, r) {
      const amber = "#f5a623";
      g.p = pal({
        bg: "#0a1428", ink: "#e8eef7", accent: amber, accent2: "#c07f1e",
        surface: "#0e1b33", surface2: "#132340", border: "#25334d", muted: "#8598b5", dark: true,
      });
      g.fonts = { display: "mono", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = among(r, g.texture, ["none", "grid"]);
      g.density = "dense";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 600; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      const green = "#4caf50";
      return `
${s} .card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: calc(var(--sp) * 1.5);
  gap: calc(var(--sp) * 0.9);
}
${s} .card-t {
  font-size: 10.5px; text-transform: uppercase; letter-spacing: .12em;
  font-weight: 700; color: var(--muted);
  margin: 0 calc(var(--sp) * -1.5) 4px;
  padding: 0 calc(var(--sp) * 1.5) 6px;
  border-bottom: 1px solid var(--border);
}
${s} .card-p {
  font-family: var(--f-mono); font-size: 11.5px; line-height: 1.55;
  padding: 4px 6px;
  background: repeating-linear-gradient(180deg, transparent 0 18px, ${alpha("#ffffff", 0.03)} 18px 36px);
}
${s} .display { font-size: 38px; letter-spacing: -.01em; }
${s} .kicker { color: var(--accent); font-family: var(--f-mono); letter-spacing: .06em; }
${s} .kicker::after { content: " ● LIVE"; color: ${green}; }
${s} .sub { color: var(--muted); }
${s} .stat-num { color: var(--accent); font-family: var(--f-mono); font-size: 34px; }
${s} .stat-label { color: var(--muted); }
${s} .stat-delta { color: ${green}; }
${s} .chip { border-color: var(--border); color: var(--muted); font-family: var(--f-mono); font-size: 10px; border-radius: 0; }
${s} .btn { border-radius: 0; }
${s} .btn-a { background: var(--accent); color: ${g.p.bg}; font-weight: 700; }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .foot { font-family: var(--f-mono); border-top-color: var(--border); }
${s} .topbar { border-bottom-color: var(--border); }
${s} .logo { border-radius: 0; background: var(--accent); }
`;
    },
  },
];
