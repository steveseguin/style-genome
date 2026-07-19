// Pop family: loud, playful, hand-made and street-poster styles — kawaii cute,
// rave flyers, grunge gig posters, and cut-and-paste construction-paper collage.

import { pick, irange } from "../rng.js";
import { hslToHex, mix, alpha, onColor } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const popPack = [

  // ------------------------------------------------------------------ kawaii
  {
    id: "kawaii",
    name: "Kawaii",
    family: "pop",
    traits: ["playful", "soft", "vivid"],
    blurb:
      "Japanese kawaii cute-culture: a pale cream-pink page, strawberry-milk pink and soft mint accents, and warm cocoa-brown ink instead of hard black. Everything is ultra-rounded and pill-shaped; white cards wear thin cocoa outlines and a faint pink glow. A little flower stands in for the logo, chips are each prefixed with a heart, the kicker is a pink pill badge, and the rounded headline tilts a degree like it is gently bouncing. Sweet, babyface, and unapologetically adorable.",
    notes: [
      "The kicker is a filled pink pill badge with white text; the logo glyph is a pink ✿ flower on a transparent box instead of a solid square.",
      "White cards carry 2px cocoa-brown outlines and a soft pink drop shadow; every corner is a large radius and all controls are pills.",
      "Chips are pale-pink pills, each prefixed by a pink ♡ heart glyph.",
      "The rounded headline sits at heavy weight and rotates -1° for a gentle bounce; the stat delta is mint and charts plot pink-and-mint dots.",
    ],
    conform(g, r) {
      const cocoa = "#5a3a2e";
      g.p = pal({
        bg: "#fff2f4", ink: cocoa, accent: "#ff87ab", accent2: "#86dfc4",
        surface: "#ffffff", border: cocoa, muted: mix(cocoa, "#fff2f4", 0.4), dark: false,
      });
      g.fonts = { display: "rounded", body: pick(r, ["rounded", "humanist"]), mono: "mono" };
      g.radius = irange(r, 22, 26); g.ctl = 999; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "lower"]); g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["dots"]);
    },
    css(s, g) {
      return `
${s} .display { font-size: 40px; color: var(--ink); transform: rotate(-1deg); }
${s} .kicker {
  background: var(--accent); color: #ffffff; padding: 4px 12px;
  border-radius: 999px; align-self: flex-start; letter-spacing: .06em;
}
${s} .card { border-color: var(--ink); box-shadow: 0 5px 14px ${alpha(g.p.accent, 0.28)}; }
${s} .card-t { color: var(--ink); }
${s} .chip {
  background: ${mix(g.p.accent, "#ffffff", 0.82)};
  border-color: ${mix(g.p.accent, "#ffffff", 0.5)}; color: var(--ink); font-weight: 600;
}
${s} .chip::before { content: "♡ "; color: var(--accent); }
${s} .btn-a { box-shadow: 0 5px 12px ${alpha(g.p.accent, 0.4)}; font-weight: 700; }
${s} .btn-b { border-color: var(--ink); color: var(--ink); }
${s} .logo { background: transparent; width: auto; height: auto; border-radius: 0; }
${s} .logo::before { content: "✿"; color: var(--accent); font-size: 16px; line-height: 1; }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent2); }
${s} .topbar { border-bottom-color: var(--ink); }
${s} .foot { border-top-color: var(--ink); }
`;
    },
  },

  // -------------------------------------------------------------------- acid
  {
    id: "acid",
    name: "Acid Rave",
    family: "pop",
    traits: ["punk", "neon", "vivid"],
    blurb:
      "Y2K rave-flyer maximalism: a pure black ground and two clashing club colors — acid chartreuse and hot electric violet — with nothing in between. The headline is a huge, uppercase, black-weight slab skewed hard to the left in chartreuse. Cards are flat dark panels save one that flips to a solid acid-green block with black type. Buttons pair a chartreuse pill with a violet ghost, a faint dot grid and monospaced micro-labels finish the flyer. Loud, flat, and deliberately harsh — no soft glow, maximum clash.",
    notes: [
      "Pure-black page; only acid chartreuse and hot violet do the talking, over flat dark #111 panels with thin #333 grayscale borders.",
      "The display is a black-weight uppercase slab skewed -8° in chartreuse with tight tracking; the kicker takes a violet ☻ prefix.",
      "The middle card flips to a solid chartreuse fill with black type — its stat number, delta and sparkline are re-inked black via scoped CSS-variable overrides.",
      "The logo is an asymmetric chartreuse blob (60% 40% 55% 45% radius); buttons pair a chartreuse pill with a violet gray-outlined ghost; chips are mono uppercase micro-labels over a subtle dot texture.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#000000", ink: "#f2f2f2", accent: "#c8ff00", accent2: "#b44dff",
        surface: "#111111", surface2: "#1a1a1a", border: "#333333", muted: "#8a8a8a", dark: true,
      });
      g.fonts = { display: "black", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 999; g.bw = 1;
      g.shadow = "none"; g.texture = "dots";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = -0.03;
      g.chart = among(r, g.chart, ["dots"]);
    },
    css(s, g) {
      return `
${s} { background: #000000; }
${s} .display { color: var(--accent); transform: skewX(-8deg); font-size: 58px; line-height: 0.92; }
${s} .kicker { color: var(--accent2); }
${s} .kicker::before { content: "☻ "; color: var(--accent2); }
${s} .card-t { color: var(--accent); }
${s} .card:nth-child(2) {
  background: ${g.p.accent}; border-color: ${g.p.accent}; color: #0a0a0a;
  --ink: #0a0a0a; --accent: #0a0a0a; --accent2: #0a0a0a; --muted: #222222;
}
${s} .btn-a { background: var(--accent); color: #0a0a0a; box-shadow: none; font-weight: 800; }
${s} .btn-b { background: transparent; color: var(--accent2); border-color: #333333; }
${s} .chip {
  font-family: var(--f-mono); text-transform: uppercase; font-size: 9.5px;
  letter-spacing: .12em; border-color: #333333; border-radius: 0; color: var(--muted);
}
${s} .logo { background: var(--accent); border-radius: 60% 40% 55% 45%; width: 16px; height: 16px; }
${s} .topbar { border-bottom-color: #333333; }
${s} .foot { border-top-color: #333333; }
`;
    },
  },

  // ------------------------------------------------------------------ grunge
  {
    id: "grunge",
    name: "Grunge Poster",
    family: "pop",
    traits: ["punk", "raw", "texture"],
    blurb:
      "A 90s alt-rock gig poster: dark charcoal stock, dirty-cream ink, and a single bruised rust-red, all buried under heavy toner grain. The black-weight uppercase headline is roughly double-struck — a rust ghost down-right and a black ghost up-left — like a smeared photocopy. Cards read as pasted paper scraps: dirty-cream fills holding dark type, each torn to a slightly different irregular edge, tilted a degree or two, and dropped with a hard offset shadow. Typewriter body copy and stenciled mono chips complete the xeroxed, taped-to-a-lamppost feel.",
    notes: [
      "Dark charcoal ground with dirty-cream text and one rust-red accent, under a heavy grain texture overlay.",
      "The black-weight uppercase display gets a rough double-strike via twin text-shadows: a rust ghost at +1/+1 and a black ghost at -1/-1.",
      "Cards are dirty-cream paper scraps with scoped dark ink (so their text and hatched chart re-ink dark); each is rotated (-1.5° / 1° / -0.8°), given a different irregular border-radius, and a hard offset shadow.",
      "Chips are stenciled uppercase mono with 1px gray borders; the primary button is a slightly rotated rust slab; charts use rust hatched bars.",
    ],
    conform(g, r) {
      const rust = pick(r, ["#b1442a", "#a83a24", "#9e3f27"]);
      g.p = pal({
        bg: "#211e1a", ink: "#e7dabf", accent: rust, accent2: "#c98a3a",
        surface: "#d8cbb0", surface2: "#cfc1a4", border: "#6b6459",
        muted: mix("#e7dabf", "#211e1a", 0.42), dark: true,
      });
      g.fonts = { display: "black", body: "typewriter", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 0;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = "upper"; g.hw = 900; g.track = 0.01;
      g.chart = "bars-hatch";
    },
    css(s, g) {
      const paperInk = "#2a251d";
      const paperMuted = "#6f6151";
      const stencil = "#7a7266";
      return `
${s} .display {
  color: var(--ink); font-size: 52px;
  text-shadow: 1px 1px 0 ${alpha(g.p.accent, 0.6)}, -1px -1px 0 ${alpha("#000000", 0.4)};
}
${s} .kicker { color: ${mix(g.p.accent, g.p.ink, 0.25)}; font-family: var(--f-mono); letter-spacing: .1em; }
${s} .card {
  background: var(--surface); box-shadow: 5px 6px 0 ${alpha("#000000", 0.5)};
  --ink: ${paperInk}; --muted: ${paperMuted}; color: ${paperInk};
}
${s} .card:nth-child(1) { transform: rotate(-1.5deg); border-radius: 1px 8px 2px 6px; }
${s} .card:nth-child(2) { transform: rotate(1deg); border-radius: 6px 2px 7px 1px; }
${s} .card:nth-child(3) { transform: rotate(-0.8deg); border-radius: 2px 6px 1px 8px; }
${s} .chip {
  border: 1px solid ${stencil}; border-radius: 0; text-transform: uppercase;
  font-family: var(--f-mono); letter-spacing: .1em; font-size: 10px; color: ${paperInk};
}
${s} .stat-delta { color: var(--accent); }
${s} .btn-a {
  background: var(--accent); color: var(--ink);
  box-shadow: 3px 3px 0 ${alpha("#000000", 0.45)}; transform: rotate(-1.2deg);
}
${s} .btn-b { background: transparent; color: var(--ink); border: 1px solid ${stencil}; transform: rotate(0.5deg); }
${s} .logo { background: var(--accent); border-radius: 2px 5px 1px 4px; }
`;
    },
  },

  // ----------------------------------------------------------------- collage
  {
    id: "collage",
    name: "Cut & Paste",
    family: "pop",
    traits: ["playful", "layered", "vivid"],
    blurb:
      "Construction-paper cut-and-paste: a warm-white desk on which three cards become bright torn paper blocks, tinted from one seed hue and its 120°/240° rotations at a soft pastel level. Each block tilts its own way, carries a scissor-cut irregular edge and a hard offset shadow, and holds dark ink text. The headline is pasted onto a strip of a fourth paper tint; chips are little torn white lozenges with tiny rotations; the logo is a round sticker haloed in white. Buttons are chunky with solid ink borders and bar charts pull the two accents. Loud, layered, handmade multicolor geometry.",
    notes: [
      "One seed hue drives three pastel paper tints (hue, +120°, +240° at ~70% sat / ~85% light); each card takes one, rotated differently with an irregular scissor-cut border-radius and a hard offset ink-tinted shadow.",
      "The black-weight headline is inline-pasted onto a strip of a fourth paper tint (box-decoration-break: clone) and tilted -1°; the kicker is a tilted colored-paper label.",
      "Chips are torn white lozenges with irregular radii and tiny opposing rotations.",
      "The logo is a round accent sticker with a 4px white halo; buttons are chunky with 2px ink borders; bar charts use both accents.",
    ],
    conform(g, r) {
      const hue = irange(r, 0, 359);
      g.p = pal({
        bg: "#faf5ec", ink: "#221f1a",
        accent: hslToHex(hue, 75, 52), accent2: hslToHex(hue + 120, 70, 52),
        surface: hslToHex(hue, 70, 85), surface2: hslToHex(hue + 120, 70, 85),
        border: "#e4d9c8", muted: "#6f665a", dark: false,
      });
      g.p.paper3 = hslToHex(hue + 240, 70, 85);
      g.p.strip = hslToHex(hue + 60, 72, 82);
      g.fonts = { display: "black", body: pick(r, ["humanist", "grotesk"]), mono: "mono" };
      g.radius = 6; g.ctl = 6; g.bw = 0;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["bars"]);
    },
    css(s, g) {
      return `
${s} .display {
  display: inline; background: ${g.p.strip}; color: var(--ink); padding: 2px 10px;
  box-decoration-break: clone; -webkit-box-decoration-break: clone;
  transform: rotate(-1deg); font-size: 46px; line-height: 1.24;
}
${s} .kicker {
  align-self: flex-start; background: ${g.p.paper3}; color: var(--ink); padding: 3px 10px;
  border-radius: 7px 2px 8px 3px; transform: rotate(-1.5deg); letter-spacing: .08em;
}
${s} .card { border: none; color: var(--ink); box-shadow: 5px 6px 0 ${alpha(g.p.ink, 0.25)}; }
${s} .card:nth-child(1) { background: ${g.p.surface}; transform: rotate(-1.5deg); border-radius: 2px 14px 4px 10px; }
${s} .card:nth-child(2) { background: ${g.p.surface2}; transform: rotate(1deg); border-radius: 12px 3px 11px 5px; }
${s} .card:nth-child(3) { background: ${g.p.paper3}; transform: rotate(-0.7deg); border-radius: 4px 12px 2px 14px; }
${s} .card-t { color: var(--ink); }
${s} .stat-num { color: var(--ink); }
${s} .stat-delta { color: var(--accent); }
${s} .chip {
  background: #ffffff; border: none; border-radius: 8px 3px 9px 2px;
  transform: rotate(-2deg); color: var(--ink); font-weight: 600;
}
${s} .chip:nth-child(2) { transform: rotate(1.6deg); border-radius: 3px 9px 2px 8px; }
${s} .chip:nth-child(3) { transform: rotate(-0.8deg); }
${s} .btn { border: 2px solid var(--ink); box-shadow: 3px 3px 0 ${alpha(g.p.ink, 0.25)}; font-weight: 700; }
${s} .btn-a { background: var(--accent); color: ${onColor(g.p.accent)}; }
${s} .btn-b { background: #ffffff; color: var(--ink); }
${s} .logo {
  border-radius: 50%; background: var(--accent); width: 15px; height: 15px;
  box-shadow: 0 0 0 4px #ffffff, 2px 3px 4px ${alpha(g.p.ink, 0.2)};
}
`;
    },
  },
];
