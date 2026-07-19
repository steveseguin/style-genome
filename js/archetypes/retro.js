// Retro family: styles borrowed from the recent past of screens — terminals,
// early GUIs, Y2K gloss, vaporwave, aero, and 70s print futurism.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const retro = [

  // --------------------------------------------------------------- terminal
  {
    id: "terminal",
    name: "Phosphor Terminal",
    family: "retro",
    traits: ["dark", "mono2", "retro"],
    blurb:
      "A CRT terminal: a single phosphor ink (green or amber) glowing on near-black glass, monospaced everything, scanlines, prompt markers, and square-bracketed labels. The interface is text; the text is the interface.",
    notes: [
      "One ink only — every line, border, and glyph is the phosphor color at varying intensity; the background is near-black tinted the same hue.",
      "All type is monospaced. The kicker gets a '> ' prompt prefix; chips are wrapped in [square brackets] instead of boxes.",
      "Headings carry a subtle phosphor glow (text-shadow in the ink color).",
      "Horizontal scanlines overlay the whole screen; corners are perfectly square.",
    ],
    conform(g, r) {
      const hue = pick(r, [125, 130, 140, 40, 35, 180]);
      const ink = hslToHex(hue, 75, 62);
      const bg = hslToHex(hue, 30, 6);
      g.p = pal({
        bg, ink, accent: ink, accent2: hslToHex(hue, 45, 42),
        border: hslToHex(hue, 50, 28), muted: hslToHex(hue, 40, 45),
        surface: hslToHex(hue, 35, 9), surface2: hslToHex(hue, 35, 12), dark: true,
      });
      g.fonts = { display: "mono", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "lines";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 700; g.track = 0.02;
      g.chart = among(r, g.chart, ["bars-outline", "dots", "line"]);
    },
    css(s, g) {
      return `
${s} { text-shadow: 0 0 6px ${alpha(g.p.ink, 0.25)}; }
${s} .display { font-size: 36px; text-shadow: 0 0 12px ${alpha(g.p.ink, 0.5)}; }
${s} .display::after { content: "▮"; margin-left: 6px; animation: none; opacity: .8; }
${s} .kicker::before { content: "> "; }
${s} .kicker { color: var(--ink); letter-spacing: .06em; }
${s} .chip { border: none; padding: 3px 2px; }
${s} .chip::before { content: "["; color: var(--muted); }
${s} .chip::after { content: "]"; color: var(--muted); }
${s} .btn-a { background: var(--ink); color: ${g.p.bg}; box-shadow: 0 0 14px ${alpha(g.p.ink, 0.4)}; }
${s} .btn-b { border-color: var(--border); }
${s} .card-t::before { content: "── "; color: var(--muted); }
${s} .logo { background: var(--ink); border-radius: 0; box-shadow: 0 0 10px ${alpha(g.p.ink, 0.6)}; }
${s} .stat-num { text-shadow: 0 0 10px ${alpha(g.p.ink, 0.5)}; }
`;
    },
  },

  // ------------------------------------------------------------------ win95
  {
    id: "win95",
    name: "Retro Desktop",
    family: "retro",
    traits: ["retro", "gui", "gray"],
    blurb:
      "A mid-90s operating system: battleship-gray chrome, 2px light/dark bevels that make every element read as raised or sunken plastic, navy title bars with white system type, and zero anti-aliased softness. Charming, boxy, and utterly literal.",
    notes: [
      "Every surface is the same gray; depth comes only from bevel borders (light top/left, dark bottom/right for raised; inverted for sunken).",
      "Card titles are navy-to-blue gradient title bars with white bold text, exactly like window chrome.",
      "Buttons are raised gray bevels; chips are sunken wells.",
      "System-style sans type at small sizes; no rounded corners, no shadows, no textures.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#c3c3c3", ink: "#141414", accent: "#000080", accent2: "#008080",
        surface: "#c3c3c3", surface2: "#d6d6d6", border: "#7d7d7d", muted: "#3f3f3f", dark: false,
      });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "dense";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "line"]);
    },
    css(s, g) {
      const raised = `border-style: solid; border-width: 2px; border-color: #ffffff #6e6e6e #6e6e6e #ffffff;`;
      const sunken = `border-style: solid; border-width: 2px; border-color: #6e6e6e #ffffff #ffffff #6e6e6e;`;
      return `
${s} { font-family: Tahoma, "MS Sans Serif", var(--f-body); }
${s} .topbar { ${raised} border-left: none; border-right: none; border-top: none; background: #c3c3c3; }
${s} .card { ${raised} padding-top: 8px; }
${s} .card-t {
  background: linear-gradient(90deg, #000080, #1084d0); color: #fff;
  padding: 4px 9px; margin: -8px -6px 6px; font-size: 13px;
}
${s} .card { padding-left: 14px; padding-right: 14px; overflow: hidden; }
${s} .btn { ${raised} background: #c3c3c3; color: #141414; box-shadow: none; padding: 7px 16px; }
${s} .btn-a { font-weight: 700; outline: 1px dotted #141414; outline-offset: -5px; }
${s} .chip { ${sunken} background: #d6d6d6; border-radius: 0; }
${s} .display { font-size: 38px; }
${s} .kicker { color: #000080; }
${s} .stat-delta { color: #006400; }
${s} .foot { ${sunken} border-left: none; border-right: none; border-bottom: none; }
${s} .logo { border-radius: 0; background: linear-gradient(135deg, #000080 50%, #008080 50%); }
`;
    },
  },

  // -------------------------------------------------------------------- y2k
  {
    id: "y2k",
    name: "Y2K Chrome",
    family: "retro",
    traits: ["glossy", "retro", "playful"],
    blurb:
      "Millennium-bug futurism: liquid chrome, glossy pill buttons with a wet highlight, silver-blue gradients, italic tech type, and bubble shapes. Everything looks inflated, reflective, and freshly polished.",
    notes: [
      "Buttons and chips are full pills with a top-half white gloss highlight (layered gradient), like plastic candy.",
      "The headline is italic with a chrome gradient fill (silver into the accent).",
      "Backgrounds are cool silver-blue vertical gradients; cards are bright with big radii.",
      "One hyper-saturated accent (electric blue or hot magenta) drives all interactive color.",
    ],
    conform(g, r) {
      const acc = pick(r, ["#2563eb", "#d61f8f", "#7c3aed", "#0aa2c0"]);
      g.p = pal({
        bg: "#dfe6ef", ink: "#16213a", accent: acc, accent2: "#8e9db5",
        surface: "#f4f7fb", border: "#aeb9c9", muted: "#4c5a74", dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "grotesk"]), body: "humanist", mono: "mono" };
      g.radius = 18; g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = -0.02;
      g.chart = among(r, g.chart, ["area", "line", "bars"]);
    },
    css(s, g) {
      const gloss = `linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.28) 48%, rgba(255,255,255,0) 52%)`;
      return `
${s} { background: linear-gradient(180deg, #eef3f9, #ccd6e4); }
${s} .display {
  font-style: italic;
  background: linear-gradient(180deg, #6d7c94 8%, #f6f9fd 42%, #94a3b8 55%, ${g.p.accent} 120%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-size: 47px;
}
${s} .btn { position: relative; overflow: hidden; }
${s} .btn::after { content: ""; position: absolute; inset: 0 0 45% 0; background: ${gloss}; border-radius: inherit; }
${s} .btn-a { box-shadow: 0 6px 14px ${alpha(g.p.accent, 0.45)}; }
${s} .chip { background: ${gloss}, var(--surface); }
${s} .card { border-color: rgba(255,255,255,.9); box-shadow: 0 10px 24px rgba(30,45,80,.16), inset 0 1px 0 rgba(255,255,255,.9); }
${s} .kicker { font-style: italic; }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 32% 28%, #fff 0 18%, ${g.p.accent} 60%); }
${s} .topbar { border-bottom-color: rgba(255,255,255,.75); }
`;
    },
  },

  // ------------------------------------------------------------------ vapor
  {
    id: "vapor",
    name: "Vaporwave",
    family: "retro",
    traits: ["dark", "neon", "retro"],
    blurb:
      "Vaporwave sunset: a violet-to-magenta dusk gradient, a neon wireframe grid rolling toward the horizon, chromatic-aberration headline glow in pink and cyan, and wide-tracked uppercase labels. 1984 as remembered by 2016.",
    notes: [
      "The page background is a vertical dusk gradient with a perspective grid fading in from the bottom.",
      "The headline is italic with offset pink/cyan text-shadows (chromatic aberration).",
      "Cards are translucent dark panels with thin pale borders.",
      "Hot pink and cyan split all accent duties; labels are uppercase with very wide tracking.",
    ],
    conform(g, r) {
      const pinkish = pick(r, ["#ff5ec4", "#ff4da6"]);
      const cyan = pick(r, ["#4dd8e6", "#59e3c8"]);
      g.p = pal({
        bg: "#241b4d", ink: "#f4efff", accent: pinkish, accent2: cyan,
        surface: "rgbaFix", border: "#6f5fa8", muted: "#b3a8d9", dark: true,
      });
      g.p.surface = mix("#241b4d", "#ffffff", 0.07);
      g.p.surface2 = mix("#241b4d", "#ffffff", 0.13);
      g.fonts = { display: pick(r, ["geometric", "grotesk"]), body: "humanist", mono: "mono" };
      g.radius = 4; g.ctl = pick(r, [4, 999]); g.bw = 1;
      g.shadow = "glow"; g.texture = "none";
      g.density = "normal";
      g.case = "upper"; g.hw = 800; g.track = 0.1;
      g.chart = among(r, g.chart, ["line", "area"]);
    },
    css(s, g) {
      return `
${s} {
  background:
    repeating-linear-gradient(0deg, ${alpha(g.p.accent, 0.25)} 0 1px, transparent 1px 26px),
    repeating-linear-gradient(90deg, ${alpha(g.p.accent, 0.18)} 0 1px, transparent 1px 34px),
    linear-gradient(180deg, #1a1440 0%, #2c1a56 55%, #6b2670 85%, #a23a6e 100%);
  background-size: 100% 100%;
}
${s}::after {
  content: ""; position: absolute; inset: 0 0 42% 0; z-index: 1;
  background: linear-gradient(180deg, #1a1440 30%, ${alpha("#1a1440", 0)} 100%);
  pointer-events: none;
}
${s} .topbar, ${s} .smain, ${s} .foot { z-index: 2; }
${s} .display {
  font-style: italic;
  text-shadow: 3px 0 0 ${alpha(g.p.accent2, 0.8)}, -3px 0 0 ${alpha(g.p.accent, 0.8)};
  font-size: 46px; letter-spacing: .06em;
}
${s} .card { background: ${alpha("#160f33", 0.55)}; backdrop-filter: blur(2px); }
${s}.export-mode .card { background: ${alpha("#160f33", 0.85)}; }
${s} .kicker { color: var(--accent2); }
${s} .btn-a { box-shadow: 0 0 18px ${alpha(g.p.accent, 0.55)}; }
${s} .stat-num { color: var(--accent2); text-shadow: 0 0 12px ${alpha(g.p.accent2, 0.6)}; }
${s} .logo { background: linear-gradient(135deg, ${g.p.accent}, ${g.p.accent2}); border-radius: 50%; }
${s} .topbar { border-bottom-color: ${alpha("#ffffff", 0.25)}; }
${s} .foot { border-top-color: ${alpha("#ffffff", 0.25)}; }
`;
    },
  },

  // --------------------------------------------------------------- frutiger
  {
    id: "frutiger",
    name: "Frutiger Aero",
    family: "retro",
    traits: ["glossy", "optimistic", "soft"],
    blurb:
      "Frutiger Aero optimism: sky-blue-to-white atmosphere, dewy glass panels with a wet gloss highlight, grass-green and aqua accents, and humanist type. The mid-2000s dream of friendly technology — clean, airy, faintly utopian.",
    notes: [
      "The background is a bright sky gradient; panels are translucent white glass with a strong top gloss highlight and soft drop shadows.",
      "Accents are natural: grass green and water aqua, often in gradients.",
      "Corners are generously rounded; buttons look like polished water droplets.",
      "Charts favor smooth filled area curves, like weather widgets.",
    ],
    conform(g, r) {
      const green = pick(r, ["#4caf2f", "#2fa864"]);
      const aqua = pick(r, ["#2bb1d8", "#2b9fd8"]);
      g.p = pal({
        bg: "#dff0fa", ink: "#173a52", accent: green, accent2: aqua,
        surface: "#ffffff", border: "#b5d4e6", muted: "#4a6f88", dark: false,
      });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = 14; g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.01;
      g.chart = "area";
    },
    css(s, g) {
      const gloss = `linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.35) 46%, rgba(255,255,255,.05) 54%, rgba(255,255,255,.25))`;
      return `
${s} { background: linear-gradient(180deg, #eaf7ff 0%, #cfe9f7 55%, #b8ddf0 100%); }
${s} .card {
  background: rgba(255,255,255,.72);
  border-color: rgba(255,255,255,.95);
  box-shadow: 0 8px 20px rgba(40,90,130,.18), inset 0 1px 0 rgba(255,255,255,1);
}
${s} .btn-a {
  background: linear-gradient(180deg, ${mix(g.p.accent, "#ffffff", 0.45)}, ${g.p.accent});
  box-shadow: 0 5px 12px ${alpha(g.p.accent, 0.4)}, inset 0 1px 0 rgba(255,255,255,.8);
}
${s} .btn { position: relative; overflow: hidden; }
${s} .btn::after { content: ""; position: absolute; inset: 1px 1px 48% 1px; background: ${gloss}; border-radius: inherit; opacity: .8; }
${s} .display { color: #10405e; font-size: 43px; }
${s} .kicker { color: var(--accent2); }
${s} .chip { background: rgba(255,255,255,.8); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 30% 25%, #fff 0 15%, ${g.p.accent2} 65%); }
${s} .topbar { border-bottom-color: rgba(255,255,255,.8); }
`;
    },
  },

  // -------------------------------------------------------------- seventies
  {
    id: "seventies",
    name: "Seventies Groove",
    family: "retro",
    traits: ["warm", "retro", "playful"],
    blurb:
      "1970s print futurism: burnt orange, mustard, and chocolate on warm cream, extra-round shapes, chunky rounded slab type, and a concentric sunrise motif. Earthy, optimistic, and unapologetically groovy.",
    notes: [
      "The palette is strictly warm earth-pop: burnt orange, mustard gold, chocolate brown on cream.",
      "A concentric-rings sunrise sits behind the hero as flat art.",
      "Buttons and chips are fat full pills; corners everywhere are very round.",
      "Display type is heavy, soft, and rounded; bar charts get half-round tops in alternating warm tones.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f7ecd7", ink: "#3d2417", accent: pick(r, ["#c65420", "#b8431f"]),
        accent2: pick(r, ["#d9a516", "#c98a12", "#e0b31c"]),
        surface: "#fcf4e4", border: "#c8b391", muted: "#7a5c42", dark: false,
      });
      g.fonts = { display: pick(r, ["slab", "rounded", "black"]), body: "humanist", mono: "typewriter" };
      g.radius = 20; g.ctl = 999; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "lower"]); g.hw = 800; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 22px; top: -14px; width: 150px; height: 150px; z-index: -1;
  border-radius: 50%;
  background: radial-gradient(circle,
    ${g.p.accent} 0 18%, ${g.p.accent2} 18% 34%, ${mix(g.p.accent, "#ffffff", 0.35)} 34% 48%,
    ${g.p.bg} 48% 100%);
  opacity: .9;
}
${s} .smain { z-index: 2; }
${s} .display { font-size: 46px; }
${s} .card { border-color: var(--ink); }
${s} .chip { background: ${mix(g.p.accent2, "#ffffff", 0.55)}; border-color: transparent; color: var(--ink); font-weight: 700; }
${s} .btn-b { border-color: var(--ink); border-width: 2px; }
${s} .kicker { color: var(--accent); letter-spacing: .2em; }
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle, ${g.p.accent} 0 40%, ${g.p.accent2} 40% 75%, ${g.p.ink} 75%); }
`;
    },
  },
];
