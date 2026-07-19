// Heritage family: classic decorative traditions — fin-de-siècle ornament,
// East-Asian ink painting, Islamic geometry, and mid-century op art.

import { pick, irange, chance } from "../rng.js";
import { alpha, mix, onColor, contrast } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const heritageClassic = [

  // -------------------------------------------------------------- artnouveau
  {
    id: "artnouveau",
    name: "Art Nouveau",
    family: "heritage",
    traits: ["ornate", "elegant", "natural"],
    blurb:
      "Fin-de-siècle ornament in the spirit of Mucha and Horta: a cream ground carrying muted sage-green, dusty plum, and old-gold, with whiplash organic curves. Panels are framed as asymmetric petals with fine double rules, headlines are italic high-contrast serif underlined by a hand-drawn wave, and small-caps gold labels and stray fleurons lend the page the air of a decorative poster.",
    notes: [
      "Cards are framed as asymmetric organic petals — large mismatched corner radii (e.g. 42px 8px 36px 8px) that differ per card — inside fine 3px double neutral rules.",
      "The display is italic didone underlined with a wavy sage rule; card titles are plum italic tailed by a muted ❧ fleuron.",
      "The kicker is small-caps old-gold at wide tracking; the logo mark is a gold petal (two rounded corners).",
      "The palette is fin-de-siècle: sage-green primary, dusty plum secondary, old-gold jewelry, deep olive-brown ink on cream.",
    ],
    conform(g, r) {
      const sage = pick(r, ["#6e7d4f", "#71804f", "#67794d"]);
      const plum = pick(r, ["#7a4a62", "#75415c", "#7f5069"]);
      const gold = pick(r, ["#ac8730", "#b08d3e", "#a67f2c"]);
      g.p = pal({
        bg: "#f4ecd7", ink: "#382f1d", accent: sage, accent2: plum,
        surface: "#faf4e3", muted: "#736745", dark: false,
      });
      g.p.gold = gold;
      g.fonts = { display: "didone", body: pick(r, ["oldstyle", "humanist"]), mono: "mono" };
      g.radius = 8; g.ctl = 6; g.bw = 1;
      g.shadow = among(r, g.shadow, ["none", "soft"]);
      g.texture = among(r, g.texture, ["none", "paper"]);
      g.density = among(r, g.density, ["airy", "normal"]);
      g.case = "none"; g.hw = pick(r, [400, 500]); g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      return `
${s} .display {
  font-style: italic; font-size: 46px; line-height: 1.1;
  text-decoration: underline; text-decoration-style: wavy;
  text-decoration-color: var(--accent); text-decoration-thickness: 1.5px;
  text-underline-offset: 7px;
}
${s} .kicker {
  color: ${g.p.gold}; text-transform: none; font-variant: small-caps;
  letter-spacing: .22em; font-weight: 600; font-size: 12.5px;
}
${s} .card { border: 3px double var(--border); border-radius: 42px 8px 36px 8px; }
${s} .card:nth-child(2) { border-radius: 8px 40px 8px 34px; }
${s} .card:nth-child(3) { border-radius: 38px 8px 44px 8px; }
${s} .card-t { color: var(--accent2); font-style: italic; }
${s} .card-t::after { content: " ❧"; color: var(--muted); }
${s} .chip { border-color: var(--border); color: var(--ink); }
${s} .btn-a { letter-spacing: .04em; }
${s} .btn-b { border-color: var(--border); font-style: italic; }
${s} .stat-num { color: var(--accent2); }
${s} .stat-delta { color: var(--accent); }
${s} .logo { background: ${g.p.gold}; border-radius: 50% 0 50% 0; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // --------------------------------------------------------------------- sumi
  {
    id: "sumi",
    name: "Ink Wash",
    family: "heritage",
    traits: ["minimal", "calm", "print"],
    blurb:
      "Sumi-e ink painting: a washi off-white ground with the brush itself as the composition — one broad soft diagonal ink smear sweeping into the upper right and a smaller stroke settling lower left, both barely there. Near-black sumi ink at a single light weight, oldstyle serif set small and airy, borderless cards divided only by hairlines, and exactly one vermilion — the small seal-square logo and the kicker — for the whole page.",
    notes: [
      "The hero carries the brush: two rotated soft radial ink washes (a broad smear upper-right at ~12% ink, a smaller stroke lower-left at ~7%) sit behind the headline as composition.",
      "Vermilion appears exactly twice — the tiny square seal logo and the kicker — everything else is sumi ink or gray, including the deliberately thin ink chart line.",
      "Cards drop their boxes: transparent, no shadow, a single 1px bottom hairline; chips are plain words joined by a ・ separator.",
      "Type is a modest oldstyle serif at regular weight (nothing bold), sized down, with generous airy spacing.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f5f2e9", ink: "#22201c", accent: "#c1402a", accent2: "#8a857a",
        surface: "#f5f2e9", border: "#ddd8cb", muted: "#7d786c", dark: false,
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
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; inset: -30px -50px -110px -40px; z-index: -1; pointer-events: none;
  background:
    radial-gradient(58% 20% at 78% 24%, ${alpha(g.p.ink, 0.12)}, transparent 70%),
    radial-gradient(40% 14% at 20% 82%, ${alpha(g.p.ink, 0.07)}, transparent 72%);
  transform: rotate(-15deg);
}
${s} .smain { z-index: 2; }
${s} .display { font-size: 40px; font-weight: 400; line-height: 1.3; }
${s} .sub { font-size: 14.5px; }
${s} .kicker { color: var(--accent); letter-spacing: .26em; font-weight: 400; }
${s} .card {
  background: transparent; border: none; border-bottom: 1px solid var(--border);
  border-radius: 0; padding-left: 0; padding-right: 0;
}
${s} .chip { border: none; padding: 0; color: var(--muted); }
${s} .chip + .chip::before { content: "・"; color: var(--muted); margin: 0 4px 0 2px; }
${s} .btn-a { background: var(--ink); color: var(--bg); font-weight: 400; letter-spacing: .06em; }
${s} .btn-b { border-color: var(--border); font-weight: 400; }
${s} .stat-num { font-weight: 400; }
${s} .stat-delta { color: var(--muted); font-weight: 400; }
${s} .chart polyline { stroke: var(--ink); stroke-width: 1.4; }
${s} .chart circle { fill: var(--ink); }
${s} .spark polyline { stroke: var(--muted); }
${s} .logo { background: var(--accent); border-radius: 2px; width: 12px; height: 12px; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ---------------------------------------------------------------- arabesque
  {
    id: "arabesque",
    name: "Geometric Arabesque",
    family: "heritage",
    traits: ["ornate", "pattern", "elegant"],
    blurb:
      "Islamic geometric ornament: an ivory ground woven with a whisper-subtle eight-fold star lattice, deep teal and old-gold carrying every accent. Cards are ivory tablets inside fine double rules with roomy padding and centered titles crowned by a small gold ✦; the mark is an eight-point star, headings are uppercase geometric caps at open tracking, and dot charts scatter like tesserae. All ornament lives in the pattern and the frames — never in a colored edge.",
    notes: [
      "The whole ground is a tiled eight-fold star lattice: two offset repeating-conic-gradients at ≤5% alpha (teal and gold) that read as an interlaced geometric weave behind the content.",
      "Cards are ivory tablets with fine 3px double neutral rules and generous padding; titles are centered with a small gold ✦ before them.",
      "The logo is an eight-point star cut by clip-path in teal; the primary button fills teal with gold text where contrast allows, else auto on-color.",
      "Type is uppercase geometric at .08em tracking; the palette is ivory, deep-teal, and old-gold; the chart scatters teal/gold dots.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f4efe2", ink: "#28302c", accent: "#1c6e68", accent2: "#ac8730",
        surface: "#faf6ea", border: "#d8cdb3", muted: "#6b6a5a", dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "didone"]), body: "humanist", mono: "mono" };
      g.radius = 4; g.ctl = 4; g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "upper"; g.hw = 600; g.track = 0.08;
      g.chart = "dots";
    },
    css(s, g) {
      const goldText = contrast(g.p.accent2, g.p.accent) >= 3 ? g.p.accent2 : onColor(g.p.accent);
      const star =
        "polygon(50% 0%, 57.7% 31.5%, 85.4% 14.6%, 68.5% 42.3%, 100% 50%, 68.5% 57.7%, " +
        "85.4% 85.4%, 57.7% 68.5%, 50% 100%, 42.3% 68.5%, 14.6% 85.4%, 31.5% 57.7%, " +
        "0% 50%, 31.5% 42.3%, 14.6% 14.6%, 42.3% 31.5%)";
      return `
${s} {
  background:
    repeating-conic-gradient(from 0deg at 50% 50%, ${alpha(g.p.accent, 0.05)} 0deg 22.5deg, transparent 22.5deg 45deg) 0 0 / 56px 56px,
    repeating-conic-gradient(from 22.5deg at 50% 50%, ${alpha(g.p.accent2, 0.05)} 0deg 22.5deg, transparent 22.5deg 45deg) 28px 28px / 56px 56px,
    var(--bg);
}
${s} .display { font-size: 40px; }
${s} .kicker { color: var(--accent2); letter-spacing: .18em; }
${s} .card { background: var(--surface); border: 3px double var(--border); padding: calc(var(--sp) * 2.4); }
${s} .card-t { text-align: center; }
${s} .card-t::before { content: "✦ "; color: var(--accent2); }
${s} .chip { border-color: var(--border); color: var(--ink); border-radius: 0; }
${s} .btn-a { color: ${goldText}; letter-spacing: .06em; }
${s} .btn-b { border-color: var(--border); }
${s} .stat-num { color: var(--accent); }
${s} .logo { background: var(--accent); border-radius: 0; clip-path: ${star}; }
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // -------------------------------------------------------------------- opart
  {
    id: "opart",
    name: "Op Art",
    family: "heritage",
    traits: ["pattern", "highcontrast", "bold"],
    blurb:
      "Riley/Vasarely optical art in strict black and white: an ultra-heavy uppercase headline, a field of fine vertical stripes vibrating out of the upper-right corner, and a checkerboard logo. Cards are white with crisp 2px ink frames and no shadow — one carries a faint stripe wash behind readable text; buttons invert black-on-white against white-on-black; charts are drawn as open outlines; every corner is square. No hue anywhere, only value and pattern doing the work.",
    notes: [
      "Strictly monochrome: ink black is the only accent, a mid gray the second — no color at all, corners all square, no shadows.",
      "The hero radiates a masked field of fine 2px black/white vertical stripes fading out of the upper-right corner (a radial mask concentrates the vibration).",
      "The logo is a small hard checkerboard (repeating-conic-gradient tiled at 8px); the second card carries a faint 6%-ink stripe wash behind still-readable text.",
      "Buttons invert (solid black vs. white with a 2px ink outline), chips are 2px ink boxes, and the chart is drawn as open bar outlines.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#ffffff", ink: "#0a0a0a", accent: "#0a0a0a", accent2: "#8a8a8a",
        surface: "#ffffff", surface2: "#f0f0f0", border: "#0a0a0a", muted: "#5a5a5a", dark: false,
      });
      g.fonts = { display: "black", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 900; g.track = -0.02;
      g.chart = "bars-outline";
    },
    css(s, g) {
      return `
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; top: -12px; right: -30px; width: 240px; height: 160px; z-index: -1;
  background: repeating-linear-gradient(90deg, #0a0a0a 0 2px, #ffffff 2px 5px);
  -webkit-mask-image: radial-gradient(130% 130% at 100% 0%, #000 0, #000 38%, transparent 72%);
  mask-image: radial-gradient(130% 130% at 100% 0%, #000 0, #000 38%, transparent 72%);
  opacity: .55;
}
${s} .smain { z-index: 2; }
${s} .display { font-size: 62px; line-height: .95; }
${s} .kicker { color: var(--ink); }
${s} .card { border: 2px solid var(--ink); border-radius: 0; box-shadow: none; }
${s} .card:nth-child(2) {
  background-color: #ffffff;
  background-image: repeating-linear-gradient(90deg, ${alpha(g.p.ink, 0.06)} 0 2px, transparent 2px 6px);
}
${s} .btn-a { background: var(--ink); color: #ffffff; }
${s} .btn-b { background: #ffffff; color: var(--ink); border: 2px solid var(--ink); }
${s} .chip { border: 2px solid var(--ink); color: var(--ink); border-radius: 0; font-weight: 700; }
${s} .stat-num { font-size: 36px; }
${s} .stat-delta { color: var(--ink); }
${s} .logo { border-radius: 0; background: repeating-conic-gradient(#0a0a0a 0 25%, #ffffff 0 50%) 0 0 / 8px 8px; }
${s} .topbar { border-bottom: 2px solid var(--ink); }
${s} .foot { border-top: 2px solid var(--ink); }
`;
    },
  },
];
