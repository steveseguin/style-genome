// Web-retro family: the visual eras of the web itself — the gaudy personal
// homepage, glossy Web 2.0, Aqua's brushed metal, and the arcade cabinet.

import { pick, irange, chance } from "../rng.js";
import { hslToHex, mix, alpha } from "../color.js";
import { pal, basePalette } from "../palettes.js";
import { among } from "./util.js";

export const webRetro = [

  // ------------------------------------------------------------- geocities
  {
    id: "geocities",
    name: "Geocities Revival",
    family: "web",
    traits: ["retro", "raw", "vivid"],
    blurb:
      "A 1997 personal homepage, lovingly gaudy: a silver-gray #c0c0c0 page, underlined hyperlink-blue navigation, and a heavy display headline poured full of a hard rainbow gradient. Clashing lime, magenta and school-bus yellow fight for attention; cards sit inside raised gray table bevels; a black-boxed hit counter ticks in lime monospace. Under-construction energy, rendered with pride.",
    notes: [
      "The headline uses the ultra-heavy display face with a hard 6-stop rainbow gradient clipped to the text (background-clip: text).",
      "Nav links are classic hyperlink blue and underlined; the current link is visited-purple — no button styling at all.",
      "Cards, buttons and chips wear raised/sunken grayscale table bevels (light top-left, dark bottom-right); chips are yellow 'NEW!' badges with red bold-italic uppercase text.",
      "The stat is a hit counter: lime monospace digits in a black inset well; the footer runs small muted monospace.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#c0c0c0", ink: "#0a0a0a", accent: "#00c000", accent2: "#e000c0",
        surface: "#ffffff", surface2: "#e8e8e8", border: "#808080", muted: "#474747", dark: false,
      });
      g.fonts = { display: "black", body: pick(r, ["transitional", "oldstyle"]), mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "none"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "none"; g.hw = 800; g.track = 0;
      g.chart = among(r, g.chart, ["bars", "bars-outline"]);
    },
    css(s, g) {
      const raised = `border-width: 2px; border-style: solid; border-color: #ffffff #7a7a7a #7a7a7a #ffffff;`;
      const sunken = `border-width: 2px; border-style: solid; border-color: #7a7a7a #ffffff #ffffff #7a7a7a;`;
      return `
${s} .display {
  font-size: 46px;
  background: linear-gradient(90deg, #ff2d2d 0%, #ff8a00 20%, #ffe100 40%, #23c552 60%, #1f6dff 80%, #b026ff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
${s} .kicker { color: #cc00aa; letter-spacing: .05em; }
${s} .brand { color: #000080; }
${s} .topnav .nl { color: #0000ee; text-decoration: underline; }
${s} .topnav .nl.on { color: #551a8b; text-decoration: underline; font-weight: 700; }
${s} .card { background: #ffffff; ${raised} box-shadow: 1px 1px 0 #000000; }
${s} .chip {
  ${raised} border-radius: 0; background: #ffec00; color: #d40000;
  font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: .02em;
}
${s} .chip::before { content: "★ "; color: #d40000; }
${s} .stat-label { color: #0000ee; }
${s} .stat-num {
  display: inline-block; align-self: flex-start;
  ${sunken} background: #000000; color: #39ff14;
  font-family: var(--f-mono); font-size: 26px; letter-spacing: .12em; padding: 4px 10px;
}
${s} .stat-delta { color: #007a00; }
${s} .btn { ${raised} border-radius: 0; }
${s} .btn-a { background: var(--accent); color: #08240a; font-weight: 800; box-shadow: none; }
${s} .btn-b { background: #d9d9d9; color: #000000; }
${s} .logo {
  border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #8fd3ff 0 20%, #1560d8 55%, #0a2f8a 100%);
  box-shadow: 0 0 0 1px #05205f;
}
${s} .foot { font-family: var(--f-mono); font-size: 11px; }
`;
    },
  },

  // ------------------------------------------------------------------ web2
  {
    id: "web2",
    name: "Web 2.0 Gloss",
    family: "web",
    traits: ["glossy", "playful", "familiar"],
    blurb:
      "A 2007 startup landing page: pristine white, big soft radii, and candy-gradient buttons with a wet white gloss across their top half. One bright accent (blue or orange) does the shouting while a second color carries a 'BETA' badge; the kicker is a rounded pill tag, chips are glossy lozenges, and the little logo casts a wet-floor reflection. Optimistic, rounded, and instantly familiar.",
    notes: [
      "Buttons are pills with a vertical candy gradient (light-to-dark accent) plus a ::after gloss covering the top 50% and an inset white top highlight.",
      "Chips are glossy white lozenges; the last one is a solid accent2 'BETA' badge in white bold uppercase.",
      "The kicker is a soft tinted pill tag; cards are near-white with a faint top-down gradient and a soft lifted shadow.",
      "The logo drops a fading flipped reflection below it via ::after (a low-alpha accent gradient block).",
    ],
    conform(g, r) {
      const [acc, acc2] = pick(r, [
        ["#2f8fff", "#ff7a1a"], ["#ff7a1a", "#2f8fff"], ["#28b463", "#2f8fff"],
      ]);
      g.p = pal({
        bg: "#ffffff", ink: "#1d2733", accent: acc, accent2: acc2,
        surface: "#ffffff", surface2: "#f2f6fb", border: "#dce4ee", muted: "#5b6b7b", dark: false,
      });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = irange(r, 12, 16); g.ctl = 999; g.bw = 1;
      g.shadow = among(r, g.shadow, ["soft", "lifted"]); g.texture = "none";
      g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = 700; g.track = -0.02;
      g.chart = "area";
    },
    css(s, g) {
      const acc = g.p.accent, acc2 = g.p.accent2;
      const gloss = `linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.05))`;
      return `
${s} { background: linear-gradient(180deg, #f3f8ff 0%, #ffffff 220px); }
${s} .topbar { background: linear-gradient(180deg, #ffffff, #f2f7fc); border-bottom-color: #e2e8f0; }
${s} .btn { position: relative; overflow: hidden; border: none; font-weight: 700; }
${s} .btn::after {
  content: ""; position: absolute; left: 0; right: 0; top: 0; height: 50%;
  background: ${gloss}; border-radius: inherit; pointer-events: none;
}
${s} .btn-a {
  background: linear-gradient(180deg, ${mix(acc, "#ffffff", 0.2)} 0%, ${acc} 52%, ${mix(acc, "#000000", 0.22)} 100%);
  color: #ffffff; box-shadow: 0 2px 6px ${alpha(acc, 0.42)}, inset 0 1px 0 rgba(255,255,255,.6);
}
${s} .btn-b {
  background: linear-gradient(180deg, #ffffff, #eef2f7); color: var(--ink);
  border: 1px solid #cfd8e3; box-shadow: inset 0 1px 0 #ffffff;
}
${s} .kicker {
  display: inline-block; align-self: flex-start;
  background: ${alpha(acc, 0.12)}; color: ${acc};
  padding: 3px 10px; border-radius: 999px; letter-spacing: .1em;
}
${s} .card {
  background: linear-gradient(180deg, #ffffff, #f7fafd); border-color: #e6ecf3;
  box-shadow: 0 1px 2px rgba(20,40,80,.06), 0 10px 22px rgba(20,40,80,.07);
}
${s} .chip {
  background: linear-gradient(180deg, #ffffff, #eaf0f7); border: 1px solid #d3dded;
  color: var(--ink); font-weight: 600; box-shadow: inset 0 1px 0 #ffffff;
}
${s} .chip:last-child {
  background: linear-gradient(180deg, ${mix(acc2, "#ffffff", 0.2)}, ${acc2});
  color: #ffffff; border: none; text-transform: uppercase; font-weight: 800; letter-spacing: .05em;
}
${s} .stat-num { color: ${acc}; }
${s} .logo {
  position: relative;
  border-radius: 5px;
  background: linear-gradient(180deg, ${mix(acc, "#ffffff", 0.3)}, ${acc});
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
}
${s} .logo::after {
  content: ""; position: absolute; left: 0; right: 0; top: 100%; height: 10px; margin-top: 2px;
  background: linear-gradient(180deg, ${alpha(acc, 0.5)}, ${alpha(acc, 0)});
  border-radius: 5px;
}
`;
    },
  },

  // ------------------------------------------------------------------ aqua
  {
    id: "aqua",
    name: "Aqua Pinstripe",
    family: "web",
    traits: ["glossy", "retro", "soft"],
    blurb:
      "Early Mac OS X: a very light page combed with fine horizontal pinstripes, a brushed-metal top bar and footer, and crisp white cards floating on soft shadows. Buttons are glassy aqua gel lozenges with a strong white top highlight, and the logo is a row of three traffic-light dots. Calm, glossy, and softly rounded.",
    notes: [
      "The page background carries 1px grayscale pinstripes every 4px (repeating-linear-gradient); the top bar and footer are brushed metal — a gray vertical gradient over fine repeating horizontal hairlines.",
      "Buttons are full pills of aqua gel: a light-to-deep accent gradient with an inset white top highlight and a ::after highlight sweep over the upper 45%.",
      "Cards are plain white with a radius of 10 and a soft blue drop shadow.",
      "The logo is three hard radial-gradient dots (red, amber, green) side by side; charts use soft blue bars.",
    ],
    conform(g, r) {
      g.p = pal({
        bg: "#eef1f5", ink: "#1f2733", accent: "#2b7fe0", accent2: "#5aa0ea",
        surface: "#ffffff", surface2: "#f4f7fb", border: "#c4ccd6", muted: "#586675", dark: false,
      });
      g.fonts = { display: "humanist", body: "humanist", mono: "mono" };
      g.radius = 10; g.ctl = 999; g.bw = 1;
      g.shadow = "soft"; g.texture = "none";
      g.density = among(r, g.density, ["normal", "airy"]);
      g.case = "none"; g.hw = 600; g.track = 0;
      g.chart = "bars";
    },
    css(s, g) {
      const acc = g.p.accent;
      return `
${s} {
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,.035) 0 1px, transparent 1px 4px),
    #eef1f5;
}
${s} .topbar, ${s} .foot {
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,.03) 1px 2px),
    linear-gradient(180deg, #fbfcfd 0%, #e0e5eb 52%, #cfd5dd 100%);
  border-color: #b4bcc6;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
}
${s} .card { background: #ffffff; border-color: #d7dde5; box-shadow: 0 6px 16px rgba(40,60,90,.14); }
${s} .btn { position: relative; overflow: hidden; border: none; font-weight: 700; }
${s} .btn-a {
  background: linear-gradient(180deg, ${mix(acc, "#ffffff", 0.55)} 0%, ${acc} 48%, ${mix(acc, "#000000", 0.14)} 100%);
  color: #ffffff; box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 2px 6px ${alpha(acc, 0.4)};
}
${s} .btn::after {
  content: ""; position: absolute; left: 2px; right: 2px; top: 1px; height: 45%;
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.15));
  border-radius: 999px; pointer-events: none;
}
${s} .btn-b {
  background: linear-gradient(180deg, #ffffff, #e8edf2); color: var(--ink); border: 1px solid #c2cad4;
}
${s} .chip { background: #ffffff; border-color: #d0d8e1; }
${s} .kicker { color: ${acc}; }
${s} .stat-num { color: ${acc}; }
${s} .logo {
  width: 34px; height: 12px; border-radius: 0;
  background:
    radial-gradient(circle at 6px 6px, #ff6159 0 4px, transparent 4.5px),
    radial-gradient(circle at 17px 6px, #ffbd2e 0 4px, transparent 4.5px),
    radial-gradient(circle at 28px 6px, #28c941 0 4px, transparent 4.5px);
  background-repeat: no-repeat;
}
`;
    },
  },

  // --------------------------------------------------------------- arcade
  {
    id: "arcade",
    name: "8-Bit Arcade",
    family: "web",
    traits: ["retro", "vivid", "dark"],
    blurb:
      "An arcade cabinet attract screen: pure black, two flat saturated primaries (from red, yellow and cyan), and monospace type everywhere — bold, uppercase, widely tracked. Cards are chunky pixel panels with thick light borders and a stepped hard-shadow echo; buttons are flat blocks that sit on a 4px hard ledge like a pressed key. The kicker reads PLAYER 1 READY; the stat is a score. No glows — everything flat and stepped.",
    notes: [
      "Everything is monospace, bold, uppercase and wide-tracked on pure black; two saturated primaries split accent duty.",
      "Cards get a 3px light pixel border, square corners, and a stepped corner-notch echo faked with layered hard box-shadows (offset bg over offset ink — no blur).",
      "Buttons are flat blocks with a 3px border and a 4px solid bottom ledge (pressed-key feel); the kicker prefixes a ▶ marker and the score/stat runs in accent with wide tracking.",
      "Charts are pixel-column dots; strictly no glows or soft shadows anywhere.",
    ],
    conform(g, r) {
      const [a1, a2] = pick(r, [
        ["#ff2b2b", "#ffe500"], ["#ffe500", "#28e0ff"], ["#28e0ff", "#ff2b2b"],
        ["#ff2b2b", "#28e0ff"], ["#ffe500", "#ff2b2b"],
      ]);
      g.p = pal({
        bg: "#000000", ink: "#f2f2f2", accent: a1, accent2: a2,
        surface: "#0d0d0d", surface2: "#161616", border: "#3a3a3a", muted: "#9a9a9a", dark: true,
      });
      g.fonts = { display: "mono", body: "mono", mono: "mono" };
      g.radius = 0; g.ctl = 0; g.bw = 2;
      g.shadow = "hard"; g.texture = among(r, g.texture, ["none", "lines"]);
      g.density = among(r, g.density, ["normal", "dense"]);
      g.case = "upper"; g.hw = 700; g.track = 0.08;
      g.chart = "dots";
    },
    css(s, g) {
      return `
${s} .display { font-size: 38px; }
${s} .kicker { color: var(--accent); }
${s} .kicker::before { content: "▶ "; }
${s} .topbar { border-bottom: 3px solid var(--ink); }
${s} .foot { border-top: 3px solid var(--ink); font-family: var(--f-mono); }
${s} .card {
  background: #0d0d0d; border: 3px solid var(--ink); border-radius: 0;
  box-shadow: 4px 4px 0 var(--bg), 6px 6px 0 var(--ink);
}
${s} .card-t { color: var(--accent2); }
${s} .chip {
  border: 2px solid var(--ink); border-radius: 0; background: transparent; color: var(--ink);
  font-family: var(--f-mono); text-transform: uppercase; font-weight: 700; letter-spacing: .08em;
}
${s} .stat-num { color: var(--accent); letter-spacing: .14em; }
${s} .stat-delta { color: var(--accent2); }
${s} .btn {
  border: 3px solid var(--ink); border-radius: 0; font-family: var(--f-mono);
  text-transform: uppercase; font-weight: 700; box-shadow: 0 4px 0 var(--ink);
}
${s} .btn-a { background: var(--accent); color: #000000; }
${s} .btn-b { background: #0d0d0d; color: var(--ink); }
${s} .logo {
  width: 16px; height: 16px; border-radius: 0;
  background: linear-gradient(90deg, var(--accent) 50%, var(--accent2) 50%);
  box-shadow: 0 0 0 2px var(--ink);
}
`;
    },
  },
];
