// Soft family: depth, translucency, roundness, and gentle color.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const soft = [

  // ------------------------------------------------------------------ glass
  {
    id: "glass",
    name: "Frosted Glass",
    family: "soft",
    traits: ["soft", "translucent", "modern"],
    blurb:
      "Glassmorphism: frosted translucent panels floating over large soft color-field blobs, thin bright white borders, big radii, and airy depth. The background does the painting; the panels just catch the light.",
    notes: [
      "The page background holds two large blurred radial color fields (accent and secondary accent).",
      "Panels are translucent white (or dark) with backdrop blur, a 1px semi-opaque white border, and a wide soft shadow.",
      "Buttons are pills; the primary button stays fully opaque for legibility.",
      "If blur is unavailable (e.g. static export), panels fall back to higher opacity.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.35);
      const h = irange(r, 0, 359);
      const acc = hslToHex(h, 70, dark ? 62 : 48);
      const acc2 = hslToHex(h + irange(r, 60, 140), 65, dark ? 60 : 55);
      g.p = dark
        ? pal({ bg: hslToHex(h, 30, 12), ink: "#f2f2f7", accent: acc, accent2: acc2,
                surface: mix(hslToHex(h, 30, 12), "#ffffff", 0.1), border: alphaBorder(true), muted: hslToHex(h, 12, 72), dark: true })
        : pal({ bg: hslToHex(h, 40, 95), ink: hslToHex(h, 30, 14), accent: acc, accent2: acc2,
                surface: "#ffffff", border: alphaBorder(false), muted: hslToHex(h, 15, 40), dark: false });
      function alphaBorder(d) { return d ? "#5a5a72" : "#dcdce8"; }
      g.fonts = { display: pick(r, ["grotesk", "geometric", "humanist"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [16, 20]); g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.02;
      g.chart = among(r, g.chart, ["area", "line", "bars"]);
    },
    css(s, g) {
      const glassBg = g.p.dark ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.5)";
      const glassBorder = g.p.dark ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.85)";
      const fallback = g.p.dark ? "rgba(30,30,44,.88)" : "rgba(255,255,255,.9)";
      return `
${s} {
  background:
    radial-gradient(560px 420px at 88% -10%, ${alpha(g.p.accent, 0.5)}, transparent 65%),
    radial-gradient(620px 480px at -8% 105%, ${alpha(g.p.accent2, 0.45)}, transparent 62%),
    var(--bg);
}
${s} .card {
  background: ${glassBg};
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-color: ${glassBorder};
}
${s}.export-mode .card { background: ${fallback}; backdrop-filter: none; -webkit-backdrop-filter: none; }
${s} .topbar { border-bottom-color: ${glassBorder}; }
${s} .foot { border-top-color: ${glassBorder}; }
${s} .chip { background: ${glassBg}; border-color: ${glassBorder}; }
${s} .display { font-size: 45px; }
${s} .logo { border-radius: 50%; background: linear-gradient(135deg, ${g.p.accent}, ${g.p.accent2}); }
`;
    },
  },

  // -------------------------------------------------------------------- neu
  {
    id: "neu",
    name: "Neumorphic",
    family: "soft",
    traits: ["soft", "monochrome", "tactile"],
    blurb:
      "Neumorphism: interface elements extruded from a single pale surface, modeled entirely with paired light/dark soft shadows — no borders, no lines, no contrast edges. Quiet, tactile, and monochromatic with one gentle accent.",
    notes: [
      "Background and panels are the same color; panels 'exist' only through a light shadow above-left and a dark shadow below-right.",
      "There are no visible borders anywhere; separators are embossed grooves.",
      "Chips and inputs are pressed (inset) versions of the same treatment.",
      "One soft accent colors text highlights and data; corners are very round.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      const base = hslToHex(h, irange(r, 12, 22), 90);
      g.p = pal({
        bg: base, ink: hslToHex(h, 20, 22), accent: hslToHex(h, 55, 52),
        accent2: hslToHex(h + 40, 40, 58),
        surface: base, surface2: base, border: base,
        muted: hslToHex(h, 14, 46), dark: false,
      });
      g.fonts = { display: pick(r, ["rounded", "geometric", "humanist"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [18, 22]); g.ctl = pick(r, [14, 999]); g.bw = 0;
      g.shadow = "emboss"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "line"]);
    },
    css(s, g) {
      const dark = mix(g.p.bg, "#0a1030", 0.16);
      const light = mix(g.p.bg, "#ffffff", 0.85);
      const out = `7px 7px 14px ${alpha(dark, 0.75)}, -7px -7px 14px ${alpha(light, 0.9)}`;
      const inset = `inset 4px 4px 8px ${alpha(dark, 0.55)}, inset -4px -4px 8px ${alpha(light, 0.9)}`;
      return `
${s} .card { box-shadow: ${out}; border: none; }
${s} .topbar { border-bottom: none; box-shadow: 0 6px 10px -6px ${alpha(dark, 0.5)}; }
${s} .foot { border-top: none; box-shadow: 0 -6px 10px -6px ${alpha(dark, 0.4)}; }
${s} .btn { border: none; }
${s} .btn-a { background: var(--bg); color: var(--accent); box-shadow: ${out}; font-weight: 700; }
${s} .btn-b { background: var(--bg); color: var(--muted); box-shadow: ${inset}; }
${s} .chip { border: none; box-shadow: ${inset}; }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: 2px 2px 5px ${alpha(dark, 0.6)}; }
${s} .display { font-size: 42px; color: var(--ink); }
${s} .kicker { color: var(--accent); }
`;
    },
  },

  // ------------------------------------------------------------------- clay
  {
    id: "clay",
    name: "Claymorphic",
    family: "soft",
    traits: ["soft", "playful", "chunky"],
    blurb:
      "Claymorphism: chunky inflated panels that look squeezed from soft clay — huge radii, a bright inner rim light, and a deep matched-color outer shadow. Cheerful candy colors and bouncy, generous proportions.",
    notes: [
      "Panels have very large radii (24px+), an inset white highlight along the top rim, and a soft colored drop shadow — reading as thick and squishy.",
      "The palette is bright and candy-like on a tinted pastel page.",
      "Buttons look pressable: fat pills with the same clay treatment.",
      "Type is round and friendly at heavy weights.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      g.p = pal({
        bg: hslToHex(h, 55, 94), ink: hslToHex(h, 45, 20),
        accent: hslToHex(h, 75, 58), accent2: hslToHex(h + irange(r, 100, 160), 70, 62),
        surface: "#ffffff", border: hslToHex(h, 35, 84), muted: hslToHex(h, 22, 42), dark: false,
      });
      g.fonts = { display: "rounded", body: pick(r, ["rounded", "humanist"]), mono: "mono" };
      g.radius = 26; g.ctl = 999; g.bw = 0;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "dots"]);
    },
    css(s, g) {
      const clay = `inset 0 6px 10px rgba(255,255,255,.95), inset 0 -8px 12px ${alpha(g.p.accent, 0.12)}, 0 14px 26px ${alpha(g.p.accent, 0.28)}`;
      return `
${s} .card { border: none; box-shadow: ${clay}; }
${s} .btn { border: none; padding: 11px 20px; }
${s} .btn-a { box-shadow: inset 0 4px 6px rgba(255,255,255,.5), inset 0 -5px 8px rgba(0,0,0,.14), 0 8px 16px ${alpha(g.p.accent, 0.45)}; }
${s} .btn-b { background: #fff; box-shadow: inset 0 3px 5px rgba(255,255,255,.9), inset 0 -4px 7px ${alpha(g.p.accent, 0.15)}, 0 6px 12px ${alpha(g.p.accent, 0.2)}; }
${s} .chip { background: ${mix(g.p.accent2, "#ffffff", 0.75)}; border: none; color: var(--ink); font-weight: 700; }
${s} .display { font-size: 44px; }
${s} .topbar { border-bottom: none; }
${s} .foot { border-top: none; }
${s} .logo { border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 4px 8px ${alpha(g.p.accent, 0.5)}; }
${s} .stat-num { color: var(--accent); }
`;
    },
  },

  // ------------------------------------------------------------- pastelsoft
  {
    id: "pastelsoft",
    name: "Pastel Pop",
    family: "soft",
    traits: ["soft", "friendly", "light"],
    blurb:
      "Candy-pastel product design: a white page with panels in alternating pastel tints, pill badges, rounded corners, and crisp small shadows. Sweet and approachable without losing structure — a design system in sorbet colors.",
    notes: [
      "Each card takes a different pastel surface tint (rotating through the palette); the page itself stays white.",
      "The kicker is a filled pill badge in a light accent tint.",
      "Chips are borderless pastel fills; corners are consistently 14–16px.",
      "Charts render as soft dots or rounded bars in the two accents.",
    ],
    conform(g, r) {
      const h = irange(r, 0, 359);
      g.p = pal({
        bg: "#ffffff", ink: hslToHex(h, 35, 18),
        accent: hslToHex(h, 70, 60), accent2: hslToHex(h + irange(r, 80, 150), 65, 62),
        surface: hslToHex(h, 60, 96), surface2: hslToHex(h + 100, 55, 95),
        border: hslToHex(h, 25, 88), muted: hslToHex(h, 18, 45), dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "rounded", "grotesk"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [14, 16]); g.ctl = 999; g.bw = 0;
      g.shadow = "lifted"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.01;
      g.chart = among(r, g.chart, ["dots", "bars", "area"]);
    },
    css(s, g) {
      return `
${s} .card { border: none; }
${s} .card:nth-child(1) { background: ${mix(g.p.accent, "#ffffff", 0.88)}; }
${s} .card:nth-child(2) { background: ${mix(g.p.accent2, "#ffffff", 0.88)}; }
${s} .card:nth-child(3) { background: ${hslToHex(45, 70, 94)}; }
${s} .kicker {
  background: ${mix(g.p.accent, "#ffffff", 0.85)}; color: ${mix(g.p.accent, "#000000", 0.25)};
  padding: 4px 12px; border-radius: 999px; align-self: flex-start; letter-spacing: .08em;
}
${s} .chip { background: rgba(255,255,255,.75); border: none; color: var(--ink); font-weight: 600; }
${s} .display { font-size: 44px; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .logo { border-radius: 50%; background: linear-gradient(135deg, ${g.p.accent}, ${g.p.accent2}); }
`;
    },
  },

  // ----------------------------------------------------------------- aurora
  {
    id: "aurora",
    name: "Aurora Mesh",
    family: "soft",
    traits: ["gradient", "modern", "vivid"],
    blurb:
      "Aurora gradient-mesh: enormous soft blobs of blended color drifting behind clean panels, a gradient-filled headline, and gradient pill buttons. Contemporary and luminous — color as atmosphere rather than decoration.",
    notes: [
      "The background holds 3 large blurred gradient blobs (accent, secondary, and a bridge tone) on a near-white (or near-black) base.",
      "The headline itself is filled with an accent→secondary gradient (background-clip: text).",
      "The primary button uses the same gradient; panels stay clean and mostly opaque.",
      "Corners ~14px; shadows are wide, soft, and tinted toward the accent.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.4);
      const h = irange(r, 0, 359);
      const acc = hslToHex(h, 80, dark ? 62 : 52);
      const acc2 = hslToHex(h + irange(r, 70, 130), 75, dark ? 60 : 55);
      g.p = dark
        ? pal({ bg: "#0d0d14", ink: "#f0f0f6", accent: acc, accent2: acc2, surface: "#16161f", border: "#2c2c3a", muted: "#9c9cb0", dark: true })
        : pal({ bg: "#fcfcfe", ink: "#17171f", accent: acc, accent2: acc2, surface: "#ffffff", border: "#e6e6ef", muted: "#5c5c70", dark: false });
      g.fonts = { display: pick(r, ["grotesk", "geometric"]), body: "grotesk", mono: "mono" };
      g.radius = 14; g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = -0.025;
      g.chart = among(r, g.chart, ["area", "line"]);
    },
    css(s, g) {
      const grad = `linear-gradient(100deg, ${g.p.accent}, ${g.p.accent2})`;
      return `
${s} {
  background:
    radial-gradient(500px 380px at 85% -5%, ${alpha(g.p.accent, 0.32)}, transparent 60%),
    radial-gradient(560px 420px at 8% 30%, ${alpha(g.p.accent2, 0.26)}, transparent 62%),
    radial-gradient(480px 420px at 60% 115%, ${alpha(mix(g.p.accent, g.p.accent2, 0.5), 0.3)}, transparent 60%),
    var(--bg);
}
${s} .display {
  background: ${grad};
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-size: 47px;
}
${s} .btn-a { background: ${grad}; box-shadow: 0 8px 20px ${alpha(g.p.accent, 0.4)}; }
${s} .card { box-shadow: 0 12px 30px ${alpha(g.p.accent, 0.12)}; }
${s} .logo { border-radius: 50%; background: ${grad}; }
${s} .stat-delta { color: var(--accent2); }
`;
    },
  },

  // ------------------------------------------------------------------ scandi
  {
    id: "scandi",
    name: "Scandinavian Calm",
    family: "soft",
    traits: ["calm", "natural", "light"],
    blurb:
      "Scandinavian functionalism: warm paper-white, muted sage and clay tones, precise geometric type at modest weights, short hairline underlines, and honest, even spacing. Nothing shouts; everything is considered.",
    notes: [
      "Color is muted and natural — sage, clay, oat — used sparingly against warm off-white.",
      "Card titles carry a short 24px hairline underline in the neutral border tone.",
      "Corners are gently rounded (8px); shadows barely-there or absent.",
      "Generous, even whitespace; charts are thin lines with small dot markers.",
    ],
    conform(g, r) {
      const nat = pick(r, [
        ["#7a8b6f", "#b0876a"], ["#8b9a8b", "#c2a082"], ["#6f8b85", "#b09a6a"],
      ]);
      g.p = pal({
        bg: "#f8f6f2", ink: "#28261f", accent: nat[0], accent2: nat[1],
        surface: "#fdfcfa", border: "#e2ddd3", muted: "#75705f", dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "humanist"]), body: "humanist", mono: "mono" };
      g.radius = 8; g.ctl = 8; g.bw = 1;
      g.shadow = among(r, g.shadow, ["none", "lifted"]); g.texture = "none";
      g.density = "airy";
      g.case = "none"; g.hw = 600; g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .display { font-size: 42px; letter-spacing: -0.01em; }
${s} .card-t { padding-bottom: 8px; position: relative; }
${s} .card-t::after { content: ""; position: absolute; left: 0; bottom: 0; width: 24px; height: 1px; background: var(--border); }
${s} .kicker { color: var(--accent); letter-spacing: .16em; font-weight: 500; }
${s} .chip { color: var(--muted); }
${s} .btn-a { background: var(--ink); color: var(--bg); box-shadow: none; }
${s} .logo { border-radius: 3px; background: var(--accent); }
${s} .stat-delta { color: var(--accent); }
`;
    },
  },
];
