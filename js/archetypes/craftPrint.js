// Craft family: styles borrowed from physical making — the letterpress shop,
// the stained-glass window, the terrazzo floor, and holographic foil stamping.
// Each one leans on a single tactile, hand-made signature move.

import { pick, irange } from "../rng.js";
import { mix, alpha, onColor } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const craftPrint = [

  // ------------------------------------------------------------- letterpress
  {
    id: "letterpress",
    name: "Letterpress",
    family: "craft",
    traits: ["print", "elegant", "texture"],
    blurb:
      "A hand-set letterpress broadside on warm cotton stock: one deep umber-charcoal ink pressed into toothy cream paper, headings debossed so the type reads punched into the sheet, and small centered diamond ornaments dividing each block. Buttons feel physically pushed in. Artisanal, quiet, and unmistakably printed by impression rather than screen.",
    notes: [
      "Headings, brand, and stat figures are debossed: colored slightly lighter than the full ink with a single white lower highlight (text-shadow 0 1px 0), so they read pressed into the paper.",
      "Buttons carry inset shadows instead of drop shadows — a dark top-inner shadow with a thin light bottom edge, as if pushed into the stock.",
      "Card titles are centered with a small muted diamond ornament rule (◆ ◆ ◆) beneath them; masthead and footer use a fine double rule.",
      "A single deep ink over paper-grain texture; all type is uppercase small-caps style with wide tracking and hatched bar charts.",
    ],
    conform(g, r) {
      const ink = pick(r, ["#3a2a1a", "#332a22", "#2c2620", "#40301c"]);
      g.p = pal({
        bg: "#f1e7d3", ink, accent: ink, accent2: mix(ink, "#f1e7d3", 0.35),
        surface: "#f6efdd", surface2: "#efe5cf", border: "#cbb894", muted: mix(ink, "#f1e7d3", 0.42),
        dark: false,
      });
      g.fonts = { display: pick(r, ["oldstyle", "didone"]), body: "oldstyle", mono: "typewriter" };
      g.radius = pick(r, [0, 2]); g.ctl = pick(r, [0, 2]); g.bw = 1;
      g.shadow = "none"; g.texture = "paper";
      g.density = "normal";
      g.case = "upper"; g.hw = pick(r, [500, 600]); g.track = pick(r, [0.08, 0.1, 0.12]);
      g.chart = "bars-hatch";
    },
    css(s, g) {
      const deb = mix(g.p.ink, g.p.bg, 0.3);
      return `
${s} .display {
  color: ${deb}; text-shadow: 0 1px 0 rgba(255,255,255,.7);
  font-size: 36px; line-height: 1.1;
}
${s} .brand { color: ${deb}; text-shadow: 0 1px 0 rgba(255,255,255,.7); }
${s} .stat-num { color: ${deb}; text-shadow: 0 1px 0 rgba(255,255,255,.7); }
${s} .kicker { color: var(--muted); letter-spacing: .24em; }
${s} .topbar { border-bottom: 3px double var(--border); }
${s} .foot { border-top: 3px double var(--border); }
${s} .card { background: var(--surface); border-color: var(--border); }
${s} .card-t { text-align: center; color: ${deb}; text-shadow: 0 1px 0 rgba(255,255,255,.7); }
${s} .card-t::after {
  content: "◆  ◆  ◆"; display: block; margin-top: 7px;
  font-size: 8px; color: var(--muted); letter-spacing: .1em; text-shadow: none;
}
${s} .btn {
  box-shadow: inset 0 2px 3px rgba(0,0,0,.2), inset 0 -1px 0 rgba(255,255,255,.55);
}
${s} .btn-a {
  background: var(--ink); color: var(--bg);
  box-shadow: inset 0 2px 4px rgba(0,0,0,.5), inset 0 -1px 0 rgba(255,255,255,.12);
}
${s} .btn-b { background: var(--surface); border-color: var(--border); color: var(--ink); }
${s} .chip {
  background: var(--surface2); border-color: var(--border); color: var(--ink);
  letter-spacing: .06em; text-transform: uppercase; font-size: 10px;
}
${s} .stat-delta { color: ${mix(g.p.ink, g.p.bg, 0.2)}; }
${s} .logo { border-radius: 50%; background: var(--ink); box-shadow: inset 0 1px 1px rgba(255,255,255,.25); }
`;
    },
  },

  // ------------------------------------------------------------ stained glass
  {
    id: "stained",
    name: "Stained Glass",
    family: "craft",
    traits: ["ornate", "vivid", "dark"],
    blurb:
      "A leaded cathedral window at dusk: a near-black lead ground holding three translucent jewel-tone panes — ruby, sapphire, and emerald glowing over the dark — each framed by thick near-black came and lit by a soft inset glow. Ivory type, gilt-gold labels, and a low diagonal shaft of light crossing the glass. Ornate, saturated, and reverent.",
    notes: [
      "The three cards are glass panes: each nth-child takes a different saturated jewel hue as a translucent fill over the dark ground, framed by 3px near-black lead came with a soft inset white glow.",
      "A full-page ::after paints a soft diagonal shaft of light (a low-alpha white wedge) sitting behind the content.",
      "Gold drives the kicker, gilded button, and logo roundel; body type is ivory serif with a faint gold bloom on the headline.",
      "Chips are little leaded panes (near-black border over a faint gold tint); bar charts are drawn as ivory outline bars like lead lines.",
    ],
    conform(g, r) {
      const gold = "#d4af37";
      g.p = pal({
        bg: "#161318", ink: "#f2e9d6", accent: gold, accent2: "#c9922e",
        surface: mix("#161318", "#ffffff", 0.05), surface2: mix("#161318", "#ffffff", 0.1),
        border: "#0b0a0c", muted: "#b9a98a", dark: true,
      });
      g.fonts = { display: pick(r, ["didone", "oldstyle"]), body: "oldstyle", mono: "typewriter" };
      g.radius = pick(r, [2, 4, 6]); g.ctl = pick(r, [2, 4]); g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = 0.01;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const lead = "#0b0a0c";
      const ruby = "#c0143c", sapph = "#1b57c9", emerald = "#0f8a52";
      return `
${s}::after {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(122deg, transparent 26%, ${alpha("#ffffff", 0.11)} 42%, ${alpha("#ffffff", 0.03)} 50%, transparent 62%);
}
${s} .display { color: var(--ink); font-size: 46px; text-shadow: 0 0 22px ${alpha(g.p.accent, 0.2)}; }
${s} .kicker { color: var(--accent); letter-spacing: .18em; }
${s} .card {
  border: 3px solid ${lead};
  box-shadow: inset 0 0 18px ${alpha("#ffffff", 0.08)};
}
${s} .card:nth-child(1) { background: ${alpha(ruby, 0.32)}; }
${s} .card:nth-child(2) { background: ${alpha(sapph, 0.34)}; }
${s} .card:nth-child(3) { background: ${alpha(emerald, 0.32)}; }
${s} .card-t, ${s} .card-p, ${s} .stat-num, ${s} .stat-label { color: var(--ink); }
${s} .chip {
  border: 2px solid ${lead}; background: ${alpha(g.p.accent, 0.16)};
  color: var(--ink); border-radius: 2px;
}
${s} .btn-a {
  background: var(--accent); color: var(--on-accent); border: 2px solid ${lead};
  box-shadow: inset 0 0 10px ${alpha("#ffffff", 0.3)};
}
${s} .btn-b { border: 2px solid ${lead}; color: var(--ink); }
${s} .stat-delta { color: var(--accent); }
${s} .topbar { border-bottom-color: ${lead}; }
${s} .foot { border-top-color: ${lead}; }
${s} .logo {
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f6e27a, ${g.p.accent});
  box-shadow: 0 0 0 2px ${lead};
}
`;
    },
  },

  // ----------------------------------------------------------------- terrazzo
  {
    id: "terrazzo",
    name: "Terrazzo",
    family: "craft",
    traits: ["light", "pattern", "modern"],
    blurb:
      "A polished Italian terrazzo floor as an interface: a warm-white stone ground scattered with tiny hard-edged chips of two accent tones and a warm gray, clean white cards floating above on hairline borders, and confident geometric type. A small brass dot marks the brand. Light, modern, and quietly luxurious — the pattern lives in the floor, not the furniture.",
    notes: [
      "The page background is a scatter of eight small hard-stop radial-gradient chips (two accent hues plus a warm gray, 3–7px, at varied positions) over the stone-white ground.",
      "Cards are clean opaque white on 1px neutral borders so text always sits on a calm surface, never on the speckle.",
      "The brand logo is a small brass dot (a warm metallic radial gradient); chips are outline pills.",
      "Geometric sans throughout with airy spacing; the data card uses a stacked-dots chart echoing the scattered floor.",
    ],
    conform(g, r) {
      const chipA = pick(r, ["#e0654f", "#d9524a", "#e08a3c"]);
      const chipB = pick(r, ["#2f9e8f", "#2f7f9e", "#3a8f5c"]);
      g.p = pal({
        bg: "#f5f2ea", ink: "#2b2723", accent: chipA, accent2: chipB,
        surface: "#ffffff", surface2: "#faf8f2", border: "#e3ddd0", muted: "#7d766a",
        dark: false,
      });
      g.fonts = { display: "geometric", body: "geometric", mono: "mono" };
      g.radius = pick(r, [10, 12, 14]); g.ctl = 999; g.bw = 1;
      g.shadow = among(r, g.shadow, ["lifted", "soft", "none"]); g.texture = "none";
      g.density = among(r, g.density, ["airy", "normal"]);
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = -0.01;
      g.chart = "dots";
    },
    css(s, g) {
      const a = alpha(g.p.accent, 0.85), b = alpha(g.p.accent2, 0.85), gray = "#b9b1a3";
      return `
${s} {
  background:
    radial-gradient(circle at 8% 20%, ${a} 0 4px, transparent 5px),
    radial-gradient(circle at 23% 64%, ${gray} 0 6px, transparent 7px),
    radial-gradient(circle at 38% 30%, ${b} 0 3px, transparent 4px),
    radial-gradient(circle at 53% 80%, ${a} 0 5px, transparent 6px),
    radial-gradient(circle at 67% 24%, ${gray} 0 4px, transparent 5px),
    radial-gradient(circle at 80% 60%, ${b} 0 6px, transparent 7px),
    radial-gradient(circle at 91% 38%, ${a} 0 3px, transparent 4px),
    radial-gradient(circle at 46% 14%, ${b} 0 4px, transparent 5px),
    var(--bg);
}
${s} .display { font-size: 44px; }
${s} .kicker { color: var(--accent); letter-spacing: .16em; }
${s} .card { background: var(--surface); border-color: var(--border); }
${s} .chip { background: transparent; border: 1px solid var(--border); color: var(--muted); }
${s} .btn-a { background: var(--accent); color: var(--on-accent); }
${s} .btn-b { border-color: var(--border); }
${s} .stat-delta { color: var(--accent2); }
${s} .logo {
  border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #f2d98c 0 30%, #c79b3a 70%, #a97f24);
}
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },

  // ----------------------------------------------------------------- holofoil
  {
    id: "holofoil",
    name: "Holo Foil",
    family: "craft",
    traits: ["glossy", "vivid", "playful"],
    blurb:
      "Holographic foil stamping on a near-white card: the headline is filled with a soft pastel-rainbow foil via background-clip, and every panel carries a faint diagonal iridescent sheen that shifts pink to blue to mint to butter. Silver hairline edges, sticker-style chips with a gray halo, and pill buttons stamped in the same prismatic foil. Glossy, prismatic, and playful — pastel rainbow, never chrome.",
    notes: [
      "The display heading is transparent text clipped over a multi-stop pastel-rainbow linear-gradient (background-clip: text) with a soft holographic bloom drop-shadow.",
      "Cards layer a low-alpha 120° pastel-rainbow sheen over the white surface, with grain texture for a fine foil sparkle and silver-gray borders.",
      "The primary button is stamped in the same foil gradient with dark text (onColor); the logo is a small foil disc.",
      "Chips are stickers: solid white with a soft gray halo box-shadow instead of a border; charts favor a smooth accent line.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f8f8fa", ink: "#26262e", accent: pick(r, ["#a24bff", "#ff4bd0", "#3aa0ff", "#22b8bf"]),
        accent2: "#9aa0aa", surface: "#ffffff", surface2: "#f3f3f6", border: "#d4d7dd", muted: "#6f727b",
        dark: false,
      });
      g.fonts = { display: pick(r, ["geometric", "grotesk"]), body: "grotesk", mono: "mono" };
      g.radius = pick(r, [12, 16]); g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 800; g.track = -0.02;
      g.chart = among(r, g.chart, ["line", "area"]);
    },
    css(s, g) {
      const foil = `linear-gradient(100deg, #f66fae, #6f96f6 26%, #2fbd8f 48%, #eaa62f 70%, #a76ff2)`;
      const sheen = `linear-gradient(120deg, ${alpha("#ff9ecb", 0.14)}, ${alpha("#9ec6ff", 0.14)} 26%, ${alpha("#9effc9", 0.12)} 50%, ${alpha("#ffe89e", 0.14)} 74%, ${alpha("#d69eff", 0.14)})`;
      const dark = onColor("#e9d6ff");
      return `
${s} .display {
  background: ${foil}; -webkit-background-clip: text; background-clip: text; color: transparent;
  font-size: 47px; filter: drop-shadow(0 1px 1px rgba(70,45,110,.3)) drop-shadow(0 2px 10px ${alpha("#a96cff", 0.25)});
}
${s} .kicker { color: var(--accent); letter-spacing: .14em; }
${s} .card {
  background: ${sheen}, var(--surface); border-color: var(--border);
}
${s} .btn-a {
  background: ${foil}; color: #ffffff; border: 1px solid var(--border);
  box-shadow: 0 4px 12px ${alpha("#a96cff", 0.22)};
}
${s} .btn-b { border-color: var(--border); }
${s} .chip {
  background: #ffffff; border: none; color: var(--ink);
  box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 1px 3px rgba(30,30,50,.14);
}
${s} .stat-num { background: ${foil}; -webkit-background-clip: text; background-clip: text; color: transparent; }
${s} .stat-delta { color: var(--accent); }
${s} .logo {
  border-radius: 50%; background: ${foil};
  box-shadow: 0 0 0 1px rgba(0,0,0,.06), inset 0 0 4px rgba(255,255,255,.7);
}
${s} .topbar { border-bottom-color: var(--border); }
${s} .foot { border-top-color: var(--border); }
`;
    },
  },
];
