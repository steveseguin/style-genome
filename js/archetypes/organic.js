// Organic family: natural, handmade, and quiet-luxury textures.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const organic = [

  // ------------------------------------------------------------- earthcraft
  {
    id: "earthcraft",
    name: "Earth & Craft",
    family: "organic",
    traits: ["warm", "natural", "texture"],
    blurb:
      "Craft-fair warmth: terracotta, olive, and oat on textured recycled paper, stitched dashed borders like sewn patches, a humanist serif voice, and modest rounded corners. Handmade, honest, and warm to the touch.",
    notes: [
      "Cards read as sewn patches: 1px dashed borders in the warm neutral, small radius, on paper-textured ground.",
      "The palette is strictly earthen — terracotta accent, olive second accent, oat surfaces.",
      "Display type is a warm serif; labels can take a typewriter voice.",
      "Chips are filled oat-beige lozenges; charts use the earth tones as flat fills.",
    ],
    conform(g, r) {
      const terra = pick(r, ["#b3502d", "#a8552f", "#9c4a33"]);
      const olive = pick(r, ["#6d7a3f", "#5f7a4a", "#7a6d3f"]);
      g.p = pal({
        bg: "#f3ecdd", ink: "#312619", accent: terra, accent2: olive,
        surface: "#f9f4e8", border: "#c9bba0", muted: "#6f6249", dark: false,
      });
      g.fonts = { display: pick(r, ["oldstyle", "slab"]), body: "humanist", mono: "typewriter" };
      g.radius = 6; g.ctl = 999; g.bw = 1;
      g.shadow = among(r, g.shadow, ["none", "lifted"]); g.texture = "paper";
      g.density = "normal";
      g.case = "none"; g.hw = 600; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} .card { border-style: dashed; }
${s} .chip { background: ${mix(g.p.accent2, "#ffffff", 0.72)}; border: none; color: var(--ink); }
${s} .kicker { color: var(--accent); letter-spacing: .14em; font-family: var(--f-mono); }
${s} .display { font-size: 44px; }
${s} .btn-b { border-style: dashed; }
${s} .logo { border-radius: 50%; background: var(--accent); }
${s} .stat-delta { color: var(--accent2); }
`;
    },
  },

  // ------------------------------------------------------------------- wabi
  {
    id: "wabi",
    name: "Wabi-Sabi",
    family: "organic",
    traits: ["minimal", "calm", "airy"],
    blurb:
      "Japanese-inflected quietude: warm washi off-white, soft sumi-ink gray-black at light weights, enormous breathing room, whisper-thin rules, and a single tiny vermilion seal-mark of color. Stillness as a design decision.",
    notes: [
      "Space is the main material — margins and gaps are much larger than usual; content is sparse.",
      "Type is a modest serif at light-to-regular weight; nothing is bold.",
      "Sections separate with the thinnest possible top rules; no boxes, no shadows.",
      "Vermilion appears only twice, tiny: the seal-like logo mark and the stat delta.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f7f4ec", ink: "#37342e", accent: "#b23a2a", accent2: "#8a857a",
        surface: "#f7f4ec", border: "#ddd7c9", muted: "#7d786c", dark: false,
      });
      g.fonts = { display: "oldstyle", body: pick(r, ["oldstyle", "humanist"]), mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "airy";
      g.case = "none"; g.hw = 400; g.track = 0.02;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .display { font-size: 38px; line-height: 1.3; font-weight: 400; }
${s} .sub { font-size: 14.5px; }
${s} .kicker { color: var(--muted); letter-spacing: .3em; font-weight: 400; }
${s} .card { background: transparent; border: none; border-top: 1px solid var(--border); padding-left: 0; padding-right: 0; }
${s} .chip { border: none; padding-left: 0; color: var(--muted); }
${s} .btn-a { background: var(--ink); color: var(--bg); font-weight: 400; letter-spacing: .08em; }
${s} .btn-b { border-color: var(--border); font-weight: 400; }
${s} .logo { border-radius: 50%; background: var(--accent); width: 11px; height: 11px; }
${s} .stat-num { font-weight: 400; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ------------------------------------------------------------------- blob
  {
    id: "blob",
    name: "Organic Bloom",
    family: "organic",
    traits: ["soft", "natural", "round"],
    blurb:
      "Botanical softness: leafy greens on warm white, big amoeba-cornered panels whose radii differ on every corner, soft petal-toned background blooms, and round friendly type. The geometry of leaves rather than machines.",
    notes: [
      "Panels use asymmetric organic radii (e.g. 28px 44px 30px 48px), a different mix per card.",
      "Two large soft radial blooms tint the background corners.",
      "The palette is botanical: leaf green accent, moss second accent, cream ground.",
      "Buttons are full pills; the chart is a smooth filled area curve.",
    ],
    conform(g, r) {
      const leaf = pick(r, ["#4d7c43", "#3f7c5a", "#5d8a3c"]);
      const moss = pick(r, ["#8aa06a", "#7c9a7c", "#a0a05e"]);
      g.p = pal({
        bg: "#fbf9f2", ink: "#2b3324", accent: leaf, accent2: moss,
        surface: "#ffffff", border: "#dfdccb", muted: "#68705c", dark: false,
      });
      g.fonts = { display: pick(r, ["rounded", "humanist"]), body: "humanist", mono: "mono" };
      g.radius = 28; g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "area";
    },
    css(s, g) {
      return `
${s} {
  background:
    radial-gradient(420px 340px at 92% 0%, ${alpha(g.p.accent2, 0.2)}, transparent 65%),
    radial-gradient(460px 380px at 0% 100%, ${alpha(g.p.accent, 0.14)}, transparent 62%),
    var(--bg);
}
${s} .card:nth-child(1) { border-radius: 28px 44px 30px 48px; }
${s} .card:nth-child(2) { border-radius: 44px 30px 46px 28px; }
${s} .card:nth-child(3) { border-radius: 32px 48px 28px 42px; }
${s} .display { font-size: 43px; }
${s} .kicker { color: var(--accent); letter-spacing: .12em; }
${s} .chip { background: ${mix(g.p.accent2, "#ffffff", 0.75)}; border: none; color: var(--ink); }
${s} .logo { border-radius: 50% 40% 55% 45%; background: var(--accent); width: 15px; height: 15px; }
${s} .stat-delta { color: var(--accent); }
`;
    },
  },

  // ----------------------------------------------------------------- sketch
  {
    id: "sketch",
    name: "Sketchbook",
    family: "organic",
    traits: ["handmade", "playful", "raw"],
    blurb:
      "A designer's sketchbook: wobbly hand-drawn borders (uneven radii on every element), pencil-gray ink, a casual handwritten display face, highlighter-yellow swipes for emphasis, and light paper grain. A wireframe that decided to stay charming.",
    notes: [
      "Borders use the classic hand-drawn trick: 2px ink with mismatched corner radii like 255px 15px 225px 15px / 15px 225px 15px 255px.",
      "The kicker sits on a highlighter swipe (translucent marker-yellow fill).",
      "Ink is warm pencil-dark, never pure black; shadows are faint offset pencil smudges.",
      "The chart is drawn in outline, as if inked by hand.",
    ],
    conform(g, r) {
      const hi = pick(r, ["#f5d928", "#8ee05e", "#63d8e6"]);
      g.p = pal({
        bg: "#fcfaf4", ink: "#3a3a38", accent: hi, accent2: "#d86363",
        surface: "#fcfaf4", border: "#3a3a38", muted: "#71716d", dark: false,
      });
      g.fonts = { display: "script", body: pick(r, ["script", "humanist"]), mono: "typewriter" };
      g.radius = 12; g.ctl = 12; g.bw = 2;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const wob1 = "255px 15px 225px 15px / 15px 225px 15px 255px";
      const wob2 = "15px 255px 15px 225px / 225px 15px 255px 15px";
      return `
${s} .card { border-radius: ${wob1}; box-shadow: 2px 3px 0 ${alpha(g.p.ink, 0.15)}; }
${s} .card:nth-child(2) { border-radius: ${wob2}; }
${s} .btn { border: 2px solid var(--ink); border-radius: ${wob2}; background: transparent; color: var(--ink); box-shadow: none; }
${s} .btn-a { background: ${alpha(g.p.accent, 0.55)}; }
${s} .chip { border: 1.5px solid var(--ink); border-radius: ${wob1}; color: var(--ink); }
${s} .kicker {
  color: var(--ink); background: linear-gradient(104deg, transparent 2%, ${alpha(g.p.accent, 0.5)} 4%, ${alpha(g.p.accent, 0.5)} 96%, transparent 98%);
  align-self: flex-start; padding: 2px 8px; letter-spacing: .06em;
}
${s} .display { font-size: 42px; }
${s} .stat-delta { color: var(--accent2); }
${s} .logo { border: 2px solid var(--ink); background: transparent; border-radius: 50% 45% 55% 48%; }
${s} .topbar { border-bottom: 2px solid var(--ink); }
${s} .foot { border-top: 2px solid var(--ink); }
`;
    },
  },

  // ---------------------------------------------------------------- darklux
  {
    id: "darklux",
    name: "Midnight Atelier",
    family: "organic",
    traits: ["dark", "elegant", "airy"],
    blurb:
      "After-hours luxury: espresso-black ground with a warm undertone, champagne-gold accents, ivory didone display type at light weight, hairline rules, and acres of dark space. A perfume house's website at midnight.",
    notes: [
      "The ground is a very dark warm neutral (espresso/plum-black), never pure black.",
      "Gold is used as jewelry: kicker, key numbers, the mark — small and precious.",
      "Display type is a high-contrast serif at light weight with generous size.",
      "Rules and borders are dim hairlines; the primary button is a solid gold slab with dark text.",
    ],
    conform(g, r) {
      const ground = pick(r, ["#181310", "#16121a", "#121414"]);
      g.p = pal({
        bg: ground, ink: "#efe8da", accent: "#c9a95c", accent2: "#8f8a80",
        surface: mix(ground, "#ffffff", 0.04), border: mix(ground, "#efe8da", 0.18),
        muted: mix("#efe8da", ground, 0.42), dark: true,
      });
      g.fonts = { display: "didone", body: "humanist", mono: "mono" };
      g.radius = 2; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = among(r, g.texture, ["none", "grain"]);
      g.density = "airy";
      g.case = "none"; g.hw = 400; g.track = 0.01;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .display { font-size: 48px; font-weight: 400; line-height: 1.1; }
${s} .kicker { color: var(--accent); letter-spacing: .28em; font-size: 10px; }
${s} .stat-num { color: var(--accent); font-weight: 400; }
${s} .btn-a { color: ${g.p.bg}; font-weight: 600; letter-spacing: .08em; }
${s} .btn-b { border-color: var(--border); }
${s} .chip { letter-spacing: .16em; text-transform: uppercase; font-size: 9.5px; }
${s} .card-t { font-weight: 400; font-size: 16px; }
${s} .logo { border-radius: 50%; background: var(--accent); width: 10px; height: 10px; }
`;
    },
  },

  // ------------------------------------------------------------- industrial
  {
    id: "industrial",
    name: "Foundry",
    family: "organic",
    traits: ["gray", "technical", "raw"],
    blurb:
      "Industrial foundry: poured-concrete grays, gunmetal panel plates with corner rivets, condensed uppercase spec-sheet type, monospaced part numbers, and one safety-orange highlight reserved for the number that matters. Built, not decorated.",
    notes: [
      "Panels are concrete-gray plates with darker 2px machined edges and small rivet dots in two corners (radial-gradient details).",
      "Type is condensed uppercase for headings and monospace for all labels, like a spec sheet.",
      "The palette is achromatic concrete except safety orange, used exactly once per view (the key stat / max bar).",
      "Square corners, hard small shadows, grain texture like cast surface.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#d7d7d4", ink: "#1e1e1e", accent: "#e8621c", accent2: "#55565a",
        surface: "#c9c9c6", border: "#8a8a86", muted: "#4b4b48", dark: false,
      });
      g.fonts = { display: "industrial", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "hard"; g.texture = "grain";
      g.density = "dense";
      g.case = "upper"; g.hw = 700; g.track = 0.03;
      g.chart = "bars";
    },
    css(s, g) {
      const rivet = `radial-gradient(circle 3px at 10px 10px, #9a9a96 0 2px, #6f6f6b 2px 3px, transparent 3px), radial-gradient(circle 3px at calc(100% - 10px) 10px, #9a9a96 0 2px, #6f6f6b 2px 3px, transparent 3px)`;
      return `
${s} .card { background-image: ${rivet}; background-color: var(--surface); box-shadow: 3px 3px 0 ${alpha("#1e1e1e", 0.35)}; padding-top: 22px; }
${s} .display { font-size: 46px; letter-spacing: .01em; }
${s} .kicker { font-family: var(--f-mono); color: var(--ink); letter-spacing: .1em; }
${s} .kicker::before { content: "SPEC "; color: var(--muted); }
${s} .card-t { font-size: 13px; letter-spacing: .1em; }
${s} .chip { border-radius: 0; font-family: var(--f-mono); font-size: 10px; border-color: var(--muted); }
${s} .btn { border-radius: 0; }
${s} .btn-a { box-shadow: 2px 2px 0 ${alpha("#1e1e1e", 0.5)}; }
${s} .btn-b { border-color: var(--ink); border-width: 2px; }
${s} .stat-num { color: var(--accent); }
${s} .foot { font-family: var(--f-mono); font-size: 10.5px; text-transform: uppercase; }
${s} .logo { border-radius: 0; background: var(--ink); }
`;
    },
  },
];
