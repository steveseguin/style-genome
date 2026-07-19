// Future family: forward-looking screen aesthetics — UX wireframes, low-poly
// gem renders, deep-space interfaces, and modular bento product pages.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const futureSpace = [

  // -------------------------------------------------------------- wireframe
  {
    id: "wireframe",
    name: "Wireframe",
    family: "future",
    traits: ["minimal", "technical", "raw"],
    blurb:
      "A UX wireframe played straight: white ground, every element drawn in thin cool-gray outlines with no fills anywhere, placeholder conventions on display — the logo an empty crossed box, image regions boxed with a diagonal X. A single annotation blue is reserved for measurement labels; type is grotesk for headings and monospaced for the bracketed annotations that frame every title. Deliberately unfinished, structural, honest about being a sketch.",
    notes: [
      "No fills at all: cards, buttons, and the logo are transparent with 1px cool-gray outlines (#94a3b8 family); depth and color are withheld on purpose.",
      "Placeholder art: the logo is an empty box crossed by a diagonal X (two thin linear-gradient lines), and the stat card's spark area becomes a boxed image placeholder with the same X.",
      "Card titles are wrapped in muted monospace brackets via ::before '[ ' and ::after ' ]'; chips are bracketed mono labels rather than pills.",
      "The lone annotation blue appears only as measurement text — a monospace kicker prefixed with a ruler arrow and the stat delta; buttons stay gray (btn-a solid outline, btn-b dashed).",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#ffffff", ink: "#475569", accent: "#2563eb", accent2: "#64748b",
        surface: "#ffffff", surface2: "#ffffff", border: "#94a3b8", muted: "#94a3b8", dark: false,
      });
      g.fonts = { display: "grotesk", body: "grotesk", mono: "mono" };
      g.radius = pick(r, [2, 3, 4]); g.ctl = pick(r, [2, 3, 4]); g.bw = 1;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = 500; g.track = 0;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const line = `var(--border) calc(50% - 0.6px), var(--border) calc(50% + 0.6px)`;
      return `
${s} .logo {
  background:
    linear-gradient(to top right, transparent calc(50% - 0.6px), ${line}, transparent calc(50% + 0.6px)),
    linear-gradient(to bottom right, transparent calc(50% - 0.6px), ${line}, transparent calc(50% + 0.6px));
  border: 1px solid var(--border); border-radius: 0;
}
${s} .card-t { font-weight: 500; }
${s} .card-t::before { content: "[ "; color: var(--muted); font-family: var(--f-mono); }
${s} .card-t::after { content: " ]"; color: var(--muted); font-family: var(--f-mono); }
${s} .kicker { color: var(--accent); font-family: var(--f-mono); letter-spacing: .04em; }
${s} .kicker::before { content: "\\2194  "; }
${s} .stat-delta { color: var(--accent); font-family: var(--f-mono); font-weight: 500; }
${s} .stat-num { color: var(--ink); }
${s} .spark {
  height: 46px; border: 1px solid var(--border);
  background:
    linear-gradient(to top right, transparent calc(50% - 0.5px), ${line}, transparent calc(50% + 0.5px)),
    linear-gradient(to bottom right, transparent calc(50% - 0.5px), ${line}, transparent calc(50% + 0.5px));
}
${s} .spark polyline { display: none; }
${s} .btn-a { background: transparent; color: var(--ink); border-color: var(--border); box-shadow: none; }
${s} .btn-b { border-style: dashed; border-color: var(--border); color: var(--ink); }
${s} .chip {
  border: none; padding: 3px 2px; font-family: var(--f-mono); color: var(--muted); font-size: 10.5px;
}
${s} .chip::before { content: "["; color: var(--muted); }
${s} .chip::after { content: "]"; color: var(--muted); }
${s} .sub { color: var(--muted); }
`;
    },
  },

  // ---------------------------------------------------------------- faceted
  {
    id: "faceted",
    name: "Faceted Poly",
    family: "future",
    traits: ["vivid", "modern", "geometric"],
    blurb:
      "A low-poly gemstone render: a light neutral ground faintly tinted with the jewel hue, and a large faceted crystal formation blooming from the upper-right corner behind the content — overlapping angular slivers of the accent and its neighbor cut by hard-stop gradients at clashing angles. The mark is a crisp accent triangle; headings are heavy geometric with tight tracking; cards stay clean white with a single hairline. Sharp, saturated, and precisely cut.",
    notes: [
      "A crystal formation sits in the upper-right at z-index 1 (behind all content): four overlapping hard-stop linear-gradients at different angles paint triangular jewel-tone slivers, clipped to a gem silhouette.",
      "Facet fills are the saturated accent, its +40deg neighbor, and a whitened highlight, all at moderate alpha so the headline stays readable over the ground.",
      "The logo is a clip-path triangle filled solid accent; buttons are angular with a small control radius and a solid accent primary.",
      "Cards are clean white with a 1px neutral border and a 6px radius; the jewel palette is seeded from one hue with a saturated accent and an accent2 forty degrees away.",
    ],
    conform(g, r) {
      const hue = pick(r, [265, 210, 335, 190, 250, 350, 160]);
      const accent = hslToHex(hue, 74, 52);
      const accent2 = hslToHex(hue + 40, 66, 50);
      g.p = pal({
        bg: hslToHex(hue, 12, 96), ink: hslToHex(hue, 22, 12), accent, accent2,
        surface: "#ffffff", border: hslToHex(hue, 16, 88), muted: hslToHex(hue, 12, 42), dark: false,
      });
      g.fonts = { display: "geometric", body: "humanist", mono: "mono" };
      g.radius = 6; g.ctl = pick(r, [3, 4]); g.bw = 1;
      g.shadow = among(r, g.shadow, ["lifted", "soft"]); g.texture = "none";
      g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 800; g.track = -0.02;
      g.chart = "area";
    },
    css(s, g) {
      const hi = mix(g.p.accent, "#ffffff", 0.4);
      return `
${s}::after {
  content: ""; position: absolute; top: -34px; right: -26px; width: 330px; height: 300px;
  z-index: 1; pointer-events: none;
  clip-path: polygon(34% 0, 100% 6%, 100% 74%, 60% 100%, 16% 58%, 0 22%);
  background:
    linear-gradient(122deg, transparent 42%, ${alpha(g.p.accent, 0.30)} 42% 58%, transparent 58%),
    linear-gradient(56deg, transparent 48%, ${alpha(g.p.accent2, 0.26)} 48% 66%, transparent 66%),
    linear-gradient(164deg, transparent 50%, ${alpha(hi, 0.30)} 50% 72%, transparent 72%),
    linear-gradient(22deg, transparent 55%, ${alpha(g.p.accent2, 0.20)} 55% 80%, transparent 80%);
}
${s} .topbar, ${s} .smain, ${s} .foot { z-index: 2; }
${s} .logo { background: var(--accent); border-radius: 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
${s} .display { font-size: 46px; }
${s} .kicker { color: var(--accent); }
${s} .card { background: #ffffff; }
${s} .stat-num { color: var(--accent); }
${s} .btn-a { box-shadow: 0 6px 14px ${alpha(g.p.accent, 0.28)}; }
${s} .chip { border-color: var(--border); color: var(--muted); }
`;
    },
  },

  // ------------------------------------------------------------------ cosmic
  {
    id: "cosmic",
    name: "Deep Space",
    family: "future",
    traits: ["dark", "airy", "elegant"],
    blurb:
      "The void, handled with restraint: a near-black indigo ground scattered with a field of tiny white pinprick stars at varying brightness, plus one faint violet-into-teal nebula bloom glowing off the top edge. Silver-white ink, an ultra-thin display face, and uppercase micro-labels tracked wide. Cards are barely-there translucent white panels; the primary button is a solid white 'launch' key. Ninety-five percent black, elegant, and quiet.",
    notes: [
      "The ground is a near-black indigo with a background-image starfield of eight tiny white radial-gradient points at scattered positions and mixed alpha (.4–.9), plus one large low-alpha violet/teal nebula radial-gradient.",
      "Cards are alpha(white,.04) fills with hairline alpha-white borders; the topbar and foot use faint white rules. Density is airy, shadows off.",
      "Type is thin (hw 400) with uppercase micro-labels (kicker, stat-label) tracked to .2em; the primary button is solid white with dark ink, the secondary a hairline outline.",
      "The chart is a line whose dots are restyled bright white and whose stroke is faint white, so the plot reads as a constellation.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#070813", ink: "#e7e9f4", accent: "#a78bfa", accent2: "#5eead4",
        surface: "#0d0f20", border: mix("#070813", "#ffffff", 0.14), muted: "#8b90ad", dark: true,
      });
      g.fonts = { display: pick(r, ["didone", "geometric"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [10, 12, 14]); g.ctl = pick(r, [8, 999]); g.bw = 1;
      g.shadow = among(r, g.shadow, ["none", "soft"]); g.texture = "none";
      g.density = "airy";
      g.case = "none"; g.hw = 400; g.track = 0;
      g.chart = "line";
    },
    css(s, g) {
      const star = (a) => alpha("#ffffff", a);
      return `
${s} {
  background-color: var(--bg);
  background-repeat: no-repeat;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 22%, ${star(0.9)}, transparent),
    radial-gradient(1px 1px at 27% 66%, ${star(0.55)}, transparent),
    radial-gradient(1px 1px at 44% 14%, ${star(0.5)}, transparent),
    radial-gradient(1.4px 1.4px at 61% 80%, ${star(0.8)}, transparent),
    radial-gradient(1px 1px at 72% 33%, ${star(0.6)}, transparent),
    radial-gradient(1.3px 1.3px at 84% 57%, ${star(0.7)}, transparent),
    radial-gradient(1px 1px at 91% 12%, ${star(0.5)}, transparent),
    radial-gradient(1px 1px at 8% 86%, ${star(0.45)}, transparent),
    radial-gradient(560px 420px at 80% 4%, ${alpha(g.p.accent, 0.14)} 0, ${alpha(g.p.accent2, 0.06)} 45%, transparent 72%);
}
${s} .card { background: ${alpha("#ffffff", 0.04)}; border: 1px solid ${alpha("#ffffff", 0.12)}; }
${s} .kicker, ${s} .stat-label { letter-spacing: .2em; }
${s} .kicker { color: var(--accent2); }
${s} .display { font-size: 46px; }
${s} .btn-a { background: #ffffff; color: #0a0b16; border-color: #ffffff; box-shadow: none; }
${s} .btn-b { background: transparent; border-color: ${alpha("#ffffff", 0.25)}; color: var(--ink); }
${s} .chart circle { fill: #ffffff; }
${s} .chart polyline { stroke: ${alpha("#ffffff", 0.45)}; stroke-width: 1.3; }
${s} .spark polyline { stroke: ${alpha("#ffffff", 0.5)}; }
${s} .topbar { border-bottom-color: ${alpha("#ffffff", 0.1)}; }
${s} .foot { border-top-color: ${alpha("#ffffff", 0.1)}; }
${s} .logo { background: var(--accent); }
`;
    },
  },

  // ------------------------------------------------------------------- bento
  {
    id: "bento",
    name: "Bento Grid",
    family: "future",
    traits: ["minimal", "modern", "soft"],
    blurb:
      "A contemporary bento-box product page where everything is a rounded, borderless tile floating on a soft warm-gray ground (occasionally a dark one). The hero itself is the big feature tile — a surface-filled rounded panel with generous padding — and the cards below are smaller tiles in gently alternating tints: plain surface, a faint accent-washed fill, and a slightly deeper neutral. Compact heavy type, tight gaps, tiny neutral pill chips, and rounded-top bars. Modular, tactile, and calm.",
    notes: [
      "Everything is a tile: the hero gets a var(--surface) fill, var(--radius) corners, and roomy padding so it reads as the feature panel; all borders are removed (bw 0) and depth comes from a soft lifted shadow.",
      "Cards alternate subtle tints — surface, a faint accent-tinted fill via mix(accent, bg, .88), and surface2 — so the grid reads as related tiles rather than boxes.",
      "Light warm-gray ground by default, dark warm ground about 30% of the time; the topbar and foot stay borderless and quiet.",
      "Compact display with tight tracking (-0.02, hw 700), chips are tiny neutral pills, and the bar chart carries rounded tops.",
    ],
    conform(g, r) {
      const dark = chance(r, 0.3);
      const acc = pick(r, ["#6366f1", "#0ea5e9", "#f97316", "#10b981", "#8b5cf6", "#ec4899"]);
      if (dark) {
        g.p = pal({
          bg: "#17171b", ink: "#eceaf2", accent: acc, accent2: mix(acc, "#ffffff", 0.2),
          surface: "#212127", surface2: "#2a2a31", border: "#212127", muted: "#9a99a6", dark: true,
        });
      } else {
        g.p = pal({
          bg: "#f1efea", ink: "#221f1b", accent: acc, accent2: mix(acc, "#111111", 0.15),
          surface: "#ffffff", surface2: "#e9e6df", border: "#ffffff", muted: "#6c6960", dark: false,
        });
      }
      g.fonts = { display: pick(r, ["grotesk", "geometric"]), body: "humanist", mono: "mono" };
      g.radius = pick(r, [16, 18, 20]); g.ctl = pick(r, [10, 12, 999]); g.bw = 0;
      g.shadow = "lifted"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = -0.02;
      g.chart = "bars";
    },
    css(s, g) {
      const tint = mix(g.p.accent, g.p.bg, 0.88);
      return `
${s} .hero {
  background: var(--surface); border-radius: var(--radius);
  padding: calc(var(--sp) * 2.8) calc(var(--sp) * 3);
  box-shadow: var(--shadow);
}
${s} .card { border: none; }
${s} .card:nth-child(1) { background: var(--surface); }
${s} .card:nth-child(2) { background: ${tint}; }
${s} .card:nth-child(3) { background: var(--surface2); }
${s} .display { font-size: 42px; }
${s} .chip {
  background: var(--surface2); border: none; border-radius: 999px;
  color: var(--muted); font-size: 10px; padding: 3px 9px;
}
${s} .btn-b { background: var(--surface2); border: none; color: var(--ink); }
${s} .logo { border-radius: 5px; }
${s} .topbar, ${s} .foot { border: none; }
${s} .stat-num { color: var(--accent); }
`;
    },
  },
];
