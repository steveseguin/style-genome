// Distinct interface design systems and anti-systems missing from the original
// web families. Each entry is self-contained and uses the canonical genome.

import { pick, chance } from "../rng.js";
import { alpha, mix } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const uiSystemGaps = [
  {
    id: "skeuomorphism",
    name: "Skeuomorphic Interface",
    family: "web",
    traits: ["tactile", "glossy", "retro"],
    blurb:
      "A pre-flat skeuomorphic interface built from recognizable materials: walnut desk, stitched dark leather toolbar, inset cream paper panels, beveled brass controls, and glassy indicator lights. Depth communicates affordance through highlights, seams, wells, embossing, and physical edge logic—not generic drop-shadow cards.",
    notes: [
      "The page reads as warm walnut through layered linear grain; the top bar and footer are dark leather with inset highlights and a dashed stitch line.",
      "Cards are inset cream paper sheets with inner bevels, a subtle curled-edge highlight, and small brass fastener details.",
      "Primary controls are convex brass buttons with a bright top rim and dark lower bevel; secondary controls resemble recessed labels.",
      "Charts use embossed solid bars over a baseline, with inset highlights that make each mark feel machined into a physical instrument panel.",
    ],
    conform(g, r) {
      const wood = pick(r, ["#6d4026", "#75482b", "#5e3925"]);
      g.p = pal({
        bg: wood, ink: "#2b2117", accent: "#a96f2f", accent2: "#526b57",
        surface: "#eee2c7", surface2: "#d8c8a7", border: "#6e5435", muted: "#665946", dark: false,
      });
      g.fonts = { display: "transitional", body: "humanist", mono: "typewriter" };
      g.radius = 10; g.ctl = 8; g.bw = 1;
      g.shadow = "emboss"; g.texture = "grain"; g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.01;
      g.chart = "bars"; g.chartTreatment = "solid"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background-color: ${g.p.bg}; background-image: repeating-linear-gradient(6deg, rgba(255,255,255,.025) 0 2px, rgba(0,0,0,.045) 2px 4px, transparent 4px 13px); }
${s} .topbar, ${s} .foot { color: #eadfc8; background: linear-gradient(180deg, #44352a, #241b16); border-color: #17110d; box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 -3px 6px rgba(0,0,0,.55); outline: 1px dashed rgba(222,191,140,.4); outline-offset: -6px; }
${s} .topnav .nl, ${s} .brand, ${s} .foot { color: #eadfc8; }
${s} .hero { background: ${alpha(g.p.surface,.9)}; border: 1px solid #a48c65; border-radius: 7px; padding: 22px; box-shadow: inset 0 1px 0 #fff8e8, 0 4px 10px rgba(35,20,10,.35); }
${s} .display { font-size: 43px; color: #302318; text-shadow: 0 1px 0 #fff; }
${s} .kicker { color: var(--accent); }
${s} .card { position: relative; background: linear-gradient(180deg, #f5ead2, #dfd0b2); border-color: #8b7451; box-shadow: inset 0 1px 0 #fff9e9, inset 0 -2px 4px rgba(70,45,20,.18), 0 5px 10px rgba(40,22,10,.3); }
${s} .card::after { content: ""; position: absolute; right: 8px; top: 8px; width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff4ad 0 12%, #b77d32 48%, #5d391b 100%); }
${s} .btn { border: 1px solid #61411f; text-shadow: 0 1px 0 rgba(255,255,255,.45); }
${s} .btn-a { background: linear-gradient(180deg, #d9a75a 0, #a96f2f 52%, #744619 100%); color: #28180b; box-shadow: inset 0 1px 0 #ffe2a0, 0 2px 3px rgba(35,20,8,.5); }
${s} .btn-b { background: linear-gradient(180deg, #f3e8d0, #cdbb98); color: var(--ink); box-shadow: inset 0 1px 0 #fff; }
${s} .chip { background: #ded0b4; border-color: #8b7451; box-shadow: inset 0 1px 2px rgba(55,35,15,.18); }
${s} .stat-num { color: var(--accent2); text-shadow: 0 1px 0 #fff; }
${s} .chart rect { filter: drop-shadow(0 1px 0 rgba(255,255,255,.65)); }
${s} .logo { background: radial-gradient(circle at 34% 28%, #dcefd8 0 13%, var(--accent2) 55%, #21382a 100%); border: 1px solid #1b2c20; }
`;
    },
  },

  {
    id: "metro",
    name: "Metro Tiles",
    family: "web",
    traits: ["flat", "geometric", "bold"],
    blurb:
      "Metro design in its original content-first form: edge-to-edge flat color, strict square tiles, Segoe-like humanist type, oversized lightweight headings, icon-like geometric marks, and lateral information rhythm. There are no shadows, gradients, gloss, decorative borders, or rounded cards—hierarchy comes from scale, alignment, and confident color blocks.",
    notes: [
      "Cards become unequal flat tiles: one accent, one deep neutral, one pale field, all square and aligned to a strict modular grid.",
      "The display is large, light humanist sans with open breathing room; labels are compact and unboxed.",
      "Navigation is plain text with a thin active underline; buttons are square solid tiles rather than pills.",
      "Charts use flat bars with no grid or shadow, colored to belong to their enclosing tile rather than floating as a separate widget.",
    ],
    conform(g, r) {
      const dark = chance(r, .25);
      const accent = pick(r, ["#0078d7", "#008272", "#d83b01", "#744da9"]);
      g.p = dark
        ? pal({ bg: "#111111", ink: "#f2f2f2", accent, accent2: "#e3b341", surface: "#1f1f1f", surface2: "#2a2a2a", border: "#4c4c4c", muted: "#b0b0b0", dark: true })
        : pal({ bg: "#f3f3f3", ink: "#1f1f1f", accent, accent2: "#c239b3", surface: "#ffffff", surface2: "#e7e7e7", border: "#d2d2d2", muted: "#606060", dark: false });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 0;
      g.shadow = "none"; g.texture = "none"; g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = 400; g.track = 0;
      g.chart = "bars"; g.chartTreatment = "solid"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .topbar { border: none; }
${s} .display { font-size: 56px; font-weight: 400; line-height: 1; }
${s} .kicker { color: var(--accent); font-size: 12px; letter-spacing: .04em; }
${s} .topnav .nl { padding-bottom: 4px; }
${s} .topnav .nl.on { color: var(--ink); border-bottom: 2px solid var(--accent); }
${s} .cards { grid-template-columns: 1.15fr .85fr 1fr; gap: 8px; }
${s} .card { border: none; border-radius: 0; box-shadow: none; min-height: 178px; }
${s} .card:nth-child(1) { background: var(--accent); color: #fff; }
${s} .card:nth-child(1) .card-p { color: rgba(255,255,255,.82); }
${s} .card:nth-child(2) { background: ${g.p.dark ? "#2b2b2b" : "#252525"}; color: #fff; }
${s} .card:nth-child(2) .stat-label { color: rgba(255,255,255,.72); }
${s} .card:nth-child(3) { background: var(--surface2); }
${s} .chip { border: none; border-radius: 0; background: rgba(255,255,255,.18); color: inherit; padding: 4px 7px; }
${s} .btn { border: none; border-radius: 0; }
${s} .btn-a { background: var(--accent); color: #fff; }
${s} .btn-b { background: var(--ink); color: var(--bg); }
${s} .stat-num { color: var(--accent2); font-weight: 400; }
${s} .logo { border-radius: 0; background: linear-gradient(90deg, var(--accent) 47%, transparent 47% 53%, var(--accent) 53%); }
${s} .foot { border-top: none; }
`;
    },
  },

  {
    id: "material",
    name: "Material Design",
    family: "web",
    traits: ["familiar", "modern", "clean"],
    blurb:
      "Material Design as a coherent elevation system: bold but disciplined color, an 8-point spacing rhythm, white or charcoal paper surfaces, crisp Roboto-like type, circular action motifs, and shadows whose size communicates hierarchy. Motion is implied through layered paper and ripple-ready controls, never through ornamental gradients.",
    notes: [
      "Surfaces occupy explicit elevation levels: top bar at 4dp, cards at 1–2dp, and the primary circular mark at a stronger floating elevation.",
      "Cards use modest 4px corners, consistent padding, and no decorative edge stripes; hierarchy is conveyed by fill and elevation.",
      "Buttons use uppercase medium-weight labels, a compact radius, and restrained state shadows; chips are low-elevation tonal containers.",
      "Charts use clean solid marks over subtle full gridlines, with semantic accent color and no ornamental texture.",
    ],
    conform(g, r) {
      const dark = chance(r, .3);
      const accent = pick(r, ["#3f51b5", "#00695c", "#6a1b9a", "#c62828"]);
      g.p = dark
        ? pal({ bg: "#121212", ink: "#f1f1f1", accent, accent2: "#ffb300", surface: "#1e1e1e", surface2: "#292929", border: "#383838", muted: "#b3b3b3", dark: true })
        : pal({ bg: "#f5f5f5", ink: "#202124", accent, accent2: "#f9a825", surface: "#ffffff", surface2: "#eeeeee", border: "#e0e0e0", muted: "#5f6368", dark: false });
      g.fonts = { display: "grotesk", body: "grotesk", mono: "mono" };
      g.radius = 4; g.ctl = 4; g.bw = 0;
      g.shadow = "lifted"; g.texture = "none"; g.density = "normal";
      g.case = "none"; g.hw = 500; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "line"]); g.chartTreatment = "solid"; g.chartGrid = "full";
    },
    css(s, g) {
      return `
${s} .topbar { background: var(--surface); border: none; box-shadow: 0 2px 5px rgba(0,0,0,.22); margin: 0; padding: 15px calc(var(--sp) * 3); }
${s} .display { font-size: 48px; font-weight: 500; line-height: 1.05; }
${s} .kicker { color: var(--accent); letter-spacing: .08em; font-weight: 500; }
${s} .card { border: none; background: var(--surface); box-shadow: 0 1px 3px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.12); }
${s} .card:hover { box-shadow: 0 4px 8px rgba(0,0,0,.2); }
${s} .card-t { font-weight: 500; }
${s} .chip { border: none; background: var(--surface2); font-weight: 500; }
${s} .btn { border: none; text-transform: uppercase; letter-spacing: .045em; font-weight: 600; }
${s} .btn-a { background: var(--accent); color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.28); }
${s} .btn-b { background: transparent; color: var(--accent); box-shadow: none; }
${s} .stat-num { color: var(--accent); font-weight: 500; }
${s} .logo { width: 18px; height: 18px; border-radius: 50%; background: var(--accent); box-shadow: 0 3px 6px rgba(0,0,0,.32); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  {
    id: "fluent",
    name: "Fluent Acrylic",
    family: "web",
    traits: ["translucent", "modern", "soft"],
    blurb:
      "Fluent Design with acrylic and reveal light: a cool Mica-like backdrop, translucent noise-tinted panels, hairline luminous borders, layered depth, and restrained blue accent. Geometry stays practical and softly rounded; atmosphere comes from material translucency, subtle light response, and depth ordering rather than a generic glassmorphic gradient cloud.",
    notes: [
      "The background is a muted Mica field with two restrained ambient color blooms; cards use acrylic-like translucent fills plus fine noise.",
      "Panel borders brighten toward the upper-left as a static reveal-light cue, while shadows remain tight and layered.",
      "Controls are compact rounded rectangles, not full pills; selected actions use solid accent while secondary actions remain translucent.",
      "Charts use thin clean lines over a faint full grid and inherit the cool luminous accent without neon glow.",
    ],
    conform(g, r) {
      const dark = chance(r, .45);
      g.p = dark
        ? pal({ bg: "#202124", ink: "#f4f4f4", accent: "#4ca6ff", accent2: "#8b7cf6", surface: "#2b2d31", surface2: "#35383e", border: "#555960", muted: "#b7bbc2", dark: true })
        : pal({ bg: "#e9edf3", ink: "#20242a", accent: "#0067c0", accent2: "#6750a4", surface: "#f5f7fa", surface2: "#e4e8ee", border: "#c7ccd3", muted: "#59616c", dark: false });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = pick(r, [6, 8]); g.ctl = 4; g.bw = 1;
      g.shadow = "lifted"; g.texture = "grain"; g.density = "normal";
      g.case = "none"; g.hw = 600; g.track = -0.01;
      g.chart = "line"; g.chartTreatment = "outline"; g.chartGrid = "full";
    },
    css(s, g) {
      const glass = g.p.dark ? "rgba(45,47,52,.72)" : "rgba(255,255,255,.64)";
      return `
${s} { background: radial-gradient(520px 330px at 92% 0%, ${alpha(g.p.accent,.18)}, transparent 70%), radial-gradient(480px 340px at 0% 100%, ${alpha(g.p.accent2,.12)}, transparent 72%), var(--bg); }
${s} .topbar { background: ${glass}; border-color: ${alpha(g.p.ink,.12)}; backdrop-filter: blur(18px) saturate(125%); }
${s} .display { font-size: 48px; font-weight: 600; }
${s} .kicker { color: var(--accent); letter-spacing: .08em; }
${s} .card { background: ${glass}; border-color: ${alpha(g.p.ink,.16)}; box-shadow: inset 1px 1px 0 ${alpha("#ffffff", g.p.dark ? .1 : .72)}, 0 6px 18px rgba(20,28,42,.12); backdrop-filter: blur(16px) saturate(120%); }
${s} .chip { background: ${alpha(g.p.ink,.07)}; border-color: ${alpha(g.p.ink,.12)}; }
${s} .btn-a { background: var(--accent); color: #fff; box-shadow: 0 2px 6px ${alpha(g.p.accent,.25)}; }
${s} .btn-b { background: ${glass}; border-color: ${alpha(g.p.ink,.16)}; }
${s} .stat-num { color: var(--accent); }
${s} .logo { background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 4px; box-shadow: inset 1px 1px 0 rgba(255,255,255,.45); }
${s} .foot { border-top-color: ${alpha(g.p.ink,.14)}; }
`;
    },
  },

  {
    id: "webbrutalism",
    name: "Raw Web Brutalism",
    family: "web",
    traits: ["raw", "highcontrast", "technical"],
    blurb:
      "Web Brutalism in the browser-native sense: default-like blue links, exposed black rules, huge system type, visible document structure, rectangular controls, and aggressively literal hierarchy. It rejects both polished product cards and playful neo-brutalist stickers; the page feels authored directly in HTML with no attempt to disguise the medium.",
    notes: [
      "Navigation is underlined hyperlink-blue text, the current item is bold black, and the contact action looks like a native rectangular control.",
      "The headline is oversized plain grotesque type; spacing is abrupt, with visible horizontal rules and little ornamental alignment.",
      "Cards are document sections divided by thick rules instead of floating colored panels, and chips become bracketed inline links.",
      "Charts use bare black outline bars with a baseline only—no rounded marks, animation gloss, dashboard framing, or accent fill.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#ffffff", ink: "#000000", accent: "#0000ee", accent2: "#551a8b", surface: "#ffffff", surface2: "#eeeeee", border: "#000000", muted: "#3f3f3f", dark: false });
      g.fonts = { display: "grotesk", body: "transitional", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none"; g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "none"; g.hw = 900; g.track = -0.025;
      g.chart = "bars-outline"; g.chartTreatment = "outline"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom: 4px solid var(--ink); }
${s} .brand { font-weight: 900; }
${s} .topnav .nl { color: #0000ee; text-decoration: underline; }
${s} .topnav .nl.on { color: #000; font-weight: 900; }
${s} .display { font-size: 64px; line-height: .86; letter-spacing: -.045em; max-width: 650px; }
${s} .kicker { color: var(--ink); font-family: var(--f-mono); letter-spacing: 0; }
${s} .sub { font-family: var(--f-body); max-width: 710px; }
${s} .cards { gap: 0; border-top: 4px solid var(--ink); border-bottom: 4px solid var(--ink); }
${s} .card { background: transparent; border: none; border-left: 2px solid var(--ink); padding: 16px; }
${s} .card:first-child { border-left: none; }
${s} .card-t { text-decoration: underline; }
${s} .chip { border: none; padding: 0; border-radius: 0; color: #0000ee; text-decoration: underline; }
${s} .chip::before { content: "["; color: var(--ink); }
${s} .chip::after { content: "]"; color: var(--ink); }
${s} .btn { border: 2px outset #aaa; border-radius: 0; background: #eee; color: #000; box-shadow: none; }
${s} .btn-a { background: #000; color: #fff; border: 2px solid #000; }
${s} .stat-num { color: var(--ink); font-family: var(--f-mono); }
${s} .logo { border-radius: 0; background: var(--ink); }
${s} .foot { border-top: 4px solid var(--ink); }
`;
    },
  },

  {
    id: "antidesign",
    name: "Anti-Design Editorial",
    family: "bold",
    traits: ["raw", "vivid", "postmodern"],
    blurb:
      "Contemporary anti-design editorial maximalism: acidic color collisions, enormous type that trespasses across containers, inconsistent alignment, visible overlap, rotated utility labels, and intentionally awkward controls. The disorder is composed rather than random—each violation creates hierarchy, friction, or a deliberate challenge to polished template aesthetics.",
    notes: [
      "The display is oversized beyond its comfortable container and crossed by an outlined offset echo, while a rotated kicker interrupts the margin.",
      "Cards overlap and disagree: one acid field, one white outlined slab, one violet block, each with a different rotation and edge logic.",
      "Buttons use clashing shapes and inversions; chips are uppercase labels with alternating fills rather than a consistent component family.",
      "Charts use overprinted solid bars with no grid, allowing accent intersections and deliberately dense color collision.",
    ],
    conform(g, r) {
      const [acid, violet] = pick(r, [["#c8ff00", "#7a2cff"], ["#ff4da6", "#2457ff"], ["#ff5c1a", "#5d2bff"]]);
      g.p = pal({ bg: "#f3f000", ink: "#111111", accent: acid, accent2: violet, surface: "#ffffff", surface2: "#dedbd0", border: "#111111", muted: "#48462e", dark: false });
      g.fonts = { display: "black", body: pick(r, ["grotesk", "typewriter"]), mono: "mono" };
      g.radius = 0; g.ctl = pick(r, [0, 999]); g.bw = 3;
      g.shadow = "hard"; g.texture = "none"; g.density = "dense";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 900; g.track = -0.025;
      g.chart = "bars"; g.chartTreatment = "overprint"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} { overflow: hidden; }
${s} .topbar { border-bottom: 3px solid var(--ink); transform: rotate(-.4deg); }
${s} .hero { position: relative; }
${s} .hero::after { content: "DELIBERATE"; position: absolute; left: 130px; top: 38px; color: transparent; -webkit-text-stroke: 2px var(--accent2); font: 900 72px/.8 var(--f-display); transform: rotate(4deg); z-index: -1; }
${s} .smain { z-index: 2; }
${s} .display { font-size: 70px; line-height: .78; letter-spacing: -.055em; max-width: 700px; text-transform: uppercase; }
${s} .kicker { align-self: flex-start; background: var(--ink); color: var(--bg); padding: 4px 10px; transform: rotate(-6deg); }
${s} .cards { gap: 0; overflow: visible; }
${s} .card { border: 3px solid var(--ink); box-shadow: 6px 6px 0 var(--ink); }
${s} .card:nth-child(1) { background: var(--accent); transform: rotate(-2deg) translate(8px, 4px); z-index: 2; }
${s} .card:nth-child(2) { background: #fff; transform: rotate(1deg) translateY(-10px); }
${s} .card:nth-child(3) { background: var(--accent2); color: #fff; transform: rotate(-1deg) translate(-8px, 6px); }
${s} .card:nth-child(3) .card-t, ${s} .card:nth-child(3) .stat-delta { color: #fff; }
${s} .chip { border: 2px solid var(--ink); border-radius: 0; background: #fff; color: var(--ink); font-weight: 900; text-transform: uppercase; }
${s} .chip:nth-child(2) { background: var(--accent2); color: #fff; }
${s} .btn { border: 3px solid var(--ink); font-weight: 900; }
${s} .btn-a { background: var(--accent2); color: #fff; border-radius: 0; transform: rotate(-2deg); }
${s} .btn-b { background: #fff; color: var(--ink); border-radius: 999px; transform: rotate(1deg); }
${s} .logo { background: var(--accent2); border: 2px solid var(--ink); border-radius: 0; transform: rotate(18deg); }
${s} .foot { border-top: 3px solid var(--ink); transform: rotate(.4deg); }
`;
    },
  },
];
