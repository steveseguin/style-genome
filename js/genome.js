// The genome is the single source of truth for a style. The live CSS, the
// LLM prompt, and the PNG export are all derived from it, so they can never
// disagree with each other.

import { ARCHETYPES, ARCHETYPE_IDS } from "./archetypes/index.js";
import { basePalette, STRATEGIES } from "./palettes.js";
import { FONT_KEYS } from "./fonts.js";
import { pick, wpick, irange, chance, hashStr } from "./rng.js";
import { colorName } from "./color.js";

export const SHADOWS = ["none", "soft", "lifted", "hard", "emboss", "glow"];
export const TEXTURES = ["none", "grain", "dots", "lines", "paper", "grid"];
export const DENSITIES = ["airy", "normal", "dense"];
export const CHARTS = ["bars", "bars-outline", "bars-hatch", "line", "area", "dots"];
export const CASES = ["none", "upper", "lower"];
export const RADII = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28];

// Raw random genes; the archetype's conform() then imposes its identity.
export function randomGenome(r, archetypeId) {
  const archetype = archetypeId || pick(r, ARCHETYPE_IDS);
  const g = {
    archetype,
    p: basePalette(r, pick(r, STRATEGIES), irange(r, 0, 359), chance(r, 0.35)),
    fonts: {
      display: pick(r, FONT_KEYS),
      body: pick(r, FONT_KEYS.filter((k) => k !== "black" && k !== "script")),
      mono: "mono",
    },
    radius: pick(r, RADII),
    ctl: pick(r, [0, 4, 8, 12, 999]),
    bw: wpick(r, [[0, 1], [1, 4], [2, 2], [3, 1]]),
    shadow: pick(r, SHADOWS),
    texture: wpick(r, [["none", 5], ["grain", 1], ["dots", 1], ["lines", 1], ["paper", 1], ["grid", 1]]),
    density: pick(r, DENSITIES),
    case: wpick(r, [["none", 5], ["upper", 2], ["lower", 1]]),
    hw: pick(r, [400, 500, 600, 700, 800, 900]),
    track: pick(r, [-0.025, -0.01, 0, 0.02, 0.06]),
    chart: pick(r, CHARTS),
  };
  ARCHETYPES[archetype].conform(g, r);
  return g;
}

export function cloneGenome(g) {
  return JSON.parse(JSON.stringify(g));
}

// Stable identity for dedup ("have we shown this style already?").
export function genomeKey(g) {
  return hashStr(
    [
      g.archetype, g.p.bg, g.p.ink, g.p.accent, g.p.accent2, g.p.surface,
      g.fonts.display, g.fonts.body,
      g.radius, g.ctl, g.bw, g.shadow, g.texture, g.density, g.case, g.hw, g.chart,
    ].join("|")
  );
}

export function genomeName(g) {
  return ARCHETYPES[g.archetype].name;
}

// Short trait line for tile captions, e.g. "Azure · dark · round · soft".
// The accent color word comes first so two rolls of the same archetype
// read differently at a glance.
export function genomeGenesLabel(g) {
  const bits = [colorName(g.p.accent)];
  bits.push(g.p.dark ? "dark" : "light");
  bits.push(g.radius === 0 ? "sharp" : g.radius >= 16 ? "round" : "soft-corner");
  if (g.shadow === "hard") bits.push("hard-shadow");
  else if (g.shadow !== "none") bits.push(g.shadow);
  if (g.texture !== "none") bits.push(g.texture);
  return bits.slice(0, 4).join(" · ");
}
