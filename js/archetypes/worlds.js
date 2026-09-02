// Worlds & devices: design languages that come from a specific object or
// fiction — a starship console, a circuit board, a handheld LCD, a tarot
// deck, a country kitchen, a survey map, a letterman jacket. Each is built
// from that object's real material logic rather than a color preset.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const worlds = [

  // ----------------------------------------------------------------- lcars
  {
    id: "lcars",
    name: "LCARS Console",
    family: "future",
    traits: ["dark", "retro", "technical", "round"],
    blurb:
      "A starship computer console: pure black ground, thick pill-shaped bars of warm orange, peach, and lavender, an elbow-shaped frame bending around the content, condensed uppercase type, and numeric ID codes stamped on everything. No borders, no shadows, no gradients — just flat rounded blocks of color on black.",
    notes: [
      "The header is a thick solid accent bar with black text inside it and a large rounded lower-left corner; the footer mirrors it in the second accent with a rounded upper-right corner.",
      "The hero is framed by a tall rounded elbow block on its left (a 44px-wide pill-ended slab in the second accent) with an ID code like 'LCARS 47-2291' in mono above it.",
      "Cards are borderless near-black panels; each card title is a filled accent pill with black uppercase text, alternating between the two accents from card to card.",
      "Buttons are borderless pills — the primary in the main accent, the secondary in the second accent, both with black text; chips are dark rounded blocks in mono; nothing has a border or shadow.",
    ],
    conform(g, r) {
      const accent = pick(r, ["#ff9966", "#ffcc99", "#f7a05a"]);
      const accent2 = pick(r, ["#cc99cc", "#9999ff", "#c8a2e0"]);
      g.p = pal({
        bg: "#000000", ink: "#f2d4b4", accent, accent2,
        surface: "#0d0b0b", surface2: "#1a1414", border: "#1a1414", muted: "#b8977f", dark: true,
      });
      g.fonts = { display: "industrial", body: "grotesk", mono: "mono" };
      g.radius = 20; g.ctl = 999; g.bw = 0;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 700; g.track = 0.04;
      g.chart = "bars"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .topbar { background: var(--accent); color: #000; border-bottom: none; border-radius: 0 0 0 30px; padding-left: 44px; }
${s} .brand { color: #000; }
${s} .logo { background: #000; border-radius: 999px; width: 24px; height: 10px; }
${s} .topnav .nl { color: #000; opacity: .62; }
${s} .topnav .nl.on { color: #000; opacity: 1; }
${s} .topbar .btn-b { background: #000; color: var(--accent-text); border: none; }
${s} .hero { padding-left: 62px; position: relative; }
${s} .hero::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 44px; background: var(--accent2); border-radius: 22px 0 0 22px; }
${s} .hero::after { content: "LCARS 47-2291"; position: absolute; left: 0; top: -19px; font: 9px var(--f-mono); color: var(--accent2-text); letter-spacing: .14em; }
${s} .kicker { color: var(--accent2-text); font-family: var(--f-mono); letter-spacing: .16em; }
${s} .display { font-size: 46px; color: var(--ink); }
${s} .card { background: var(--surface2); border: none; box-shadow: none; }
${s} .card-t, ${s} .stat-label { background: var(--accent); color: #000; padding: 5px 14px; border-radius: 999px; font-size: 11px; letter-spacing: .1em; align-self: flex-start; text-transform: uppercase; font-weight: 700; }
${s} .card:nth-child(even) .card-t, ${s} .card:nth-child(even) .stat-label { background: var(--accent2); }
${s} .chip { background: #000; border: none; color: var(--ink); font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px; letter-spacing: .08em; }
${s} .btn { border: none; text-transform: uppercase; letter-spacing: .1em; font-size: 11.5px; padding: 9px 20px; font-weight: 700; }
${s} .btn-a { background: var(--accent); color: #000; box-shadow: none; }
${s} .btn-b { background: var(--accent2); color: #000; }
${s} .foot { border-top: none; background: var(--accent2); color: #000; border-radius: 0 30px 0 0; }
${s} .stat-num { color: var(--accent-text); font-family: var(--f-mono); }
${s} .stat-delta { color: var(--accent2-text); }
${s} .chart rect { fill: var(--accent); }
${s} .chart rect:nth-child(even) { fill: var(--accent2); }
${s} .tab.on, ${s} .stepper .on { border-color: var(--accent); }
${s} .status i { background: var(--accent); }
`;
    },
  },

  // ------------------------------------------------------------------- pcb
  {
    id: "pcb",
    name: "Circuit Board",
    family: "future",
    traits: ["technical", "dark", "grid", "dense"],
    blurb:
      "A printed circuit board: deep solder-mask green (or blue), faint copper traces running orthogonally and at 45° behind the layout, a dot grid of solder pads, white silkscreen labels in monospace (J1, U2, R12), and gold-tinned pads for the important buttons. Panels are components; the page is the board.",
    notes: [
      "The background carries low-contrast copper trace lines — thin orthogonal lines on a 64/88px rhythm plus a sparse 45° diagonal — over a dot-grid pad texture.",
      "Cards keep a 1px muted-copper border with 2px corners and a silkscreen reference (U1, U2, U3) stamped in the top-right corner in mono.",
      "Headings are white silkscreen: uppercase industrial sans at medium weight with .06em tracking; the kicker is a component designator ('J1 · …') in mono.",
      "The logo is a ringed solder pad; the primary button is a gold-tinned pad (goldenrod fill, dark text, 2px corners); chips are small copper-tinted pads in mono; the chart line is gold.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#0b3b2a", "#0a2f3b", "#123a1f"]);
      const copper = "#c97b4a";
      g.p = pal({
        bg, ink: "#e6f1ea", accent: "#d9a441", accent2: copper,
        surface: mix(bg, "#ffffff", 0.05), surface2: mix(bg, "#ffffff", 0.1), border: mix(copper, bg, 0.5), muted: "#9db8ab", dark: true,
      });
      g.fonts = { display: "industrial", body: "grotesk", mono: "mono" };
      g.radius = 2; g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = "dots";
      g.density = "dense";
      g.case = "upper"; g.hw = 600; g.track = 0.06;
      g.chart = among(r, g.chart, ["line", "bars-outline"]); g.chartGrid = "full";
    },
    css(s, g) {
      const cu = g.p.accent2;
      return `
${s} {
  background-image:
    repeating-linear-gradient(90deg, ${alpha(cu, 0.16)} 0 1px, transparent 1px 64px),
    repeating-linear-gradient(0deg, ${alpha(cu, 0.12)} 0 1px, transparent 1px 88px),
    repeating-linear-gradient(45deg, transparent 0 150px, ${alpha(cu, 0.14)} 150px 151px, transparent 151px 320px);
  background-color: var(--bg);
}
${s} .cards { counter-reset: pcb; }
${s} .card { position: relative; border-color: var(--border); counter-increment: pcb; }
${s} .card::after { content: "U" counter(pcb); position: absolute; top: 6px; right: 8px; font: 9px var(--f-mono); color: var(--muted); letter-spacing: .08em; pointer-events: none; }
${s} .kicker { font-family: var(--f-mono); color: var(--accent2-text); letter-spacing: .12em; }
${s} .kicker::before { content: "J1 · "; }
${s} .display { font-size: 40px; color: #ffffff; }
${s} .logo { border-radius: 50%; background: var(--accent2); box-shadow: inset 0 0 0 3px var(--bg), inset 0 0 0 5px var(--accent2); width: 16px; height: 16px; }
${s} .btn { border-radius: 2px; text-transform: uppercase; letter-spacing: .08em; font-size: 11.5px; font-family: var(--f-mono); }
${s} .btn-a { background: var(--accent); color: #1a1408; box-shadow: none; }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .chip { border: 1px solid var(--border); border-radius: 1px; font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px; color: var(--ink); background: ${alpha(cu, 0.14)}; }
${s} .stat-num { color: var(--accent-text); font-family: var(--f-mono); }
${s} .stat-delta { color: var(--accent2-text); }
${s} .topbar, ${s} .foot { border-color: var(--border); }
${s} .foot { font-family: var(--f-mono); font-size: 10px; letter-spacing: .06em; }
${s} .chart polyline { stroke: var(--accent); }
${s} .spark polyline { stroke: var(--accent); }
${s} .code-block { border-color: var(--border); }
`;
    },
  },

  // ----------------------------------------------------------- lcdhandheld
  {
    id: "lcdhandheld",
    name: "LCD Handheld",
    family: "retro",
    traits: ["retro", "gui", "monochrome"],
    blurb:
      "A 1989 handheld's reflective LCD: four shades of one green (or gray) from pale screen to near-black, a visible pixel grid over everything, chunky square panels with 2px dark outlines and hard offset shadows, blocky uppercase type, and a ▶ cursor beside the active item. No color, no gradients, no anti-aliasing pretence — just four tones behind a plastic bezel.",
    notes: [
      "Exactly four tones: the darkest is ink and accent, the lightest is the screen background, the two middles are surfaces, muted text, and shadows; there is no other color.",
      "A pixel-grid texture (1px dark lines every 4px in both directions at low opacity) covers the whole page.",
      "Panels and buttons have square corners and 2px outlines in the ink tone with a 5px hard offset shadow; the primary button is a filled ink block with light text; the current nav item and the kicker are prefixed by a ▶ cursor.",
      "The headline is a blocky ultra-heavy sans in uppercase with a 2px light offset shadow; charts are chunky solid ink bars; the stat number is set in mono with a leading zero like a score counter.",
    ],
    conform(g, r) {
      const green = chance(r, 0.7);
      g.p = green
        ? pal({ bg: "#9bbc0f", ink: "#0f380f", accent: "#0f380f", accent2: "#306230", surface: "#8bac0f", surface2: "#8bac0f", border: "#0f380f", muted: "#306230", dark: false })
        : pal({ bg: "#c4cbb2", ink: "#1e261e", accent: "#1e261e", accent2: "#4a5a4a", surface: "#b3bba2", surface2: "#b3bba2", border: "#1e261e", muted: "#4a5a4a", dark: false });
      g.fonts = { display: "black", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "hard"; g.texture = "none";
      g.density = "dense";
      g.case = "upper"; g.hw = 900; g.track = 0.04;
      g.chart = "bars"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s}::before {
  background-image: linear-gradient(${alpha(g.p.ink, 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(g.p.ink, 0.16)} 1px, transparent 1px);
  background-size: 4px 4px;
}
${s} .display { font-size: 38px; line-height: 1; text-shadow: 2px 2px 0 var(--surface); letter-spacing: .04em; }
${s} .kicker { font-family: var(--f-mono); color: var(--ink); letter-spacing: .1em; }
${s} .kicker::before { content: "▶ "; }
${s} .topnav .nl.on::before { content: "▶ "; }
${s} .sub { color: var(--muted); font-size: 13px; }
${s} .card { border: 2px solid var(--ink); background: var(--bg); box-shadow: 5px 5px 0 var(--muted); }
${s} .chip { border: 2px solid var(--ink); border-radius: 0; font-family: var(--f-mono); text-transform: uppercase; color: var(--ink); font-size: 9.5px; background: var(--bg); }
${s} .btn { border-radius: 0; border: 2px solid var(--ink); font-family: var(--f-mono); text-transform: uppercase; letter-spacing: .06em; box-shadow: 3px 3px 0 var(--muted); }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .btn-b { background: var(--bg); }
${s} .stat-num { font-family: var(--f-mono); }
${s} .stat-num::before { content: "0"; }
${s} .stat-delta { color: var(--ink); }
${s} .logo { border-radius: 0; background: var(--ink); }
${s} .topbar, ${s} .foot { border-color: var(--ink); border-width: 2px; }
${s} .foot { font-family: var(--f-mono); text-transform: uppercase; font-size: 10px; letter-spacing: .08em; color: var(--ink); }
${s} .chart rect { fill: var(--ink); }
${s} .spark polyline { stroke: var(--ink); }
${s} .status i, ${s} .avatar { border-radius: 0; }
${s} .media-block { border: 2px solid var(--ink); border-radius: 0; background: var(--surface); }
`;
    },
  },

  // ---------------------------------------------------------------- occult
  {
    id: "occult",
    name: "Celestial Almanac",
    family: "atmos",
    traits: ["dark", "ornate", "elegant", "pattern"],
    blurb:
      "A tarot deck crossed with an astronomer's almanac: deep indigo-black night, a scatter of tiny ivory stars, thin gold linework, a ringed eclipse sigil behind the hero, and a high-contrast serif set in wide-tracked small caps. Gold is the ink of ornament, ivory the ink of text. Mystic, hushed, expensive.",
    notes: [
      "The background is a star field: three layered radial-gradient dot patterns at different tile sizes and opacities — never noise or grain.",
      "A concentric sigil (three thin gold rings at inset offsets plus a translucent gold disc offset like an eclipse) sits behind the hero on the right.",
      "Cards keep a 1px muted-gold hairline border with 10px bracket ticks at two opposite corners drawn in the same border tone; corners are square, nothing casts a shadow, spacing is airy.",
      "The kicker is gold small-caps with .3em tracking flanked by ✦ glyphs; chips are hairline outlines in small caps; the primary button is a solid gold slab with indigo text; the logo is a ringed gold disc.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#100c24", "#0d0b1e", "#140a1c"]);
      const gold = pick(r, ["#d4af5a", "#c9a24f", "#dcb86a"]);
      g.p = pal({
        bg, ink: "#ece4cf", accent: gold, accent2: "#8f7bc4",
        surface: mix(bg, "#ffffff", 0.05), surface2: mix(bg, "#ffffff", 0.1), border: mix(gold, bg, 0.5), muted: "#a89e88", dark: true,
      });
      g.fonts = { display: "didone", body: "transitional", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "airy";
      g.case = "upper"; g.hw = 500; g.track = 0.16;
      g.chart = among(r, g.chart, ["line", "dots"]); g.chartGrid = "none";
    },
    css(s, g) {
      const star = alpha(g.p.ink, 0.75);
      const gold = g.p.accent;
      return `
${s} {
  background-image:
    radial-gradient(circle, ${star} 0 .7px, transparent 1.1px),
    radial-gradient(circle, ${alpha(g.p.ink, 0.5)} 0 .5px, transparent .9px),
    radial-gradient(circle, ${alpha(gold, 0.8)} 0 .9px, transparent 1.3px);
  background-size: 97px 83px, 131px 109px, 211px 173px;
  background-position: 0 0, 31px 47px, 61px 17px;
  background-color: var(--bg);
}
${s} .hero { position: relative; }
${s} .hero::before {
  content: ""; position: absolute; right: 40px; top: -26px; width: 180px; height: 180px; border-radius: 50%; z-index: 0;
  border: 1px solid ${alpha(gold, 0.7)};
  box-shadow: inset 0 0 0 14px transparent, inset 0 0 0 15px ${alpha(gold, 0.45)}, inset 0 0 0 34px transparent, inset 0 0 0 35px ${alpha(gold, 0.3)};
}
${s} .hero::after { content: ""; position: absolute; right: 96px; top: 30px; width: 72px; height: 72px; border-radius: 50%; background: var(--accent); opacity: .16; z-index: 0; }
${s} .hero > * { position: relative; z-index: 1; }
${s} .kicker { color: var(--accent-text); font-variant: small-caps; text-transform: none; letter-spacing: .3em; font-size: 12px; font-weight: 500; }
${s} .kicker::before { content: "✦ "; }
${s} .kicker::after { content: " ✦"; }
${s} .display { font-size: 36px; letter-spacing: .1em; line-height: 1.12; max-width: 18ch; }
${s} .card { border-color: var(--border); position: relative; }
${s} .card::before, ${s} .card::after { content: ""; position: absolute; width: 10px; height: 10px; border: 2px solid var(--border); pointer-events: none; }
${s} .card::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
${s} .card::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
${s} .chip { border-color: var(--border); color: var(--accent-text); font-variant: small-caps; text-transform: none; letter-spacing: .14em; border-radius: 0; font-size: 11px; }
${s} .btn { border-radius: 0; letter-spacing: .14em; text-transform: uppercase; font-size: 11px; }
${s} .btn-a { background: var(--accent); color: #17122b; box-shadow: none; }
${s} .btn-b { border-color: var(--border); color: var(--ink); }
${s} .stat-num { color: var(--accent-text); font-weight: 400; }
${s} .stat-delta { color: var(--accent2-text); }
${s} .logo { border-radius: 50%; background: transparent; border: 1px solid var(--accent); box-shadow: inset 0 0 0 3px var(--bg), inset 0 0 0 8px var(--accent); width: 16px; height: 16px; }
${s} .topbar, ${s} .foot { border-color: var(--border); }
${s} .foot { letter-spacing: .12em; text-transform: uppercase; font-size: 10px; }
${s} .chart polyline, ${s} .spark polyline { stroke: var(--accent); }
${s} .chart circle { fill: var(--accent); }
`;
    },
  },

  // --------------------------------------------------------------- gingham
  {
    id: "gingham",
    name: "Cottage Gingham",
    family: "soft",
    traits: ["soft", "warm", "natural", "friendly"],
    blurb:
      "A country kitchen: cream linen with a gingham check in one soft color woven across the whole page background, ivory cards with a jam-jar-label double frame, a friendly transitional serif with an italic lowercase kicker led by a ❀ flower, pressed-leaf sage as the second color, and pill buttons like preserve labels. Warm, homemade, unhurried.",
    notes: [
      "The page background is a gingham check: two crossing repeating-linear-gradients (0° and 90°) in the accent at ~13% opacity over cream, 18px cells; the header and footer sit on solid ivory so text stays clean.",
      "Cards are ivory with a 1px border plus an inset 1px inner rule 5px in (a jam-label frame), softly rounded 8px corners, and a small crisp lift shadow.",
      "The kicker is italic lowercase serif at 14px in the accent, prefixed by a ❀ glyph; headings are a transitional serif at weight 600 in sentence case.",
      "The primary button is a solid accent pill with white text; chips are pale accent tints with no border; the logo is a sage-green circle; charts are soft solid bars.",
    ],
    conform(g, r) {
      const accent = pick(r, ["#c6524f", "#3c7a9a", "#b3743a", "#7a5a9a"]);
      g.p = pal({
        bg: "#fbf5e8", ink: "#3b2f2a", accent, accent2: "#6f8f5a",
        surface: "#fffdf7", surface2: "#f3ecdc", border: "#cfc2ad", muted: "#7f6f66", dark: false,
      });
      g.fonts = { display: "transitional", body: "transitional", mono: "typewriter" };
      g.radius = 8; g.ctl = 999; g.bw = 1;
      g.shadow = "lifted"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 600; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "area"]);
    },
    css(s, g) {
      const a = g.p.accent;
      return `
${s} {
  background-image: repeating-linear-gradient(0deg, ${alpha(a, 0.13)} 0 9px, transparent 9px 18px), repeating-linear-gradient(90deg, ${alpha(a, 0.13)} 0 9px, transparent 9px 18px);
  background-color: var(--bg);
}
${s} .topbar, ${s} .foot { background: var(--surface); }
${s} .card { outline: 1px solid var(--border); outline-offset: -5px; }
${s} .kicker { font-style: italic; text-transform: none; letter-spacing: 0; font-size: 14px; font-weight: 400; color: var(--accent-text); }
${s} .kicker::before { content: "❀ "; font-style: normal; }
${s} .display { font-size: 44px; }
${s} .sub { color: var(--ink); opacity: .82; }
${s} .chip { background: ${alpha(a, 0.13)}; border-color: transparent; color: var(--ink); }
${s} .btn-a { color: #ffffff; }
${s} .btn-b { background: var(--surface); }
${s} .logo { border-radius: 50%; background: var(--accent2); }
${s} .stat-delta { color: var(--accent2-text); }
${s} .card-t { font-weight: 600; }
${s} .hero .field, ${s} .hero .stepper { background: var(--surface); }
`;
    },
  },

  // ---------------------------------------------------------- cartographer
  {
    id: "cartographer",
    name: "Survey Map",
    family: "heritage",
    traits: ["historic", "natural", "print", "elegant"],
    blurb:
      "An antique survey map: aged parchment, sepia ink, faint concentric contour lines rippling across the background, a dotted route with coordinates in the kicker, a compass rose beside the headline, small-caps place-name labels with open tracking, and legend boxes framed by a double rule. Scholarly, travelled, faintly romantic.",
    notes: [
      "The background carries two sets of faint concentric contour rings (repeating-radial-gradients in sepia at ≤8% opacity) over a fibrous paper texture.",
      "A compass rose — a double-ringed circle with crosshairs and an N in the accent — sits behind the hero on the right, drawn entirely with pseudo-elements.",
      "Cards are legend boxes: parchment fill, a 1px sepia border with an inset 1px inner rule, square corners, no shadow; titles and chips are small caps with open tracking.",
      "The kicker is typewriter face carrying coordinates ('47°36′N 122°20′W') and a dotted route in vermilion; route lines in charts and sparklines are dashed; the primary button is a solid sepia stamp with parchment text.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#ecdcb9", "#e7d4ad", "#f0e2c4"]);
      const ink = "#4a2e1a";
      g.p = pal({
        bg, ink, accent: "#8b3a2a", accent2: "#5e7a5a",
        surface: mix(bg, "#ffffff", 0.3), surface2: mix(bg, ink, 0.06), border: mix(bg, ink, 0.45), muted: "#7a5c42", dark: false,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "fibers";
      g.density = "normal";
      g.case = "none"; g.hw = 500; g.track = 0.02;
      g.chart = "line"; g.chartTreatment = "engraved"; g.chartGrid = "baseline";
    },
    css(s, g) {
      const ink = g.p.ink;
      return `
${s} {
  background-image:
    repeating-radial-gradient(circle at 78% 28%, transparent 0 22px, ${alpha(ink, 0.08)} 22px 23px),
    repeating-radial-gradient(circle at 14% 88%, transparent 0 30px, ${alpha(ink, 0.06)} 30px 31px);
  background-color: var(--bg);
}
${s} .hero { position: relative; }
${s} .hero::after {
  content: "N"; position: absolute; right: 34px; top: -12px; width: 96px; height: 96px; border-radius: 50%; z-index: 0;
  border: 1px solid ${alpha(ink, 0.8)}; outline: 1px solid ${alpha(ink, 0.6)}; outline-offset: -8px;
  display: grid; place-items: start center; padding-top: 10px; font: 600 11px var(--f-display); color: var(--accent-text);
  background: linear-gradient(${alpha(ink, 0.6)}, ${alpha(ink, 0.6)}) center / 1px 100% no-repeat, linear-gradient(${alpha(ink, 0.6)}, ${alpha(ink, 0.6)}) center / 100% 1px no-repeat;
}
${s} .hero > * { position: relative; z-index: 1; }
${s} .kicker { font-family: var(--f-mono); color: var(--muted); text-transform: none; letter-spacing: .06em; font-weight: 400; font-size: 11.5px; }
${s} .kicker::before { content: "47°36′N 122°20′W  · · · · · ·  "; color: var(--accent-text); }
${s} .display { font-variant: small-caps; letter-spacing: .04em; font-size: 46px; }
${s} .card { border: 1px solid var(--border); outline: 1px solid var(--border); outline-offset: -5px; background: var(--surface); }
${s} .card-t { font-variant: small-caps; letter-spacing: .06em; font-size: 16px; }
${s} .chip { border: none; font-variant: small-caps; letter-spacing: .12em; font-size: 12px; color: var(--ink); padding: 0 6px; }
${s} .btn { border-radius: 0; font-variant: small-caps; letter-spacing: .08em; }
${s} .btn-a { background: var(--ink); color: var(--bg); box-shadow: none; }
${s} .btn-b { border-color: var(--ink); }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: inset 0 0 0 2px var(--bg), inset 0 0 0 3px var(--ink); width: 15px; height: 15px; }
${s} .stat-num { color: var(--accent-text); font-weight: 500; }
${s} .stat-delta { color: var(--accent2-text); }
${s} .topbar, ${s} .foot { border-color: var(--ink); }
${s} .foot { font-variant: small-caps; letter-spacing: .1em; }
${s} .spark polyline { stroke: var(--accent); stroke-dasharray: 3 3; }
${s} .chart polyline { stroke-dasharray: 4 3; }
`;
    },
  },

  // --------------------------------------------------------------- varsity
  {
    id: "varsity",
    name: "Varsity Letterman",
    family: "pop",
    traits: ["retro", "bold", "playful", "chunky"],
    blurb:
      "Collegiate athletics: cream jersey ground, navy ink and one team color, chunky uppercase slab-serif headlines outlined in a contrasting stitch color like chenille patch letters, a pennant-shaped kicker, a numbered jersey badge as the logo, and thick-bordered patch-like cards with hard offset shadows. Loud school spirit with letterman-jacket warmth.",
    notes: [
      "Headlines are heavy uppercase slab serif with a layered text-shadow outline in the second team color so they read like stitched felt letters.",
      "The kicker is a pennant: a solid accent block with a notched right end (clip-path) and counter-colored uppercase text with .12em tracking.",
      "Cards are patches: 3px navy borders, 14px rounded corners, and a hard 5px offset shadow; the header and footer rules are 3px navy.",
      "The logo is a round jersey badge (accent fill, 2px navy ring, a bold number inside); chips are gold pills with 2px navy borders in bold uppercase; the primary button is a solid accent slab with a 3px navy border and offset shadow.",
    ],
    conform(g, r) {
      const navy = "#1e2a4a";
      const accent = pick(r, ["#b8322f", "#1d6f3a", "#3c4fa3", "#c2571f"]);
      g.p = pal({
        bg: "#f4ead6", ink: navy, accent, accent2: "#e2b53a",
        surface: "#fbf6ea", surface2: "#efe4cd", border: navy, muted: "#5b5f70", dark: false,
      });
      g.fonts = { display: "slab", body: "humanist", mono: "mono" };
      g.radius = 14; g.ctl = 999; g.bw = 3;
      g.shadow = "hard"; g.texture = "none";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = 0.02;
      g.chart = "bars";
    },
    css(s, g) {
      const on = onColor(g.p.accent);
      const stitch = g.p.accent2;
      return `
${s} .display { font-size: 48px; text-shadow: 2px 2px 0 ${stitch}, -1px -1px 0 ${stitch}, 1px -1px 0 ${stitch}, -1px 1px 0 ${stitch}; letter-spacing: .03em; line-height: 1; }
${s} .kicker { background: var(--accent); color: ${on}; padding: 4px 22px 4px 12px; clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%); align-self: flex-start; letter-spacing: .12em; }
${s} .card { border: 3px solid var(--ink); }
${s} .chip { background: var(--accent2); color: var(--ink); border: 2px solid var(--ink); font-weight: 800; text-transform: uppercase; font-size: 10px; }
${s} .logo { border-radius: 50%; width: 22px; height: 22px; border: 2px solid var(--ink); background: var(--accent); position: relative; }
${s} .logo::after { content: "8"; position: absolute; inset: 0; display: grid; place-items: center; font: 900 10px/1 var(--f-display); color: ${on}; }
${s} .btn { border: 3px solid var(--ink); font-family: var(--f-display); font-weight: 900; text-transform: uppercase; letter-spacing: .06em; box-shadow: 3px 3px 0 var(--ink); }
${s} .btn-a { color: ${on}; }
${s} .btn-b { background: var(--surface); }
${s} .stat-num { color: var(--accent-text); text-shadow: 1.5px 1.5px 0 var(--ink); }
${s} .stat-delta { color: var(--ink); }
${s} .topbar, ${s} .foot { border-color: var(--ink); border-width: 3px; }
${s} .card-t { letter-spacing: .04em; }
${s} .foot { font-weight: 700; text-transform: uppercase; letter-spacing: .06em; font-size: 11px; color: var(--ink); }
`;
    },
  },
];
