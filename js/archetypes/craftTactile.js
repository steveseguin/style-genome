// Craft family: tactile, hand-made surfaces — cut paper, glued snapshots,
// cork pin-boards, and schoolroom slate. Physical materials imitated in CSS.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const craftTactile = [

  // -------------------------------------------------------------- papercut
  {
    id: "papercut",
    name: "Paper Cut",
    family: "craft",
    traits: ["soft", "layered", "playful"],
    blurb:
      "Layered paper-craft collage: everything looks scissored from stacks of sunny pastel construction paper. Each card rests on two hard-edged offset shadow layers in progressively deeper paper tones, so the panel reads as a little pile of cut sheets lifted off the page and finished with one soft drop. A double-layered paper sun peeks from behind the headline, the logo is a circle with an offset paper twin, and warm coral, peach, and sunny-gold tints keep the whole thing cheerful and childlike.",
    notes: [
      "Cards have no border; depth is faked with stacked hard box-shadows (0 6px 0, 0 12px 0) in deepening pastel paper tones plus a final soft drop — a cut-paper pile, not a soft clay bulge.",
      "The hero carries a ::after paper-sun: two overlapping hard-edged radial-gradient circles in accent tints sitting behind the headline.",
      "The logo is a circle with an offset solid box-shadow, reading as two stacked paper discs; chips are borderless pastel paper tags in alternating tints.",
      "Buttons carry a flat hard-offset drop (0 4px 0) like a raised paper cutout; corners are generously rounded and type is heavy and round.",
    ],
    conform(g, r) {
      const papers = pick(r, [
        { a: "#ff9d6c", b: "#ffd166" }, // coral + sunny gold
        { a: "#ffb0a3", b: "#ffcf5c" }, // peach + gold
        { a: "#ff8fab", b: "#ffc46b" }, // pink + amber
        { a: "#f8956b", b: "#8fd3a6" }, // coral + mint
      ]);
      g.p = pal({
        bg: pick(r, ["#fff4e6", "#fdf1ea", "#fff6ec"]),
        ink: "#4b3527", accent: papers.a, accent2: papers.b,
        surface: "#ffffff", border: "#f1e2d1", muted: "#8b7362", dark: false,
      });
      g.fonts = { display: pick(r, ["rounded", "geometric"]), body: pick(r, ["rounded", "humanist"]), mono: "mono" };
      g.radius = irange(r, 18, 24); g.ctl = pick(r, [999, 14]); g.bw = 0;
      g.shadow = "none"; g.texture = "none";
      g.density = "normal";
      g.case = "none"; g.hw = pick(r, [700, 800]); g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      const t1 = mix(g.p.accent2, "#ffffff", 0.5);
      const t2 = mix(g.p.accent, "#ffffff", 0.3);
      const t1b = mix(g.p.accent, "#ffffff", 0.5);
      const t2b = mix(g.p.accent2, "#ffffff", 0.3);
      const drop = alpha(g.p.ink, 0.14);
      const sun1 = mix(g.p.accent, "#ffffff", 0.25);
      const sun2 = mix(g.p.accent2, "#ffffff", 0.2);
      return `
${s} .card { border: none; box-shadow: 0 6px 0 ${t1}, 0 12px 0 ${t2}, 0 20px 20px ${drop}; }
${s} .card:nth-child(2) { box-shadow: 0 6px 0 ${t1b}, 0 12px 0 ${t2b}, 0 20px 20px ${drop}; }
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 8px; top: -12px; width: 130px; height: 130px; z-index: -1;
  background:
    radial-gradient(circle at 60% 42%, ${sun1} 0 30%, transparent 30.5%),
    radial-gradient(circle at 38% 60%, ${sun2} 0 26%, transparent 26.5%);
}
${s} .smain { z-index: 2; }
${s} .display { font-size: 45px; }
${s} .kicker { color: var(--accent); letter-spacing: .12em; }
${s} .btn-a { box-shadow: 0 4px 0 ${mix(g.p.accent, g.p.ink, 0.35)}; }
${s} .btn-b { background: #fff; border: none; color: var(--ink); box-shadow: 0 3px 0 ${g.p.border}; }
${s} .chip { border: none; color: var(--ink); font-weight: 700; background: ${mix(g.p.accent2, "#ffffff", 0.62)}; }
${s} .chip:nth-child(2) { background: ${mix(g.p.accent, "#ffffff", 0.62)}; }
${s} .chip:nth-child(3) { background: ${mix(g.p.accent2, "#ffffff", 0.4)}; }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent); }
${s} .logo { border-radius: 50%; box-shadow: 3px 3px 0 ${g.p.accent2}; }
${s} .topbar { border-bottom: none; }
${s} .foot { border-top: none; }
`;
    },
  },

  // -------------------------------------------------------------- scrapbook
  {
    id: "scrapbook",
    name: "Scrapbook",
    family: "craft",
    traits: ["handmade", "playful", "texture"],
    blurb:
      "A handmade scrapbook spread on a cream album page: each card is a glued-in snapshot with a thick white photo-matte frame and a soft drop shadow, pasted down at a cheerful tilt that alternates from card to card. A strip of translucent washi tape — faintly striped and tinted a sweet color — holds the top edge of every snapshot. Headlines are set in a casual handwritten face over typewriter body copy, chips are little white peel-and-stick labels, and warm coral, teal, and blush tints keep the mood sweet rather than harsh.",
    notes: [
      "Each card is a warm-white snapshot with a 6px solid-white box-shadow matte plus a soft drop shadow and a small nth-child rotation, like a photo glued to the page.",
      "A .card::before washi-tape strip — a short, tilted, translucent striped rectangle tinted from the accent — is centred over each card's top edge (a fill).",
      "The album page carries a paper grain texture; the display face is handwritten script over typewriter body and mono.",
      "Chips are little white sticker labels with a white halo, drop shadow, and tiny rotation; the chart is drawn as dots or a line.",
    ],
    conform(g, r) {
      const sweet = pick(r, [
        { a: "#e8846b", b: "#5fb3ac" }, // coral + teal
        { a: "#e57ba0", b: "#7bb0e5" }, // blush + sky
        { a: "#e8a44c", b: "#8bbf6a" }, // amber + leaf
      ]);
      g.p = pal({
        bg: "#f4ecdb", ink: "#463d34", accent: sweet.a, accent2: sweet.b,
        surface: "#fffdf7", border: "#d9ceb9", muted: "#8b7e6c", dark: false,
      });
      g.fonts = { display: "script", body: "typewriter", mono: "typewriter" };
      g.radius = pick(r, [0, 3, 4]); g.ctl = 3; g.bw = 0;
      g.shadow = "none"; g.texture = "paper";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = among(r, g.chart, ["dots", "line"]);
    },
    css(s, g) {
      const frame = `0 0 0 6px #fff, 0 8px 16px ${alpha(g.p.ink, 0.22)}`;
      const tape = (c) => `repeating-linear-gradient(90deg, ${alpha(c, 0.5)} 0 6px, ${alpha(c, 0.32)} 6px 12px)`;
      return `
${s} .card { border: none; background: #fffdf7; box-shadow: ${frame}; }
${s} .card:nth-child(1) { transform: rotate(-1.6deg); }
${s} .card:nth-child(2) { transform: rotate(1.2deg); }
${s} .card:nth-child(3) { transform: rotate(-0.6deg); }
${s} .card::before {
  content: ""; position: absolute; top: -11px; left: 50%; width: 76px; height: 22px;
  transform: translateX(-50%) rotate(-4deg); background: ${tape(g.p.accent)}; z-index: 3;
}
${s} .card:nth-child(2)::before { transform: translateX(-50%) rotate(5deg); background: ${tape(g.p.accent2)}; }
${s} .card:nth-child(3)::before { transform: translateX(-50%) rotate(-2deg); background: ${tape(g.p.accent)}; }
${s} .display { font-size: 46px; }
${s} .kicker { color: var(--accent); letter-spacing: .08em; }
${s} .chip {
  background: #fff; border: none; color: var(--ink); font-weight: 700;
  box-shadow: 0 0 0 3px #fff, 0 2px 5px ${alpha(g.p.ink, 0.2)}; transform: rotate(-2deg);
}
${s} .chip:nth-child(2) { transform: rotate(1.6deg); }
${s} .chip:nth-child(3) { transform: rotate(-1deg); }
${s} .btn-a { box-shadow: 0 3px 8px ${alpha(g.p.accent, 0.4)}; }
${s} .btn-b { background: #fff; border: none; color: var(--ink); box-shadow: 0 2px 6px ${alpha(g.p.ink, 0.18)}; }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent2); }
${s} .logo { border-radius: 50%; box-shadow: 0 0 0 3px #fff, 0 2px 4px ${alpha(g.p.ink, 0.25)}; transform: rotate(-6deg); }
${s} .topbar { border-bottom: none; }
${s} .foot { border-top: none; }
`;
    },
  },

  // -------------------------------------------------------------- corkboard
  {
    id: "corkboard",
    name: "Corkboard",
    family: "craft",
    traits: ["warm", "texture", "handmade"],
    blurb:
      "A warm cork pin-board: a tan cork ground flecked with darker speckles and fine grain, holding a scatter of index cards in white, pale yellow, and pale blue. Each card is tacked up at a slight angle and skewered by a glossy round pushpin — red, blue, or yellow — casting a tiny shadow onto the card below. The kicker is a small paper label tag, the voice is handwritten or typewritten, and outline bar charts sit on the cards like quick pencil tallies. Cozy, tactile, and organized-by-hand.",
    notes: [
      "The page background layers 2–3 radial-gradient speckle dots over the tan cork color plus a grain texture overlay, for a fibrous cork surface.",
      "Cards are white / pale-yellow / pale-blue by nth-child, each slightly rotated, lifted with a soft drop shadow — like tacked-up index cards.",
      "A .card::after pushpin — a small radial-gradient sphere with a white hotspot and a drop shadow — sits centred at each card's top edge, colored red/blue/yellow per nth-child (a fill).",
      "The kicker is a small white paper label tag; charts are outline bars and the accent is a warm marker tone.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#c49a63", ink: "#3a2a17", accent: pick(r, ["#c0563a", "#b8492b", "#c77a2e"]),
        accent2: "#4a7a9e", surface: "#fffdf5", border: "#a67f4c", muted: "#5c4526", dark: false,
      });
      g.fonts = { display: pick(r, ["script", "typewriter"]), body: pick(r, ["typewriter", "humanist"]), mono: "typewriter" };
      g.radius = irange(r, 2, 5); g.ctl = 4; g.bw = 0;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const spk = mix(g.p.bg, g.p.ink, 0.4);
      const hi = mix(g.p.bg, "#ffffff", 0.28);
      return `
${s} {
  background-color: ${g.p.bg};
  background-image:
    radial-gradient(${alpha(spk, 0.5)} 1px, transparent 1.5px),
    radial-gradient(${alpha(spk, 0.4)} 1px, transparent 1.5px),
    radial-gradient(${alpha(hi, 0.5)} 1px, transparent 1.5px);
  background-size: 13px 13px, 19px 21px, 27px 24px;
  background-position: 0 0, 7px 11px, 15px 5px;
}
${s} .card { border: none; box-shadow: 0 6px 14px rgba(0,0,0,.28); }
${s} .card:nth-child(1) { background: #fffdf5; transform: rotate(-1.5deg); }
${s} .card:nth-child(2) { background: #fff6c4; transform: rotate(1.4deg); }
${s} .card:nth-child(3) { background: #dbe9fb; transform: rotate(-0.8deg); }
${s} .card::after {
  content: ""; position: absolute; top: -7px; left: 50%; transform: translateX(-50%);
  width: 15px; height: 15px; border-radius: 50%; z-index: 4; box-shadow: 0 2px 3px rgba(0,0,0,.45);
  background: radial-gradient(circle at 35% 30%, #fff 0 12%, #e0524a 55%, #7c241f 100%);
}
${s} .card:nth-child(2)::after { background: radial-gradient(circle at 35% 30%, #fff 0 12%, #3f7fd6 55%, #1c3f78 100%); }
${s} .card:nth-child(3)::after { background: radial-gradient(circle at 35% 30%, #fff 0 12%, #edc23a 55%, #8a6a12 100%); }
${s} .kicker {
  background: #fffdf5; color: var(--ink); padding: 3px 10px; align-self: flex-start;
  letter-spacing: .1em; box-shadow: 0 1px 3px rgba(0,0,0,.28);
}
${s} .display { font-size: 44px; }
${s} .btn { box-shadow: 0 3px 6px rgba(0,0,0,.28); }
${s} .btn-b { background: #fffdf5; border: none; color: var(--ink); }
${s} .chip { background: #fffdf5; border: none; color: var(--ink); }
${s} .stat-num { color: var(--accent); }
${s} .stat-delta { color: var(--accent); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff 0 18%, ${g.p.accent} 70%); }
${s} .topbar { border-bottom: none; }
${s} .foot { border-top: none; }
`;
    },
  },

  // ------------------------------------------------------------- chalkboard
  {
    id: "chalkboard",
    name: "Chalkboard",
    family: "craft",
    traits: ["dark", "handmade", "scholarly"],
    blurb:
      "A schoolroom chalkboard: deep green-black slate dusted with grain, everything drawn in soft near-white chalk that carries a faint glow. Panels and buttons are ruled with 2px dashed chalk-white outlines, the handwritten headline is underscored with a dashed chalk line, and pastel chalk yellow and pink appear only where a teacher would color-code — highlighted labels, figures, and chart marks. One button is a solid chalk-white block with slate lettering, the bar chart is drawn as hollow chalk sticks, and a faint eraser smudge is wiped across the bottom-right corner. The dark, scholarly inverse of a pencil sketchbook.",
    notes: [
      "Every text element gets a subtle chalk glow (a white text-shadow); the slate is a deep green-black with a grain overlay.",
      "Borders everywhere are 2px dashed in alpha-white (cards, chips, buttons, top/footer rules); the script headline gets a dashed white underline.",
      "Accents are pastel chalk yellow and pink used only on text — kicker, stat figures, and deltas; btn-a is a solid chalk-white block with slate text.",
      "A ::after eraser smudge (a soft lighter radial gradient) sits at the bottom-right; the chart is outline bars like chalk sticks.",
    ],
    conform(g, r) {
      const bg = pick(r, ["#1b2620", "#1e2a23", "#1a231e"]);
      g.p = pal({
        bg, ink: "#eef1e8", accent: "#f0e07f", accent2: "#f2a9c4",
        surface: mix(bg, "#ffffff", 0.05), surface2: mix(bg, "#ffffff", 0.1),
        border: mix(bg, "#ffffff", 0.3), muted: "#a3b3a7", dark: true,
      });
      g.fonts = { display: "script", body: pick(r, ["humanist", "typewriter"]), mono: "typewriter" };
      g.radius = pick(r, [0, 2]); g.ctl = pick(r, [0, 2]); g.bw = 2;
      g.shadow = "none"; g.texture = "grain";
      g.density = "normal";
      g.case = "none"; g.hw = 700; g.track = 0;
      g.chart = "bars-outline";
    },
    css(s, g) {
      const chalk = alpha("#ffffff", 0.5);
      const chalkSoft = alpha("#ffffff", 0.4);
      const glow = alpha("#ffffff", 0.35);
      return `
${s} { text-shadow: 0 0 2px ${glow}; }
${s}::after {
  content: ""; position: absolute; right: -40px; bottom: -30px; width: 320px; height: 200px; z-index: 1;
  background: radial-gradient(ellipse at center, ${alpha("#ffffff", 0.09)} 0%, transparent 70%); pointer-events: none;
}
${s} .topbar, ${s} .smain, ${s} .foot { z-index: 2; }
${s} .card { background: ${alpha("#ffffff", 0.035)}; border: 2px dashed ${chalk}; box-shadow: none; }
${s} .display {
  border-bottom: 2px dashed ${chalk}; padding-bottom: 8px; align-self: flex-start;
  font-size: 44px; text-shadow: 0 0 5px ${alpha("#ffffff", 0.4)};
}
${s} .kicker { color: var(--accent); letter-spacing: .14em; }
${s} .chip { background: transparent; border: 1.5px dashed ${chalkSoft}; color: var(--ink); border-radius: 2px; }
${s} .btn { box-shadow: none; }
${s} .btn-b { background: transparent; border: 2px solid ${alpha("#ffffff", 0.6)}; color: var(--ink); }
${s} .btn-a { background: #f3f1e7; color: ${g.p.bg}; border: 2px solid #f3f1e7; text-shadow: none; }
${s} .stat-num { color: var(--accent2); }
${s} .stat-delta { color: var(--accent); }
${s} .card-p { color: var(--muted); }
${s} .logo { background: #f3f1e7; border-radius: 1px; box-shadow: 0 0 5px ${alpha("#ffffff", 0.4)}; }
${s} .topbar { border-bottom: 2px dashed ${chalkSoft}; }
${s} .foot { border-top: 2px dashed ${chalkSoft}; }
`;
    },
  },
];
