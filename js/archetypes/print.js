// Print family: styles borrowed from paper — magazines, newspapers, riso
// printing, zines, manuscripts, technical blueprints.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const print = [

  // -------------------------------------------------------------- editorial
  {
    id: "editorial",
    name: "Editorial Serif",
    family: "print",
    traits: ["print", "elegant", "literary"],
    blurb:
      "A modern magazine feature spread: high-contrast didone headlines on cream stock, a double rule under the masthead, hairline column dividers, and a swash first-letter drop cap. Literary, confident, a little theatrical.",
    notes: [
      "The masthead is separated by a classic double rule (thin over thick, in ink).",
      "The standfirst opens with a large serif drop cap.",
      "Cards are columns divided by 1px vertical hairlines rather than boxes.",
      "One deep editorial red for kickers and pull details; everything else is ink on cream.",
    ],
    conform(g, r) {
      const red = pick(r, ["#8e2222", "#1e3a8a", "#5b3a8e"]);
      g.p = pal({ bg: "#faf6ee", ink: "#1c1a17", accent: red, accent2: "#96700f", dark: false });
      g.fonts = { display: "didone", body: "transitional", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [500, 600]); g.track = 0;
      g.chart = among(r, g.chart, ["line", "bars-outline"]);
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom: 3px double var(--ink); }
${s} .display { font-size: 52px; line-height: 1.04; }
${s} .kicker { letter-spacing: .2em; font-size: 11px; }
${s} .sub::first-letter {
  font-family: var(--f-display); float: left; font-size: 46px; line-height: .82;
  padding: 4px 8px 0 0; color: var(--accent); font-weight: 600;
}
${s} .cards { gap: 0; }
${s} .card { background: transparent; border: none; border-left: 1px solid var(--border); border-radius: 0; padding: 4px 22px 0; }
${s} .card:first-child { border-left: none; padding-left: 0; }
${s} .card-t { font-size: 18px; }
${s} .chip { border: none; padding: 0 10px 0 0; font-style: italic; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .foot { border-top: 3px double var(--ink); }
${s} .logo { border-radius: 50%; background: var(--ink); }
`;
    },
  },

  // -------------------------------------------------------------- broadsheet
  {
    id: "broadsheet",
    name: "Broadsheet",
    family: "print",
    traits: ["print", "dense", "mono2"],
    blurb:
      "A serious newspaper front page: near-black ink on newsprint gray, condensed uppercase headlines, dense justified columns, thick-and-thin rule pairs, and hatched black-and-white charts. Information density as an aesthetic.",
    notes: [
      "Headlines are tall, condensed, uppercase, and tightly leaded.",
      "Rules come in pairs: a heavy 3px bar over a 1px hairline (both in ink).",
      "Body copy is justified with hyphenation feel; layout is packed, not airy.",
      "Charts are black-and-white with hatching — no color fills. A single oxblood red may appear in small labels.",
    ],
    conform(g, r) {
      g.p = pal({ bg: "#f2efe9", ink: "#161513", accent: "#7a1f1f", accent2: "#3d3b37",
                  border: "#161513", dark: false });
      g.fonts = { display: "industrial", body: "transitional", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "paper";
      g.density = "dense";
      g.case = "upper"; g.hw = 700; g.track = 0;
      g.chart = "bars-hatch";
    },
    css(s, g) {
      return `
${s} .topbar { border-bottom: 1px solid var(--ink); box-shadow: 0 -4px 0 0 var(--ink) inset, 0 -6px 0 0 var(--bg) inset, 0 -7px 0 0 var(--ink) inset; padding-bottom: 14px; }
${s} .display { font-size: 54px; line-height: 0.96; letter-spacing: -0.01em; }
${s} .sub { text-align: justify; text-transform: none; }
${s} .kicker { color: var(--ink); border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); padding: 3px 0; display: inline-block; align-self: flex-start; }
${s} .card { background: transparent; border: none; border-top: 4px solid var(--ink); border-radius: 0; padding-left: 0; padding-right: 0; }
${s} .card-t { font-size: 17px; }
${s} .card-p, ${s} .sub { font-size: 13.5px; }
${s} .chip { border-radius: 0; border-color: var(--ink); color: var(--ink); text-transform: uppercase; font-size: 9.5px; letter-spacing: .06em; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .btn-b { border-color: var(--ink); }
${s} .foot { border-top: 1px solid var(--ink); font-family: var(--f-mono); font-size: 11px; text-transform: uppercase; }
${s} .logo { border-radius: 0; background: var(--ink); }
`;
    },
  },

  // ------------------------------------------------------------------- riso
  {
    id: "riso",
    name: "Riso Print",
    family: "print",
    traits: ["print", "playful", "texture"],
    blurb:
      "Risograph zine printing: exactly two vivid soy-ink colors overprinted on toothy paper, with visible grain and slightly misregistered offsets. Flat shapes, honest imperfection, and that unmistakable fluorescent-ink glow.",
    notes: [
      "Strictly two ink colors on paper — one deep (used as text ink), one fluorescent (used for fills and emphasis). No blacks, no grays: 'gray' is the deep ink at lower density.",
      "Misregistration: headlines and cards carry a small offset shadow of the second ink, as if the layers slipped ~2px in printing.",
      "Heavy paper-grain texture over everything.",
      "Charts print the fluorescent ink with the deep ink as outline.",
    ],
    conform(g, r) {
      const combos = [
        ["#23409f", "#ff5b77"], ["#1d6a52", "#ff7a3d"], ["#4b3b8f", "#ffd400"],
        ["#a02440", "#00a3a3"], ["#28527a", "#f2a007"],
      ];
      const [deep, fluo] = pick(r, combos);
      g.p = pal({
        bg: "#f6f2e8", ink: deep, accent: fluo, accent2: deep,
        border: deep, muted: mix(deep, "#f6f2e8", 0.35),
        surface: "#f6f2e8", surface2: mix(fluo, "#f6f2e8", 0.82), dark: false,
      });
      g.fonts = { display: pick(r, ["black", "geometric", "slab"]), body: "humanist", mono: "typewriter" };
      g.radius = pick(r, [2, 4]); g.ctl = pick(r, [2, 999]); g.bw = 2;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "dots"]);
    },
    css(s, g) {
      return `
${s} .display { text-shadow: 2.5px 2px 0 ${alpha(g.p.accent, 0.6)}; font-size: 48px; }
${s} .card { box-shadow: 3px 3px 0 ${alpha(g.p.accent, 0.45)}; }
${s} .chip { border-width: 2px; color: var(--ink); font-weight: 700; }
${s} .stat-num { color: var(--accent); text-shadow: 1.5px 1.5px 0 ${alpha(g.p.ink, 0.5)}; }
${s} .btn-b { border-width: 2px; }
${s} .logo { background: var(--accent); box-shadow: 2px 2px 0 ${alpha(g.p.ink, 0.6)}; }
${s} .kicker { color: var(--ink); }
${s} .stat-delta { color: var(--ink); }
`;
    },
  },

  // ------------------------------------------------------------------- zine
  {
    id: "zine",
    name: "Photocopy Zine",
    family: "print",
    traits: ["punk", "raw", "highcontrast"],
    blurb:
      "A stapled punk zine run through a hot photocopier: harsh black and white, headlines pasted on as inverted strips of type, elements slightly askew, toner grain everywhere. Deliberately anti-polish — energy over order.",
    notes: [
      "The headline is set as white type on pasted black strips (inline background blocks with ragged line breaks), slightly rotated.",
      "Cards and chips sit a degree or two off-axis, like glued-down clippings.",
      "Everything is black/white plus at most one spot color used like a rubber stamp.",
      "Grainy photocopy texture over the whole page; borders are rough 2px black.",
    ],
    conform(g, r) {
      const stamp = pick(r, ["#c92a2a", "#0a0a0a", "#1c53c9"]);
      g.p = pal({
        bg: "#f5f3ef", ink: "#0d0d0d", accent: stamp, accent2: "#0d0d0d",
        border: "#0d0d0d", muted: "#3f3d3a", surface: "#f5f3ef", surface2: "#e4e1db", dark: false,
      });
      g.fonts = { display: pick(r, ["black", "typewriter"]), body: "typewriter", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "hard"; g.texture = "grain";
      g.density = "dense";
      g.case = "upper"; g.hw = 900; g.track = 0.01;
      g.chart = among(r, g.chart, ["bars-hatch", "bars-outline"]);
    },
    css(s, g) {
      return `
${s} .display {
  display: inline; background: var(--ink); color: var(--bg);
  padding: 2px 10px; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  font-size: 44px; line-height: 1.22;
}
${s} .hero { transform: rotate(-0.6deg); }
${s} .card { box-shadow: 4px 4px 0 var(--ink); }
${s} .card:nth-child(1) { transform: rotate(-0.8deg); }
${s} .card:nth-child(2) { transform: rotate(0.7deg); }
${s} .card:nth-child(3) { transform: rotate(-0.4deg); }
${s} .chip { background: var(--ink); color: var(--bg); border-radius: 0; transform: rotate(-1deg); font-weight: 700; }
${s} .chip:nth-child(2) { transform: rotate(1.4deg); }
${s} .kicker { color: var(--accent); font-family: var(--f-mono); letter-spacing: .05em; }
${s} .btn { border-radius: 0; box-shadow: 3px 3px 0 var(--ink); }
${s} .btn-b { border-color: var(--ink); border-width: 2px; }
${s} .stat-delta { color: var(--accent); }
${s} .logo { border-radius: 0; background: var(--ink); }
`;
    },
  },

  // -------------------------------------------------------------- manuscript
  {
    id: "manuscript",
    name: "Illuminated Manuscript",
    family: "print",
    traits: ["ornate", "historic", "warm"],
    blurb:
      "A scholarly manuscript page: warm parchment, old-style serif text, rubricated red initials and labels in the medieval tradition, fine double rules, and a burnished gold second accent. Antiquarian but disciplined.",
    notes: [
      "The standfirst opens with a large rubricated (deep red) drop cap.",
      "Labels and the kicker are set in red small-caps style (uppercase, spaced).",
      "Frames are fine 3px double borders in the parchment-brown neutral.",
      "Gold appears only in tiny touches (the mark, one chart series).",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f3ead8", ink: "#2e2417", accent: "#96281e", accent2: "#a8791c",
        surface: "#f7f0e2", border: "#b8a888", muted: "#6b5c44", dark: false,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "paper";
      g.density = "normal";
      g.case = "none"; g.hw = 600; g.track = 0.01;
      g.chart = among(r, g.chart, ["line", "dots"]);
    },
    css(s, g) {
      return `
${s} .card { border: 3px double var(--border); }
${s} .topbar { border-bottom: 3px double var(--border); }
${s} .foot { border-top: 3px double var(--border); }
${s} .display { font-size: 46px; }
${s} .kicker { color: var(--accent); letter-spacing: .18em; }
${s} .sub::first-letter {
  font-family: var(--f-display); float: left; font-size: 44px; line-height: .8;
  padding: 5px 8px 0 0; color: var(--accent); font-weight: 700;
}
${s} .chip { border-color: var(--border); color: var(--accent); }
${s} .stat-num { color: var(--accent); }
${s} .btn-a { background: var(--accent); }
${s} .logo { background: var(--accent2); border-radius: 0; transform: rotate(45deg); width: 11px; height: 11px; }
`;
    },
  },

  // -------------------------------------------------------------- blueprint
  {
    id: "blueprint",
    name: "Blueprint",
    family: "print",
    traits: ["technical", "dark", "mono2"],
    blurb:
      "A cyanotype engineering drawing: deep Prussian blue paper, white line work, a faint drafting grid, dashed construction outlines, and monospaced annotations. Everything looks measured, labeled, and drawn to scale.",
    notes: [
      "The entire page is white-on-blue line work: outlines, not fills (the one solid element is the primary button, in white with blue text).",
      "Cards are dashed white outline frames, like construction geometry.",
      "All labels are monospaced uppercase, as if hand-lettered by a draftsman.",
      "A fine drafting grid covers the background; charts are white outlines.",
    ],
    conform(g, r) {
      const blue = pick(r, ["#123a75", "#0f2f60", "#14456b"]);
      g.p = pal({
        bg: blue, ink: "#eaf2fb", accent: "#eaf2fb", accent2: "#9fc3e8",
        surface: alphaSafe(blue), border: "#b9d0ea", muted: "#a9c4e2", dark: true,
      });
      function alphaSafe(b) { return mix(b, "#ffffff", 0.06); }
      g.fonts = { display: "industrial", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "grid";
      g.density = "normal";
      g.case = "upper"; g.hw = 600; g.track = 0.06;
      g.chart = "bars-outline";
    },
    css(s, g) {
      return `
${s} .card { border: 1px dashed var(--border); background: transparent; }
${s} .topbar { border-bottom: 1px solid var(--border); }
${s} .foot { border-top: 1px solid var(--border); font-family: var(--f-mono); }
${s} .display { font-size: 42px; letter-spacing: .04em; }
${s} .kicker { color: var(--accent2); font-family: var(--f-mono); }
${s} .kicker::before { content: "DWG № "; }
${s} .btn-a { background: var(--ink); color: ${g.p.bg}; box-shadow: none; }
${s} .btn-b { border: 1px dashed var(--border); }
${s} .chip { border: 1px dashed var(--border); border-radius: 0; font-family: var(--f-mono); text-transform: uppercase; font-size: 10px; }
${s} .logo { background: transparent; border: 1.5px solid var(--ink); border-radius: 0; }
${s} .stat-delta { color: var(--accent2); }
${s} .card-t::after { content: " —"; color: var(--muted); }
`;
    },
  },
];
