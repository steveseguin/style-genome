// Atmos family: styles built from light, air, and mood — cinema, libraries,
// instrument panels, and lit signage. Each one leans on a single strong
// atmospheric device (a beam, a book plate, a readout, a glowing tube).

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const atmos = [

  // ------------------------------------------------------------------- noir
  {
    id: "noir",
    name: "Film Noir",
    family: "atmos",
    traits: ["dark", "elegant", "highcontrast"],
    blurb:
      "Black-and-white cinema at 2am: a near-black ground, silver ink, and charcoal cards, with a single diagonal shaft of light raking across the whole frame like a projector beam through a smoky room. Venetian-blind shadows fall over everything. The headline is a didone italic title card in bright white; the only color anywhere is one restrained crimson on the rising figure. Dramatic, monochrome, and expensive.",
    notes: [
      "The world is strictly grayscale — near-black bg, silver ink, charcoal surfaces — except one crimson reserved solely for the stat delta text.",
      "::after paints a soft diagonal light beam (a 115deg white gradient band) across the entire composition, sitting behind the content.",
      "The 'lines' texture reads as horizontal venetian-blind shadows laid over the frame.",
      "Display is a large white didone italic at light weight (a title card); the kicker is a tiny silver uppercase label with wide .25em tracking; cards keep hairline borders, near-square corners, and deep soft shadows.",
    ],
    conform(g, r) {
      const crimson = pick(r, ["#b3121f", "#a80f1e", "#bf1526"]);
      g.p = pal({
        bg: "#0a0a0b", ink: "#dcdce0", accent: crimson, accent2: "#8c8d93",
        surface: "#161619", surface2: "#1e1e22", border: "#2c2c31", muted: "#82838a", dark: true,
      });
      g.fonts = { display: "didone", body: pick(r, ["transitional", "humanist"]), mono: "mono" };
      g.radius = pick(r, [0, 2]); g.ctl = 0; g.bw = 1;
      g.shadow = "soft"; g.texture = "lines";
      g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = irange(r, 400, 500); g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s}::after {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, ${alpha("#ffffff", 0.05)} 42%, ${alpha("#ffffff", 0.09)} 50%, ${alpha("#ffffff", 0.05)} 58%, transparent 70%);
}
${s} .topbar, ${s} .smain, ${s} .foot { z-index: 2; }
${s} .display { font-style: italic; font-weight: 400; font-size: 52px; line-height: 1.04; color: #f5f5f7; }
${s} .kicker { color: #b9bac0; letter-spacing: .25em; font-size: 10px; }
${s} .sub { color: var(--muted); }
${s} .card { border-color: var(--border); box-shadow: 0 18px 42px rgba(0,0,0,.62); }
${s} .card-t { font-weight: 500; letter-spacing: .02em; }
${s} .chip { border-color: var(--border); color: var(--muted); }
${s} .btn-a { background: #e9e9ed; color: #0a0a0b; box-shadow: none; }
${s} .btn-b { border-color: #46464c; color: var(--ink); }
${s} .stat-num { color: #ededf0; font-weight: 500; }
${s} .stat-delta { color: var(--accent); }
${s} .spark polyline { stroke: #c9cace; }
${s} .chart polyline { stroke: #d7d8dc; }
${s} .chart circle { fill: #d7d8dc; }
${s} .brand { letter-spacing: .04em; }
${s} .topnav .nl.on { color: #f2f2f4; }
${s} .logo { border-radius: 0; background: linear-gradient(135deg, #f1f1f3, #9a9ba1); }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ------------------------------------------------------------ darkacademia
  {
    id: "darkacademia",
    name: "Dark Academia",
    family: "atmos",
    traits: ["dark", "scholarly", "warm"],
    blurb:
      "A midnight library carrel: deep espresso-brown ground with a fine grain, parchment-tan ink, oxblood and antique brass accents. Cards read as old book plates — a slightly lighter leather surface enclosed by an inset hairline frame, exactly like the gilt rule stamped inside a cover. Everything speaks in an oldstyle serif; the kicker is a hushed italic lowercase catalogue line, and chips are typewritten reference tags. Heavy, layered, brown-on-brown, and bookish.",
    notes: [
      "The palette is layered warm brown — espresso ground, leather surfaces, parchment ink — with oxblood as the primary accent and antique brass as the second.",
      "Each card gets an inner book-plate frame via .card::before: absolutely positioned at inset 6px, a 1px border in the border token, pointer-events none.",
      "Type is an oldstyle serif everywhere; the kicker is italic lowercase, the display sits at weight 500 in normal case, and chips use a typewriter face with hairline borders.",
      "The primary button is an oxblood slab with parchment text; the chart line and stat delta are drawn in antique brass; grain texture over all.",
    ],
    conform(g, r) {
      const oxblood = pick(r, ["#7a2622", "#6f2320", "#83302a"]);
      const brass = pick(r, ["#b58f4d", "#c0a15c", "#aa8740"]);
      const ground = pick(r, ["#241a12", "#26190f", "#221813"]);
      g.p = pal({
        bg: ground, ink: "#e7d6b2", accent: oxblood, accent2: brass,
        surface: mix(ground, "#e7d6b2", 0.07), surface2: mix(ground, "#e7d6b2", 0.12),
        border: mix(ground, "#e7d6b2", 0.22), muted: "#ab9873", dark: true,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = pick(r, [2, 3]); g.ctl = 3; g.bw = 1;
      g.shadow = among(r, g.shadow, ["soft", "lifted"]); g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 500; g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .card { position: relative; background: var(--surface); }
${s} .card::before {
  content: ""; position: absolute; inset: 6px; border: 1px solid var(--border);
  border-radius: 1px; pointer-events: none;
}
${s} .kicker { font-style: italic; text-transform: lowercase; letter-spacing: .01em; font-weight: 400; font-size: 13px; color: var(--accent2); }
${s} .display { font-weight: 500; font-size: 46px; line-height: 1.08; }
${s} .sub { color: var(--muted); }
${s} .card-t { font-weight: 500; font-size: 16px; }
${s} .chip {
  font-family: var(--f-mono); font-size: 10.5px; letter-spacing: .04em;
  border: 1px solid var(--border); border-radius: 0; background: transparent; color: var(--muted);
}
${s} .btn-a { background: var(--accent); color: #ecdcb8; box-shadow: var(--shadow-btn); }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .stat-num { color: var(--ink); font-weight: 500; }
${s} .stat-delta { color: var(--accent2); }
${s} .spark polyline { stroke: var(--accent2); }
${s} .chart polyline { stroke: var(--accent2); }
${s} .chart circle { fill: var(--accent2); }
${s} .logo { border-radius: 50%; background: var(--accent2); }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ---------------------------------------------------------------- cassette
  {
    id: "cassette",
    name: "Cassette Futurism",
    family: "atmos",
    traits: ["retro", "technical", "warm"],
    blurb:
      "NASA-punk hardware, the Nostromo bridge: warm beige plastic panels, dark-brown ink, safety-orange and avocado accents. Cards are molded modules with heavy 2px outlines, softly rounded corners, and a little cut-in vent grille beside each title. The topbar is a control strip; buttons are chunky tape-deck keys that sit on a hard bottom edge like a pressed switch. The headline stat glows as an amber readout on a recessed dark chip. Instruments, not decoration.",
    notes: [
      "Cards are beige plastic modules: surface fill, 2px ink outlines, radius 8, and a hard 3px bottom shadow in ink; each title carries a small vent detail (repeating horizontal ink lines) at its top-right via .card-t::after.",
      "The topbar is a control strip in surface2 with a monospace, wide-tracked, uppercase brand; labels throughout are uppercase mono.",
      "Buttons are tape-deck keys — radius 6, chunky padding, a solid 3px ink bottom shadow (pressed key), with the primary key filled safety orange.",
      "The stat number is an amber LED readout: monospace and letter-spaced, in amber on a dark recessed chip with an inset shadow; chart bars are flat orange and avocado.",
    ],
    conform(g, r) {
      const orange = pick(r, ["#e0651a", "#d95f1e", "#e26a15"]);
      const avocado = pick(r, ["#7c802f", "#84863a", "#79812c"]);
      g.p = pal({
        bg: "#d8ccae", ink: "#2f2619", accent: orange, accent2: avocado,
        surface: "#cec2a2", surface2: "#c2b693", border: "#9a8d6c", muted: "#6c6047", dark: false,
      });
      g.fonts = { display: pick(r, ["industrial", "grotesk"]), body: "grotesk", mono: "mono" };
      g.radius = 8; g.ctl = 6; g.bw = 2;
      g.shadow = "hard"; g.texture = among(r, g.texture, ["none", "grain"]);
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 700; g.track = 0.02;
      g.chart = "bars";
    },
    css(s, g) {
      const vent = `repeating-linear-gradient(180deg, ${alpha(g.p.ink, 0.28)} 0 2px, transparent 2px 5px)`;
      return `
${s} .card { border-color: var(--ink); background: var(--surface); box-shadow: 0 3px 0 ${alpha(g.p.ink, 0.55)}; }
${s} .card-t { position: relative; padding-right: 52px; font-family: var(--f-mono); font-size: 12px; letter-spacing: .08em; }
${s} .card-t::after { content: ""; position: absolute; top: 2px; right: 0; width: 40px; height: 10px; background: ${vent}; }
${s} .display { font-size: 44px; letter-spacing: .01em; }
${s} .kicker { font-family: var(--f-mono); color: var(--accent); letter-spacing: .12em; }
${s} .sub { color: var(--muted); }
${s} .topbar { background: var(--surface2); border-bottom-color: var(--ink); }
${s} .brand { font-family: var(--f-mono); letter-spacing: .12em; }
${s} .btn { border-radius: 6px; padding: 10px 18px; border-color: var(--ink); box-shadow: 0 3px 0 ${g.p.ink}; font-family: var(--f-mono); letter-spacing: .06em; }
${s} .btn-a { background: var(--accent); color: #241c10; }
${s} .btn-b { background: var(--surface2); color: var(--ink); }
${s} .stat-label { font-family: var(--f-mono); }
${s} .stat-num {
  align-self: flex-start; font-family: var(--f-mono); font-size: 26px; letter-spacing: .06em;
  background: #1c160d; color: #f0a828; border-radius: 4px; padding: 4px 12px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,.6);
}
${s} .stat-delta { font-family: var(--f-mono); color: var(--accent2); font-size: 11px; }
${s} .chip { border-radius: 3px; border: 1px solid var(--ink); background: var(--surface2); color: var(--ink); font-family: var(--f-mono); font-size: 10px; }
${s} .foot { border-top-color: var(--ink); font-family: var(--f-mono); text-transform: uppercase; font-size: 10.5px; letter-spacing: .06em; }
${s} .logo { border-radius: 2px; background: var(--accent); }
`;
    },
  },

  // ---------------------------------------------------------------- neonsign
  {
    id: "neonsign",
    name: "Neon Sign",
    family: "atmos",
    traits: ["dark", "neon", "retro"],
    blurb:
      "The view through a bar window after midnight: a very dark warm-black room with faint grain, quiet charcoal cards, and two lit signs doing all the talking. The headline is a bent-glass neon tube — a script face flooded with a hot color and wrapped in layered halo glow. A second, cooler tube handles the kicker. Buttons are unlit neon outlines that pick up a faint colored charge. Everything else stays dim so the tubes carry the room.",
    notes: [
      "The display heading is the neon tube: a script face colored in a hot accent (pink, red, or blue chosen at random) with layered tube glow — 6px, 18px, and 42px text-shadows in decreasing accent alpha.",
      "The kicker is a second, smaller tube in the cooler accent2 (cyan or warm-white) with its own reduced glow.",
      "Buttons are neon outlines: transparent fill, a 1.5px alpha-white border, accent-colored text with a small glow; the primary button glows slightly stronger.",
      "The rest of the room stays quiet and dark — charcoal cards, dim ink — while the chart line and logo carry a faint colored glow via drop-shadow.",
    ],
    conform(g, r) {
      const acc = pick(r, ["#ff3d9a", "#ff3b3b", "#3d7bff"]);
      const acc2 = pick(r, ["#57e2e6", "#ffe0b0"]);
      const ground = pick(r, ["#0e0b09", "#100c0a", "#0d0a0a"]);
      g.p = pal({
        bg: ground, ink: "#cbc4b8", accent: acc, accent2: acc2,
        surface: mix(ground, "#ffffff", 0.06), surface2: mix(ground, "#ffffff", 0.1),
        border: mix(ground, "#ffffff", 0.16), muted: "#8b8478", dark: true,
      });
      g.fonts = { display: "script", body: "humanist", mono: "mono" };
      g.radius = 6; g.ctl = 6; g.bw = 1;
      g.shadow = "glow"; g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 400; g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .display {
  font-family: var(--f-display); font-weight: 400; font-size: 54px; line-height: 1.1; color: var(--accent);
  text-shadow: 0 0 6px ${alpha(g.p.accent, 0.9)}, 0 0 18px ${alpha(g.p.accent, 0.55)}, 0 0 42px ${alpha(g.p.accent, 0.3)};
}
${s} .kicker {
  font-family: var(--f-display); text-transform: none; font-size: 16px; letter-spacing: .02em; color: var(--accent2);
  text-shadow: 0 0 5px ${alpha(g.p.accent2, 0.8)}, 0 0 14px ${alpha(g.p.accent2, 0.4)};
}
${s} .sub { color: var(--muted); }
${s} .btn { background: transparent; border: 1.5px solid ${alpha("#ffffff", 0.28)}; color: var(--accent); box-shadow: none; text-shadow: 0 0 6px ${alpha(g.p.accent, 0.6)}; }
${s} .btn-a {
  border-color: ${alpha("#ffffff", 0.5)}; text-shadow: 0 0 8px ${alpha(g.p.accent, 0.85)};
  box-shadow: 0 0 16px ${alpha(g.p.accent, 0.35)}, inset 0 0 10px ${alpha(g.p.accent, 0.12)};
}
${s} .card { background: var(--surface); border-color: var(--border); box-shadow: none; }
${s} .card-t { color: var(--ink); font-weight: 600; }
${s} .chip { border-color: var(--border); color: var(--muted); }
${s} .stat-num { color: var(--ink); }
${s} .stat-delta { color: var(--accent2); text-shadow: 0 0 8px ${alpha(g.p.accent2, 0.5)}; }
${s} .spark polyline { stroke: var(--accent); }
${s} .spark { filter: drop-shadow(0 0 3px ${alpha(g.p.accent, 0.7)}); }
${s} .chart polyline { stroke: var(--accent); }
${s} .chart circle { fill: var(--accent); }
${s} .chart { filter: drop-shadow(0 0 3px ${alpha(g.p.accent, 0.8)}); }
${s} .topnav .nl.on { color: var(--ink); }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px ${alpha(g.p.accent, 0.9)}, 0 0 16px ${alpha(g.p.accent, 0.5)}; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },
];
