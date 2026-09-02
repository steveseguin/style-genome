// Printmaking processes that need materially different marks, substrates, and
// data treatments. These are processes rather than generic "vintage" skins:
// relief, intaglio, planographic, screen, and multi-block printing each keep
// their own physical logic.

import { pick } from "../rng.js";
import { alpha, mix } from "../color.js";
import { pal } from "../palettes.js";
import { among } from "./util.js";

export const printProcesses = [
  {
    id: "engravedplate",
    name: "Copperplate Engraving",
    family: "print",
    traits: ["print", "historic", "intricate", "intaglio"],
    blurb:
      "A copperplate engraving on warm rag paper: hair-fine burin lines, disciplined cross-hatching, swelling-and-tapering strokes, and dense line fields building tone without flat gray. Formal serif typography and guilloché-like ornaments make the page feel cut into a plate, inked, wiped, and pressed.",
    notes: [
      "Tone is made from fine engraved lines and true two-direction cross-hatching, never a generic gray overlay.",
      "Rules are hairline or double-line neutral ink; headings and numerals carry a very fine offset engraved echo.",
      "Panels stay close to the paper color and use nested neutral frames rather than colored card fills.",
      "Charts use engraved contour/cross-hatched marks with no decorative gridlines.",
    ],
    conform(g, r) {
      const ink = pick(r, ["#262421", "#26354a", "#4a2b25"]);
      g.p = pal({
        bg: "#f2ead8", surface: "#f7f0e2", surface2: "#ece1cb", ink,
        muted: mix(ink, "#f2ead8", 0.42), accent: ink,
        accent2: mix(ink, "#f2ead8", 0.22), border: mix(ink, "#f2ead8", 0.28), dark: false,
      });
      g.fonts = { display: "didone", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "engraved"; g.density = "normal";
      g.case = "none"; g.hw = 500; g.track = 0.02;
      g.chart = among(r, g.chart, ["bars", "line", "area"]);
      g.chartTreatment = "engraved"; g.chartGrid = "none";
    },
    css(s) {
      return `
${s} .topbar, ${s} .foot { border-color: var(--ink); border-width: 3px; border-style: double; }
${s} .display { font-size: 47px; text-shadow: .6px .6px 0 var(--muted); }
${s} .kicker { color: var(--ink); letter-spacing: .22em; }
${s} .card { background: ${alpha("#f7f0e2", 0.82)}; border: 3px double var(--border); box-shadow: inset 0 0 0 3px var(--surface); }
${s} .card-t::after { content: "  ◇  ◇  ◇"; color: var(--muted); font-size: 8px; letter-spacing: .18em; }
${s} .stat-num { color: var(--ink); text-shadow: .5px .5px 0 var(--muted); }
${s} .btn { background: transparent; color: var(--ink); border: 3px double var(--ink); }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .chip { border-radius: 0; border: 1px solid var(--ink); background: transparent; }
${s} .logo { border-radius: 50%; background: repeating-radial-gradient(circle, var(--ink) 0 1px, transparent 1px 3px); border: 1px solid var(--ink); }
`;
    },
  },

  {
    id: "etchingaquatint",
    name: "Etching & Aquatint",
    family: "print",
    traits: ["print", "historic", "raw", "intaglio"],
    blurb:
      "An artist's etched plate with aquatint tone: loose acid-bitten lines, drypoint scratches, sepia plate ink, and granular tonal pools settling into toothy paper. Edges are slightly irregular and expressive; the image grows from line, burr, and resin dust rather than polished geometry.",
    notes: [
      "Use irregular etched strokes and stippled aquatint fields; do not replace them with smooth gradients.",
      "Borders look hand-bitten and slightly uneven, while the paper remains warm and absorbent.",
      "Typography is literary and restrained so the scratched marks remain the signature.",
      "Charts use stipple density or etched lines, with axes reduced to the minimum.",
    ],
    conform(g, r) {
      const sepia = pick(r, ["#4d392a", "#3e342d", "#51372b"]);
      g.p = pal({
        bg: "#eee3ce", surface: "#f4ead8", surface2: "#e5d5bb", ink: sepia,
        muted: mix(sepia, "#eee3ce", 0.42), accent: "#79523b",
        accent2: "#9b785c", border: "#9c876e", dark: false,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = pick(r, [0, 2, 4]); g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = "stipple"; g.density = "normal";
      g.case = "none"; g.hw = pick(r, [400, 500]); g.track = 0;
      g.chart = among(r, g.chart, ["line", "area", "bars"]);
      g.chartTreatment = "stipple"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background: radial-gradient(ellipse at 83% 18%, ${alpha(g.p.ink, 0.11)} 0 7%, transparent 8% 14%, ${alpha(g.p.ink, 0.045)} 15% 22%, transparent 24%), var(--bg); }
${s} .display { font-style: italic; font-size: 46px; }
${s} .hero::after { content: ""; position: absolute; right: 4%; top: 12%; width: 130px; height: 75px; opacity: .34; background: repeating-radial-gradient(ellipse at 50% 50%, transparent 0 5px, var(--ink) 6px 6.7px, transparent 7px 10px); transform: rotate(-8deg); }
${s} .card { background: ${alpha(g.p.surface, 0.73)}; border: 1px solid var(--border); border-radius: 44% 56% 48% 52% / 3% 4% 3% 5%; }
${s} .card:nth-child(2) { border-radius: 52% 48% 55% 45% / 4% 3% 5% 3%; }
${s} .kicker, ${s} .stat-delta { color: var(--ink); font-style: italic; }
${s} .btn { border-color: var(--ink); background: transparent; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .chip { border: none; border-bottom: 1px dotted var(--ink); border-radius: 0; padding-inline: 2px; }
${s} .logo { border-radius: 48% 52% 45% 55%; background: var(--ink); }
`;
    },
  },

  {
    id: "mezzotint",
    name: "Mezzotint",
    family: "print",
    traits: ["print", "dark", "elegant", "intaglio"],
    blurb:
      "A velvet-black mezzotint pulled from a rocked copper plate: the ground begins almost fully dark and imagery emerges through burnished pools of smoky light. Cream type, soft granular transitions, and restrained copper details create a nocturnal print with depth but no digital glow.",
    notes: [
      "Build tone from dense stipple fading from black toward light; avoid glossy gradients and neon glows.",
      "Panels are barely lighter plate fields with soft granular edges, not floating glass cards.",
      "Copper is a small secondary ink used for labels and the key data mark.",
      "Area and dot charts use stippled light marks on the dark plate with no gridlines.",
    ],
    conform(g, r) {
      const copper = pick(r, ["#b8784f", "#aa6d47", "#c18a5f"]);
      g.p = pal({
        bg: "#171514", surface: "#211e1c", surface2: "#2a2522", ink: "#efe5d2",
        muted: "#b9aa95", accent: copper, accent2: "#d4c2a5", border: "#4f4640", dark: true,
      });
      g.fonts = { display: "didone", body: "oldstyle", mono: "typewriter" };
      g.radius = 2; g.ctl = 2; g.bw = 1;
      g.shadow = "none"; g.texture = "stipple"; g.density = "airy";
      g.case = "none"; g.hw = 400; g.track = 0.01;
      g.chart = among(r, g.chart, ["area", "dots", "line"]);
      g.chartTreatment = "stipple"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} { background: radial-gradient(ellipse at 70% 45%, ${alpha(g.p.ink, 0.13)}, transparent 36%), radial-gradient(ellipse at 12% 80%, ${alpha(g.p.accent, 0.08)}, transparent 28%), var(--bg); }
${s} .display { font-size: 50px; font-style: italic; font-weight: 400; }
${s} .kicker, ${s} .stat-delta { color: var(--accent-text); }
${s} .card { background: ${alpha(g.p.surface, 0.76)}; border-color: var(--border); box-shadow: inset 0 0 24px rgba(0,0,0,.38); }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .btn-b { border-color: var(--muted); }
${s} .chip { border-color: var(--border); color: var(--muted); }
${s} .logo { border-radius: 50%; background: radial-gradient(circle at 40% 35%, var(--ink), var(--accent) 32%, #31221b 72%); }
`;
    },
  },

  {
    id: "woodcut",
    name: "Woodcut",
    family: "print",
    traits: ["print", "raw", "bold", "relief"],
    blurb:
      "A black-line woodcut: coarse carved contours, visible gouge channels, blunt corners, and areas of warm paper left as light. Heavy relief ink sits unevenly on the surface; one earthy color block may join the black key block, but every form still feels cut with a knife.",
    notes: [
      "Use coarse, irregular gouge marks and blunt relief edges—not smooth vectors or photographic grain alone.",
      "The headline and key figures feel carved from dense black shapes with small paper-colored cuts.",
      "Panels use heavy ink frames and open paper interiors; shadows are forbidden.",
      "Charts use rough relief marks in black/earth ink and a baseline only.",
    ],
    conform(g, r) {
      const earth = pick(r, ["#9f3d25", "#315d4b", "#9b6a21"]);
      g.p = pal({
        bg: "#efe2c8", surface: "#f5ead4", surface2: "#e4d2b4", ink: "#171613",
        muted: "#514b40", accent: earth, accent2: "#171613", border: "#171613", dark: false,
      });
      g.fonts = { display: "black", body: "slab", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 3;
      g.shadow = "none"; g.texture = "fibers"; g.density = "dense";
      g.case = "upper"; g.hw = 900; g.track = -0.02;
      g.chart = among(r, g.chart, ["bars", "area"]);
      g.chartTreatment = "rough"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .hero::after { content: ""; position: absolute; right: 1%; top: 4%; width: 155px; height: 105px; background: repeating-linear-gradient(101deg, transparent 0 7px, var(--ink) 8px 12px, transparent 13px 18px); clip-path: polygon(48% 0,58% 36%,100% 18%,69% 52%,95% 88%,57% 67%,43% 100%,38% 63%,0 79%,29% 49%,7% 17%,39% 36%); opacity: .92; }
${s} .display { font-size: 47px; line-height: .98; text-shadow: 2px 0 0 var(--ink); }
${s} .card { background: var(--surface); border: 3px solid var(--ink); box-shadow: none; }
${s} .card:nth-child(2) { transform: rotate(.35deg); }
${s} .kicker, ${s} .stat-delta { color: var(--accent-text); }
${s} .btn { border: 3px solid var(--ink); box-shadow: none; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .chip { border: 2px solid var(--ink); border-radius: 0; background: transparent; font-weight: 800; }
${s} .logo { border-radius: 0; background: var(--accent); clip-path: polygon(50% 0,100% 42%,75% 100%,20% 87%,0 30%); }
`;
    },
  },

  {
    id: "linocut",
    name: "Linocut Poster",
    family: "print",
    traits: ["print", "bold", "graphic", "relief"],
    blurb:
      "A modern linocut poster: broad scooped cuts, chunky flat silhouettes, rounded gouge ends, and two opaque inks on off-white stock. Compared with woodcut it is smoother and more graphic, but deliberately retains carved voids and imperfect block edges.",
    notes: [
      "Use broad curved gouge channels and large flat ink masses; avoid hairline engraving and digital gradients.",
      "Exactly two opaque inks plus paper, with overlap used sparingly as a third tone.",
      "Controls and panels are chunky block shapes with visibly carved notches.",
      "Charts use rough solid relief marks with strong silhouettes and no internal grid.",
    ],
    conform(g, r) {
      const combo = pick(r, [
        ["#174f72", "#d74b2c"], ["#1f5b42", "#d58b27"], ["#562c63", "#df5b55"],
      ]);
      g.p = pal({
        bg: "#f3ead7", surface: "#f3ead7", surface2: mix(combo[0], "#f3ead7", 0.86),
        ink: combo[0], muted: mix(combo[0], "#f3ead7", 0.32), accent: combo[1],
        accent2: combo[0], border: combo[0], dark: false,
      });
      g.fonts = { display: "black", body: "humanist", mono: "typewriter" };
      g.radius = pick(r, [2, 4, 6]); g.ctl = 4; g.bw = 2;
      g.shadow = "none"; g.texture = "fibers"; g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 900; g.track = -0.015;
      g.chart = among(r, g.chart, ["bars", "dots"]);
      g.chartTreatment = "rough"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} .display { font-size: 49px; text-shadow: 3px 2px 0 ${alpha(g.p.accent, 0.38)}; }
${s} .card { background: var(--surface); border: 2px solid var(--ink); clip-path: polygon(0 4%,4% 0,96% 1%,100% 6%,99% 95%,95% 100%,5% 98%,0 94%); }
${s} .card:nth-child(2) { background: ${mix(g.p.accent, g.p.bg, 0.78)}; }
${s} .btn { border: 2px solid var(--ink); }
${s} .btn-a { background: var(--accent); color: var(--on-accent); }
${s} .chip { border-radius: 55% 45% 52% 48%; border: 2px solid var(--ink); color: var(--ink); }
${s} .kicker, ${s} .stat-delta { color: var(--accent-text); }
${s} .logo { border-radius: 44% 56% 38% 62%; background: var(--accent); box-shadow: 3px 1px 0 var(--ink); }
`;
    },
  },

  {
    id: "stonelitho",
    name: "Stone Lithograph",
    family: "print",
    traits: ["print", "literary", "texture", "planographic"],
    blurb:
      "A stone lithograph with greasy crayon grain: velvety drawn strokes, soft broken tusche washes, muted poster inks, and creamy stock. The surface feels hand-drawn directly on limestone—more tonal and gestural than relief printing, never mechanically perfect.",
    notes: [
      "Use broken crayon texture and soft lithographic grain in marks; avoid crisp digital vector edges.",
      "Muted ink colors sit on creamy stock with occasional tusche-like tonal blooms.",
      "Typography mixes a robust serif with hand-lettered details, keeping the page poster-like and tactile.",
      "Charts use stipple/crayon density and a quiet baseline.",
    ],
    conform(g, r) {
      const ink = pick(r, ["#3f4057", "#4e392f", "#32493f"]);
      const accent = pick(r, ["#b85b4b", "#b28a35", "#527c8e"]);
      g.p = pal({
        bg: "#eee4cf", surface: "#f5ecda", surface2: "#e5d7bd", ink,
        muted: mix(ink, "#eee4cf", 0.38), accent, accent2: mix(accent, ink, 0.28),
        border: mix(ink, "#eee4cf", 0.3), dark: false,
      });
      g.fonts = { display: pick(r, ["slab", "oldstyle"]), body: "oldstyle", mono: "typewriter" };
      g.radius = pick(r, [2, 4, 8]); g.ctl = 4; g.bw = 1;
      g.shadow = "none"; g.texture = "grain"; g.density = "normal";
      g.case = "none"; g.hw = pick(r, [600, 700]); g.track = 0;
      g.chart = among(r, g.chart, ["area", "bars", "dots"]);
      g.chartTreatment = "stipple"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} { background: radial-gradient(ellipse at 79% 12%, ${alpha(g.p.accent, 0.13)}, transparent 28%), radial-gradient(ellipse at 15% 82%, ${alpha(g.p.ink, 0.07)}, transparent 35%), var(--bg); }
${s} .hero { position: relative; }
${s} .hero::after {
  content: ""; position: absolute; right: 2%; top: 2%; width: 170px; height: 108px;
  background:
    radial-gradient(circle, ${alpha(g.p.ink, 0.62)} 0 .8px, transparent 1.2px) 0 0 / 5px 5px,
    radial-gradient(circle, ${alpha(g.p.accent, 0.42)} 0 1px, transparent 1.5px) 2px 3px / 7px 7px;
  clip-path: polygon(2% 37%, 13% 18%, 34% 23%, 49% 7%, 71% 17%, 97% 2%, 88% 34%, 100% 57%, 75% 60%, 61% 87%, 37% 75%, 9% 96%, 19% 65%, 0 54%);
  transform: rotate(-7deg); opacity: .62; mix-blend-mode: multiply;
}
${s} .display { font-size: 48px; transform: rotate(-.25deg); text-shadow: 1px 1px 0 ${alpha(g.p.ink, 0.18)}; }
${s} .kicker { align-self: flex-start; padding-bottom: 5px; background: repeating-linear-gradient(92deg, ${alpha(g.p.accent, 0.72)} 0 3px, transparent 3px 6px) left bottom / 100% 3px no-repeat; }
${s} .card { background: ${alpha(g.p.surface, 0.7)}; border-color: var(--border); }
${s} .card:nth-child(1) { transform: rotate(-.25deg); }
${s} .card:nth-child(3) { transform: rotate(.2deg); }
${s} .btn-a { background: var(--accent); color: var(--on-accent); }
${s} .btn-b { border-color: var(--ink); }
${s} .chip { border: none; border-bottom: 1px solid var(--ink); border-radius: 0; font-style: italic; }
${s} .logo { border-radius: 50%; background: radial-gradient(circle, var(--accent) 0 42%, transparent 45%), var(--ink); }
`;
    },
  },

  {
    id: "screenprint",
    name: "Screenprint",
    family: "print",
    traits: ["print", "bold", "vivid", "screen"],
    blurb:
      "A two-color screenprint: opaque saturated spot inks pushed through mesh, flat hard-edged shapes, slight ink gain, and deliberate overprint where the layers overlap. Registration is close but human; there are no gradients, shadows, or fake paper depth.",
    notes: [
      "Use two opaque spot inks plus paper; translucent overlap creates a credible third color.",
      "Edges show slight screen/ink gain and occasional registration offset, never glossy gradients.",
      "Typography is bold enough to hold a solid screen and may participate in the overprint.",
      "Charts use translucent misregistered overprint marks with neutral outlines.",
    ],
    conform(g, r) {
      const combo = pick(r, [
        ["#ee3f62", "#195fba"], ["#f15a24", "#167c63"], ["#e3398f", "#2553a5"],
      ]);
      g.p = pal({
        bg: "#f4eedf", surface: "#f4eedf", surface2: mix(combo[0], "#f4eedf", 0.83),
        ink: "#20201d", muted: "#59564e", accent: combo[0], accent2: combo[1],
        border: "#20201d", dark: false,
      });
      g.fonts = { display: "black", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "fibers"; g.density = "normal";
      g.case = among(r, g.case, ["none", "upper"]); g.hw = 900; g.track = -0.015;
      g.chart = among(r, g.chart, ["bars", "dots"]);
      g.chartTreatment = "overprint"; g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .display { font-size: 49px; text-shadow: 3px 2px 0 ${alpha(g.p.accent2, 0.72)}; }
${s} .hero::after { content: ""; position: absolute; right: 4%; top: 8%; width: 125px; height: 125px; background: var(--accent); border-radius: 50%; box-shadow: 35px 18px 0 ${alpha(g.p.accent2, 0.78)}; mix-blend-mode: multiply; }
${s} .card { background: transparent; border: 2px solid var(--ink); box-shadow: 3px 3px 0 ${alpha(g.p.accent2, 0.65)}; }
${s} .card:nth-child(2) { background: ${alpha(g.p.accent, 0.16)}; }
${s} .btn-a { background: var(--accent); color: var(--on-accent); border-color: var(--ink); box-shadow: 3px 2px 0 var(--accent2); }
${s} .btn-b, ${s} .chip { border: 2px solid var(--ink); border-radius: 0; }
${s} .kicker { color: var(--accent2-text); }
${s} .stat-delta { color: var(--accent-text); }
${s} .logo { border-radius: 50%; background: var(--accent); box-shadow: 3px 2px 0 var(--accent2); }
`;
    },
  },

  {
    id: "offsetcmyk",
    name: "Offset CMYK",
    family: "print",
    traits: ["print", "technical", "vivid", "offset"],
    blurb:
      "A commercial offset proof magnified enough to reveal its construction: cyan, magenta, yellow, and black halftone screens, tiny registration drift, crop-mark precision, and coated white stock. Color is mechanical and layered rather than painterly.",
    notes: [
      "Halftone dots and CMYK registration are the signature; do not substitute a smooth rainbow gradient.",
      "Use tiny crop/registration marks and restrained production labels in monospaced type.",
      "Headings may show a one-pixel cyan/magenta registration echo while body text remains sharp black.",
      "Charts use halftone or overprinted process-color marks with a neutral baseline.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#f7f7f3", surface: "#ffffff", surface2: "#eeeeea", ink: "#18191b",
        muted: "#5d6065", accent: "#e6007e", accent2: "#00a6d6", border: "#bfc3c6",
        cyan: "#00a6d6", magenta: "#e6007e", yellow: "#ffd400", key: "#18191b", dark: false,
      });
      g.fonts = { display: "grotesk", body: "grotesk", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "halftone"; g.density = "dense";
      g.case = "upper"; g.hw = 800; g.track = -0.01;
      g.chart = among(r, g.chart, ["bars", "area", "dots"]);
      g.chartTreatment = pick(r, ["halftone", "overprint"]); g.chartGrid = "baseline";
    },
    css(s, g) {
      return `
${s} .display { font-size: 47px; text-shadow: -1px 0 0 ${alpha(g.p.cyan, 0.75)}, 1px 0 0 ${alpha(g.p.magenta, 0.75)}; }
${s} .kicker::before { content: "C 78  M 92  Y 00  K 04  /  "; font-family: var(--f-mono); color: var(--muted); }
${s} .card { background: rgba(255,255,255,.88); border-color: var(--border); }
${s} .card::after { content: "+"; position: absolute; right: 5px; top: 1px; color: var(--muted); font: 9px var(--f-mono); }
${s} .btn-a { background: var(--accent); color: var(--on-accent); box-shadow: 2px 1px 0 ${g.p.cyan}; }
${s} .btn-b, ${s} .chip { border-radius: 0; }
${s} .stat-num { text-shadow: -1px 0 ${g.p.cyan}, 1px 0 ${g.p.magenta}; }
${s} .logo { border-radius: 50%; background: conic-gradient(${g.p.cyan} 0 25%, ${g.p.magenta} 0 50%, ${g.p.yellow} 0 75%, ${g.p.key} 0); }
`;
    },
  },

  {
    id: "mokuhanga",
    name: "Mokuhanga Woodblock",
    family: "print",
    traits: ["print", "historic", "natural", "woodblock"],
    blurb:
      "Japanese mokuhanga woodblock printing on fibrous washi: an indigo key block, flat mineral color blocks, visible baren texture, generous asymmetry, and a vermilion seal. Color edges meet with slight human registration and the paper itself remains an active quiet field.",
    notes: [
      "Use a dark indigo key block plus two or three restrained flat color blocks on warm washi; avoid gradients and glossy effects.",
      "Composition is asymmetrical with open paper, cropped forms, and a small vermilion seal used as the signature accent.",
      "Edges show subtle multi-block registration and fibrous pressure texture rather than rough Western gouge marks.",
      "Charts use indigo line/block marks with sparse overprint and no internal grid.",
    ],
    conform(g, r) {
      const indigo = pick(r, ["#23456b", "#1f4661", "#2b3f62"]);
      g.p = pal({
        bg: "#f2ead6", surface: "#f6efdf", surface2: "#e4dcc8", ink: indigo,
        muted: mix(indigo, "#f2ead6", 0.43), accent: "#b83a2e", accent2: "#5b8d8a",
        border: mix(indigo, "#f2ead6", 0.28), seal: "#b83a2e", dark: false,
      });
      g.fonts = { display: "oldstyle", body: "oldstyle", mono: "typewriter" };
      g.radius = 0; g.ctl = 0; g.bw = 1;
      g.shadow = "none"; g.texture = "fibers"; g.density = "airy";
      g.case = "none"; g.hw = 500; g.track = 0.02;
      g.chart = among(r, g.chart, ["line", "bars", "area"]);
      g.chartTreatment = "overprint"; g.chartGrid = "none";
    },
    css(s, g) {
      return `
${s} { background: radial-gradient(ellipse at 91% 12%, ${alpha(g.p.accent2, 0.28)} 0 12%, transparent 12.5%), radial-gradient(ellipse at 77% 30%, ${alpha(g.p.accent, 0.16)} 0 16%, transparent 16.5%), var(--bg); }
${s} .smain { padding-left: calc(var(--sp) * 5.2); }
${s} .display { font-size: 48px; max-width: 12ch; font-weight: 500; }
${s} .kicker { color: var(--muted); letter-spacing: .18em; }
${s} .card { background: ${alpha(g.p.surface, 0.7)}; border: none; border-top: 1px solid var(--border); border-radius: 0; box-shadow: none; }
${s} .card:nth-child(2) { background: ${alpha(g.p.accent2, 0.12)}; }
${s} .btn-a { background: var(--ink); color: var(--bg); }
${s} .btn-b { border-color: var(--ink); }
${s} .chip { border: none; border-bottom: 1px solid var(--border); border-radius: 0; padding-inline: 2px; }
${s} .logo { border-radius: 0; background: var(--accent); transform: rotate(-3deg); box-shadow: inset 0 0 0 1px ${alpha("#ffffff", 0.18)}; }
${s} .stat-delta { color: var(--accent-text); }
`;
    },
  },
];
