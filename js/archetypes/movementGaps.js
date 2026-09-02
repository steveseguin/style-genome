// Major historic and graphic-design movements not covered by the original set.
// Kept in a standalone module so the registry can adopt the set atomically.

import { pick, chance } from "../rng.js";
import { alpha, mix } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const movementGaps = [
  {
    id: "victorianengraving",
    name: "Victorian Engraving",
    family: "heritage",
    traits: ["historic", "ornate", "print"],
    blurb:
      "A nineteenth-century illustrated gazette rendered in steel-engraved ink: warm ivory stock, dense black linework, tiny cross-hatched shadows, formal serif typography, double-rule frames, and restrained burgundy rubrication. Decoration is built from pressure, line density, and engraved ornament rather than modern gradients or soft UI effects.",
    notes: [
      "Panels use double ink rules with clipped ornamental corners and small centered lozenges, like plates set into a Victorian specimen book.",
      "The display is a tightly composed engraved serif with a fine offset highlight; the standfirst begins with a large decorated drop cap.",
      "The page carries faint diagonal cross-hatching and paper fiber, while controls remain square, formal, and ink-outlined.",
      "Charts use black cross-hatching with an ink outline, a baseline only, and no colored fill; burgundy is reserved for small rubric labels and deltas.",
    ],
    conform(g, r) {
      const rubric = pick(r, ["#7b2027", "#6f2730", "#82322c"]);
      g.p = pal({
        bg: "#eee5cf", ink: "#211c16", accent: rubric, accent2: "#51463a",
        surface: "#f5eddc", surface2: "#e7dcc4", border: "#493f33", muted: "#665b4d", dark: false,
      });
      g.fonts = { display: "transitional", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "engraved"; g.density = "dense";
      g.case = "none"; g.hw = 700; g.track = 0.01;
      g.chart = "bars"; g.chartTreatment = "crosshatch"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background-color: var(--bg); }
${s} .topbar, ${s} .foot { border-color: var(--ink); border-style: double; border-width: 3px 0; }
${s} .display { font-size: 44px; text-shadow: 0 1px 0 rgba(255,255,255,.75); }
${s} .sub::first-letter { float: left; font: 700 46px/.78 var(--f-display); padding: 7px 8px 0 0; color: var(--accent); }
${s} .kicker { color: var(--accent); letter-spacing: .18em; }
${s} .card { position: relative; border: 3px double var(--ink); background: ${alpha(g.p.surface, 0.84)}; }
${s} .card::after { content: "◆"; position: absolute; top: -8px; left: calc(50% - 8px); background: var(--surface); padding: 0 4px; color: var(--ink); font-size: 9px; }
${s} .card-t { text-align: center; font-variant: small-caps; letter-spacing: .05em; }
${s} .chip { border: 1px solid var(--ink); border-radius: 0; font-variant: small-caps; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .btn-b { border-color: var(--ink); }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 2px var(--bg), 0 0 0 3px var(--ink); }
`;
    },
  },

  {
    id: "gothicblackletter",
    name: "Gothic Blackletter",
    family: "heritage",
    traits: ["historic", "ornate", "dark"],
    blurb:
      "A late-medieval blackletter page translated into an interface: soot-black textura headings, parchment or midnight vellum, pointed tracery, rubric red, and sparing manuscript gold. The rhythm is vertical, ceremonial, and architectural—narrow letterforms, framed fields, quatrefoil marks, and rules that feel cut from a cathedral screen.",
    notes: [
      "Display type should read as textura or Fraktur; the live design uses an installed blackletter face when available and an old-style serif fallback.",
      "Cards use pointed clipped corners inside double rules, with a small quatrefoil-like ornament centered above each title.",
      "Rubric red marks kickers and status; antique gold is restricted to the logo, fine title ornaments, and occasional data emphasis.",
      "Charts are narrow engraved columns with baseline-only axes, echoing manuscript marginal tallies rather than a modern dashboard.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.3);
      g.p = dark
        ? pal({ bg: "#18130f", ink: "#eee2c7", accent: "#b53a32", accent2: "#c09a42", surface: "#241c16", surface2: "#30251d", border: "#776346", muted: "#b2a387", dark: true })
        : pal({ bg: "#efe3c7", ink: "#201912", accent: "#9e2c28", accent2: "#9b742a", surface: "#f5ead2", surface2: "#e5d5b5", border: "#6b5638", muted: "#675a46", dark: false });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "paper"; g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0.02;
      g.chart = "bars"; g.chartTreatment = "engraved"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .display { font-family: "Old English Text MT", "UnifrakturMaguntia", var(--f-display); font-size: 48px; line-height: 1.02; letter-spacing: .015em; }
${s} .brand { font-family: "Old English Text MT", var(--f-display); font-size: 17px; }
${s} .topbar, ${s} .foot { border-color: var(--border); border-style: double; border-width: 0 0 3px; }
${s} .foot { border-width: 3px 0 0; }
${s} .kicker { color: var(--accent); letter-spacing: .22em; }
${s} .card { border: 3px double var(--border); clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px); }
${s} .card-t { text-align: center; }
${s} .card-t::before { content: "✦ "; color: var(--accent2); }
${s} .chip { border-radius: 0; border-color: var(--border); }
${s} .btn-a { background: var(--accent); color: #fff4dc; }
${s} .btn-b { border: 3px double var(--border); }
${s} .stat-num { color: var(--accent2); font-family: var(--f-display); }
${s} .logo { border-radius: 50% 0 50% 0; background: var(--accent2); transform: rotate(45deg); }
`;
    },
  },

  {
    id: "artscrafts",
    name: "Arts & Crafts",
    family: "heritage",
    traits: ["natural", "ornate", "print"],
    blurb:
      "William Morris-era Arts and Crafts: hand-blocked vines, flattened leaves, medievally sturdy serif type, vegetable-dyed green and madder red, and honest cream paper. Ornament and utility are inseparable; repeating botanical structure frames the page while panels remain readable, symmetrical, and visibly made by hand.",
    notes: [
      "A low-contrast interlocking leaf-and-berry repeat covers the ground like hand-blocked wallpaper, using only green and madder ink.",
      "Cards are cream reading panels with dark green double rules, squared corners, and tiny leaf ornaments rather than shadows.",
      "Headings use a sturdy old-style serif with modest small-cap labels; nothing is glossy, geometric-modern, or digitally perfect.",
      "Data marks use rough flat ink over a baseline, with alternating vegetable-dye colors and no modern grid box.",
    ],
    conform(g, r) {
      const green = pick(r, ["#496141", "#405a42", "#566744"]);
      g.p = pal({
        bg: "#eee4c9", ink: "#29261d", accent: green, accent2: "#8b3f35",
        surface: "#f5ecd5", surface2: "#e2d6b8", border: "#596148", muted: "#69604d", dark: false,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = "fibers"; g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = 600; g.track = 0.01;
      g.chart = "bars"; g.chartTreatment = "rough"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background-color: var(--bg); background-image: radial-gradient(ellipse at 25% 50%, ${alpha(g.p.accent, .1)} 0 4px, transparent 5px), radial-gradient(ellipse at 75% 50%, ${alpha(g.p.accent2, .09)} 0 3px, transparent 4px); background-size: 34px 24px; }
${s} .topbar, ${s} .foot { border-color: var(--accent); border-style: double; border-width: 0 0 3px; }
${s} .foot { border-width: 3px 0 0; }
${s} .display { font-size: 43px; color: var(--ink); }
${s} .kicker { color: var(--accent2); font-variant: small-caps; letter-spacing: .14em; }
${s} .card { border: 3px double var(--accent); background: ${alpha(g.p.surface, .95)}; }
${s} .card-t { text-align: center; color: var(--accent); }
${s} .card-t::after { content: " ❧"; color: var(--accent2); }
${s} .chip { border-radius: 0; border-color: var(--accent); background: var(--surface2); }
${s} .btn-a { background: var(--accent); color: #fff8e9; }
${s} .btn-b { border-color: var(--accent); }
${s} .chart rect:nth-of-type(even) { fill: var(--accent2); }
${s} .logo { background: var(--accent2); border-radius: 50% 0; transform: rotate(45deg); }
`;
    },
  },

  {
    id: "futurism",
    name: "Italian Futurism",
    family: "heritage",
    traits: ["bold", "geometric", "print"],
    blurb:
      "Italian Futurism as kinetic typography: cream paper split by black speed lines, vermilion wedges, diagonal baselines, repeated letterforms, and an industrial headline lunging forward in space. The design communicates velocity and mechanical force through skew, scale collision, radiating vectors, and abrupt changes of typographic direction.",
    notes: [
      "A fan of thin black speed lines and one solid vermilion wedge radiates from the lower-right hero edge.",
      "The display is condensed, uppercase, italicized by skew, with a faint repeated word echo trailing behind it.",
      "Cards stagger diagonally with hard black rules and clipped corners; labels behave like terse manifesto fragments.",
      "The chart uses rough rising bars with baseline-only axes, reinforcing acceleration rather than neutral reporting.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#eee4ce", ink: "#15120e", accent: "#cc2b20", accent2: "#3b3a35", surface: "#f5edda", surface2: "#e1d4bc", border: "#15120e", muted: "#5d5548", dark: false });
      g.fonts = { display: "industrial", body: "grotesk", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = among(r, g.texture, ["none", "paper"]); g.density = "dense";
      g.case = "upper"; g.hw = 800; g.track = -0.01;
      g.chart = "bars"; g.chartTreatment = "rough"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; transform: skewY(-1deg); }
${s} .hero::after { content: ""; position: absolute; inset: -20px -30px -90px 44%; z-index: -1; background: repeating-conic-gradient(from -18deg at 100% 100%, transparent 0 8deg, ${alpha(g.p.ink,.25)} 8deg 8.7deg, transparent 8.7deg 15deg), linear-gradient(145deg, transparent 0 53%, ${alpha(g.p.accent,.82)} 53% 68%, transparent 68%); }
${s} .smain { z-index: 2; }
${s} .display { font-size: 58px; line-height: .88; transform: skewX(-10deg); text-shadow: 8px 3px 0 ${alpha(g.p.accent,.25)}; }
${s} .kicker { align-self: flex-start; background: var(--accent); color: #fff; padding: 4px 12px; transform: rotate(-3deg); }
${s} .cards { transform: skewY(-1deg); }
${s} .card { border-color: var(--ink); clip-path: polygon(0 0, 96% 0, 100% 12px, 100% 100%, 4% 100%, 0 calc(100% - 12px)); }
${s} .card:nth-child(2) { transform: translateY(-7px); }
${s} .card:nth-child(3) { transform: translateY(-14px); }
${s} .chip, ${s} .btn { border-radius: 0; border-color: var(--ink); }
${s} .btn-a { background: var(--accent); color: #fff; }
${s} .stat-num { color: var(--accent); transform: skewX(-8deg); }
${s} .logo { border-radius: 0; background: var(--accent); clip-path: polygon(0 25%, 100% 0, 70% 100%); }
`;
    },
  },

  {
    id: "dada",
    name: "Dada Collage",
    family: "heritage",
    traits: ["raw", "playful", "print"],
    blurb:
      "Berlin and Zurich Dada in cut type and printer's debris: mismatched type families, pasted black labels, red proof marks, rotated fragments, arbitrary rules, and deliberately unstable hierarchy on cheap gray paper. It is anti-polish with intellectual bite—assembled, interrupted, and visibly resistant to a single orderly grid.",
    notes: [
      "Headline words behave like separate cut slips through cloned black backgrounds, mixed scale, and a slight rotation.",
      "Cards tilt independently and alternate between outlined paper, inverted black, and red-stamped treatments.",
      "Rules, × marks, proof symbols, and a large off-register circle interrupt the composition without becoming generic confetti.",
      "Charts use rough outlined bars over no grid, like a statistical clipping pasted into the collage.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#e8e5de", ink: "#111111", accent: "#c52b28", accent2: "#5d5a55", surface: "#f7f5ef", surface2: "#d8d4ca", border: "#111111", muted: "#55514b", dark: false });
      g.fonts = { display: pick(r, ["black", "industrial", "typewriter"]), body: "typewriter", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "hard"; g.texture = "grain"; g.density = "dense";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 900; g.track = 0;
      g.chart = "bars-outline"; g.chartTreatment = "rough"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; transform: rotate(-.6deg); }
${s} .hero::after { content: "×"; position: absolute; right: 50px; top: -25px; font: 900 120px/1 var(--f-display); color: ${alpha(g.p.accent,.18)}; transform: rotate(13deg); z-index: -1; }
${s} .display { display: inline; background: var(--ink); color: var(--bg); padding: 0 9px; box-decoration-break: clone; -webkit-box-decoration-break: clone; font-size: 49px; line-height: 1.15; }
${s} .kicker { align-self: flex-start; border: 2px solid var(--accent); color: var(--accent); padding: 2px 8px; transform: rotate(2deg); }
${s} .card { border-color: var(--ink); box-shadow: 4px 4px 0 var(--ink); }
${s} .card:nth-child(1) { transform: rotate(-1deg); }
${s} .card:nth-child(2) { transform: rotate(1.2deg); background: var(--ink); color: var(--bg); }
${s} .card:nth-child(2) .stat-delta, ${s} .card:nth-child(2) .stat-num { color: var(--accent); }
${s} .card:nth-child(3) { transform: rotate(-.5deg); }
${s} .chip { border-radius: 0; border-color: var(--ink); font-family: var(--f-mono); }
${s} .btn { border-radius: 0; border-color: var(--ink); transform: rotate(-1deg); }
${s} .btn-a { background: var(--accent); color: #fff; }
${s} .logo { border-radius: 0; background: var(--accent); transform: rotate(13deg); }
`;
    },
  },

  {
    id: "suprematism",
    name: "Suprematism",
    family: "heritage",
    traits: ["minimal", "geometric", "bold"],
    blurb:
      "Suprematist abstraction: an immense off-white field activated by a few weightless red, black, blue, and ochre forms. Rectangles and circles drift on diagonals with no pictorial depth; typography is spare, geometric, and subordinate to the tension between scale, angle, and empty space.",
    notes: [
      "The hero contains a disciplined composition of one black bar, one red square, one blue sliver, and one ochre circle floating behind the copy.",
      "Panels are borderless white fields separated by space; only one card receives a thin black structural rule.",
      "Controls remain square and flat, using primary fills without gradients or shadows.",
      "Charts use flat primary bars with no grid, continuing the abstract composition rather than becoming a dashboard widget.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#f4f1e7", ink: "#171717", accent: "#c82225", accent2: "#244987", surface: "#faf8f1", surface2: "#eee9dc", border: "#c8c2b5", muted: "#67635c", dark: false });
      g.fonts = { display: "geometric", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 0;
      g.shadow = "none"; g.texture = "none"; g.density = "airy";
      g.case = "none"; g.hw = 600; g.track = 0.02;
      g.chart = "bars"; g.chartTreatment = "solid"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after { content: ""; position: absolute; right: -10px; top: -25px; width: 260px; height: 190px; z-index: -1; background: linear-gradient(72deg, transparent 0 42%, #171717 42% 48%, transparent 48%), linear-gradient(25deg, transparent 0 56%, ${g.p.accent} 56% 70%, transparent 70%), radial-gradient(circle at 75% 26%, #d5a51f 0 19px, transparent 20px), linear-gradient(102deg, transparent 0 72%, ${g.p.accent2} 72% 76%, transparent 76%); }
${s} .smain { z-index: 2; }
${s} .display { font-size: 45px; max-width: 430px; }
${s} .kicker { color: var(--ink); }
${s} .card { background: transparent; border: none; padding-left: 0; padding-right: 18px; }
${s} .card:nth-child(2) { border-left: 5px solid var(--ink); padding-left: 18px; }
${s} .chip { border-radius: 0; border: none; background: var(--accent2); color: #fff; }
${s} .chip:nth-child(2) { background: #d5a51f; color: var(--ink); }
${s} .btn { border-radius: 0; }
${s} .btn-a { background: var(--accent); color: #fff; }
${s} .logo { border-radius: 0; background: var(--ink); transform: rotate(18deg); }
${s} .chart rect:nth-of-type(3n+2) { fill: #d5a51f; }
${s} .chart rect:nth-of-type(3n) { fill: var(--accent2); }
`;
    },
  },

  {
    id: "cubism",
    name: "Analytic Cubism",
    family: "heritage",
    traits: ["geometric", "layered", "print"],
    blurb:
      "Analytic Cubism turned into page structure: ochre, charcoal, umber, and muted blue planes overlap at conflicting angles, fragmenting conventional boxes without losing the reading order. Serif and grotesque type coexist like pasted newsprint, while angular facets, partial outlines, and compressed tonal values replace conventional depth.",
    notes: [
      "Large translucent polygonal planes overlap behind the hero in a restrained ochre/umber/blue-gray palette.",
      "Cards use clipped polygon corners and slightly different facet fills, with partial dark outlines rather than soft shadow.",
      "Display serif and compact sans labels deliberately coexist, recalling newspaper fragments inside a painted construction.",
      "The area chart is faceted into flat translucent planes with baseline-only axes and angular joins.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#d9cfb8", ink: "#24221d", accent: "#9a6b36", accent2: "#536773", surface: "#e6dcc7", surface2: "#c8b99c", border: "#514a3e", muted: "#625c51", dark: false });
      g.fonts = { display: "transitional", body: "grotesk", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = among(r, g.texture, ["grain", "paper"]); g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.01;
      g.chart = "area"; g.chartTreatment = "solid"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after { content: ""; position: absolute; right: 0; top: -30px; width: 330px; height: 235px; z-index: -1; background: linear-gradient(38deg, transparent 0 24%, ${alpha(g.p.accent,.25)} 24% 53%, transparent 53%), linear-gradient(112deg, transparent 0 36%, ${alpha(g.p.accent2,.25)} 36% 67%, transparent 67%), linear-gradient(164deg, transparent 0 42%, ${alpha(g.p.ink,.1)} 42% 72%, transparent 72%); clip-path: polygon(10% 8%, 87% 0, 100% 54%, 72% 100%, 6% 84%, 0 35%); }
${s} .smain { z-index: 2; }
${s} .display { font-size: 48px; line-height: .96; max-width: 500px; }
${s} .kicker { font-family: var(--f-mono); color: var(--accent2); }
${s} .card { border-color: var(--border); clip-path: polygon(0 8px, 90% 0, 100% 18px, 96% 100%, 8px 96%); }
${s} .card:nth-child(2) { background: ${mix(g.p.surface2, "#ffffff", .18)}; transform: translateY(-5px); }
${s} .card:nth-child(3) { background: ${mix(g.p.accent2, g.p.surface, .82)}; }
${s} .chip, ${s} .btn { border-radius: 0; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .stat-num { color: var(--accent); }
${s} .logo { border-radius: 0; background: linear-gradient(135deg, var(--accent) 50%, var(--accent2) 50%); clip-path: polygon(50% 0, 100% 70%, 35% 100%, 0 35%); }
`;
    },
  },

  {
    id: "surrealism",
    name: "Surrealist Dream",
    family: "heritage",
    traits: ["airy", "elegant", "playful"],
    blurb:
      "A quiet Surrealist landscape: pale dawn sky meeting a long impossible horizon, precise serif typography, floating geometric objects, stretched shadows, and one incongruous vermilion sun. Familiar interface pieces remain legible but their scale, gravity, and placement feel subtly wrong, creating dream logic without dissolving into generic fantasy gradients.",
    notes: [
      "The page establishes a hard distant horizon, a small red sun, and two floating shapes with shadows that point in impossible directions.",
      "Cards are pale, nearly borderless objects; the middle card floats higher and casts an unusually long crisp shadow.",
      "Typography is calm and exact so the spatial impossibilities—not decorative type—carry the surreal effect.",
      "The line chart omits its grid and uses small isolated points, reading like a constellation or diagram from a dream notebook.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#e8e3d4", ink: "#252521", accent: "#c64531", accent2: "#4e7182", surface: "#f5f1e7", surface2: "#d9e0dc", border: "#c8c2b4", muted: "#67665f", dark: false });
      g.fonts = { display: "didone", body: "transitional", mono: "mono" };
      g.radius = 2; g.ctl = 0; g.bw = 1;
      g.shadow = "lifted"; g.texture = "grain"; g.density = "airy";
      g.case = "none"; g.hw = 500; g.track = 0.01;
      g.chart = "line"; g.chartTreatment = "outline"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} { background: linear-gradient(180deg, #cbd9da 0 43%, #807b67 43% 44%, var(--bg) 44%); }
${s} .hero { position: relative; }
${s} .hero::after { content: ""; position: absolute; right: 65px; top: -5px; width: 54px; height: 54px; border-radius: 50%; background: var(--accent); box-shadow: -105px 118px 0 -18px var(--accent2), -145px 135px 0 -20px var(--ink); z-index: -1; }
${s} .smain { z-index: 2; }
${s} .display { font-size: 50px; line-height: 1.04; }
${s} .kicker { color: var(--accent); letter-spacing: .15em; }
${s} .card { background: ${alpha(g.p.surface,.88)}; border-color: ${alpha(g.p.border,.55)}; }
${s} .card:nth-child(2) { transform: translateY(-15px); box-shadow: 28px 24px 0 ${alpha(g.p.ink,.09)}; }
${s} .card:nth-child(3) { transform: translateY(7px); }
${s} .chip { border-radius: 50%; padding: 6px 9px; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .stat-num { color: var(--accent); }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: 8px 5px 0 ${alpha(g.p.ink,.18)}; }
`;
    },
  },

  {
    id: "atomicmidcentury",
    name: "Mid-Century Atomic",
    family: "retro",
    traits: ["retro", "playful", "geometric"],
    blurb:
      "Postwar atomic optimism: warm cream, turquoise, coral, mustard, and charcoal arranged as boomerangs, starbursts, orbit lines, and tapered furniture-like forms. Friendly geometric type, asymmetrical balance, and flat screenprinted color make the page feel like a 1958 exhibition brochure for the future.",
    notes: [
      "The hero carries orbit rings, a coral nucleus, and a small mustard starburst; decoration stays flat and diagrammatic.",
      "Cards use alternating pastel fills and asymmetric boomerang-like clipped corners with very light structural borders.",
      "Buttons are compact rounded lozenges, while chips become tiny colored atomic labels rather than modern neutral pills.",
      "Dot-column charts use turquoise, coral, and mustard marks over a baseline with no rectangular chart box.",
    ],
    conform(g, r) {
      const [turq, coral] = pick(r, [["#258f8a", "#d75a4a"], ["#2b7f87", "#d76549"]]);
      g.p = pal({ bg: "#f2e6c9", ink: "#30312c", accent: turq, accent2: coral, surface: "#f8eed6", surface2: "#e7d4ad", border: "#b8aa8b", muted: "#666253", dark: false });
      g.fonts = { display: "geometric", body: "humanist", mono: "mono" };
      g.radius = 12; g.ctl = 999; g.bw = 1;
      g.shadow = "none"; g.texture = "grain"; g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0.01;
      g.chart = "dots"; g.chartTreatment = "solid"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after { content: "✦"; position: absolute; right: 55px; top: -12px; width: 150px; height: 130px; border: 2px solid ${alpha(g.p.accent,.5)}; border-radius: 50%; color: #d2a528; font-size: 34px; text-align: center; padding-top: 42px; box-sizing: border-box; transform: rotate(-15deg); box-shadow: inset 0 0 0 16px var(--bg), inset 0 0 0 18px ${alpha(g.p.accent2,.4)}; z-index: -1; }
${s} .smain { z-index: 2; }
${s} .display { font-size: 49px; color: var(--ink); }
${s} .kicker { color: var(--accent2); letter-spacing: .12em; }
${s} .card { border-color: var(--border); background: var(--surface); border-radius: 28px 7px 24px 7px; }
${s} .card:nth-child(2) { background: ${mix(g.p.accent, "#ffffff", .82)}; border-radius: 7px 26px 7px 22px; }
${s} .card:nth-child(3) { background: ${mix(g.p.accent2, "#ffffff", .84)}; }
${s} .chip { border: none; background: #d2a528; color: var(--ink); }
${s} .chip:nth-child(2) { background: var(--accent); color: #fff; }
${s} .btn-a { background: var(--accent2); color: #fff; }
${s} .stat-num { color: var(--accent); }
${s} .logo { background: var(--accent); border-radius: 70% 20% 70% 20%; transform: rotate(30deg); }
`;
    },
  },

  {
    id: "cranbrook",
    name: "New Wave Cranbrook",
    family: "bold",
    traits: ["postmodern", "layered", "bold"],
    blurb:
      "Cranbrook and New Wave typography: the grid is present only to be argued with. Oversized grotesque type collides with hairline serif fragments, translucent color blocks, rotated captions, exposed alignment marks, and layers that cross panel boundaries. Meaning emerges through juxtaposition, scale shifts, and controlled typographic friction.",
    notes: [
      "The display overlaps an offset outlined echo, with a rotated mono annotation crossing its baseline like an editorial correction.",
      "Cards use different alignments, partial borders, and translucent process-color planes that intentionally overlap the gutters.",
      "Labels mix sans, serif, and mono roles while preserving readable body copy; hierarchy comes from scale and position rather than a component kit.",
      "Charts use overprinted bars and minimal grid structure, with cyan/magenta intersections creating a darker third color.",
    ],
    conform(g, r) {
      const dark = chance(r, .25);
      g.p = dark
        ? pal({ bg: "#16151a", ink: "#f0eee8", accent: "#ff3366", accent2: "#19b7d1", surface: "#24222b", surface2: "#302d38", border: "#686370", muted: "#aaa5ae", dark: true })
        : pal({ bg: "#f1efe8", ink: "#17171a", accent: "#e92962", accent2: "#08a6c2", surface: "#faf8f1", surface2: "#e3dfd7", border: "#99939a", muted: "#5d5960", dark: false });
      g.fonts = { display: pick(r, ["grotesk", "black"]), body: "transitional", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none"; g.density = among(r, g.density, ["normal", "dense"]);
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 800; g.track = -0.025;
      g.chart = "bars"; g.chartTreatment = "overprint"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::before { content: "MAKE IT / FEEL / DELIBERATE"; position: absolute; left: 185px; top: 8px; color: transparent; -webkit-text-stroke: 1px ${alpha(g.p.accent2,.65)}; font: 800 45px/.86 var(--f-display); transform: rotate(2deg); z-index: -1; }
${s} .display { font-size: 54px; max-width: 510px; line-height: .9; color: var(--accent); mix-blend-mode: multiply; }
${s} .kicker { align-self: flex-start; font-family: var(--f-mono); color: var(--ink); transform: rotate(-5deg); border-bottom: 1px solid var(--accent2); }
${s} .cards { gap: 2px; overflow: visible; }
${s} .card { border: none; border-top: 1px solid var(--ink); background: ${alpha(g.p.surface,.8)}; }
${s} .card:nth-child(1) { transform: rotate(-1deg) translateX(8px); border-left: 12px solid ${alpha(g.p.accent,.72)}; }
${s} .card:nth-child(2) { transform: translateY(-12px); background: ${alpha(g.p.accent2,.18)}; }
${s} .card:nth-child(3) { transform: rotate(1deg) translateX(-7px); border-right: 12px solid ${alpha(g.p.accent,.5)}; }
${s} .card-t { font-family: var(--f-display); text-transform: uppercase; }
${s} .chip { border-radius: 0; border-color: var(--ink); font-family: var(--f-mono); }
${s} .btn { border-radius: 0; }
${s} .btn-a { background: var(--accent); color: #fff; transform: rotate(-2deg); }
${s} .stat-num { color: var(--accent2); }
${s} .logo { border-radius: 0; background: linear-gradient(90deg, var(--accent) 50%, var(--accent2) 50%); transform: rotate(8deg); }
`;
    },
  },
];
