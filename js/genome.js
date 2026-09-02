// The genome is the single source of truth for a style. The live CSS, the
// LLM prompt, and the PNG export are all derived from it, so they can never
// disagree with each other.

import { ARCHETYPES, ARCHETYPE_IDS } from "./archetypes/index.js";
import { basePalette, STRATEGIES } from "./palettes.js";
import { FONT_KEYS } from "./fonts.js";
import { pick, wpick, irange, chance, hashStr } from "./rng.js";
import { colorName } from "./color.js";
import { sampleMotifs } from "./motifs.js";

export const GENOME_SCHEMA_VERSION = 2;
export const SHADOWS = ["none", "soft", "lifted", "hard", "emboss", "glow"];
export const TEXTURES = [
  "none", "grain", "dots", "lines", "paper", "grid",
  "crosshatch", "stipple", "halftone", "fibers", "engraved",
];
export const DENSITIES = ["airy", "normal", "dense"];
export const CHARTS = ["bars", "bars-outline", "bars-hatch", "line", "area", "dots"];
// Chart geometry and print treatment are independent. `auto` preserves the
// legacy combined chart values while letting print archetypes specify an
// accurate material process without inventing a second chart geometry.
export const CHART_TREATMENTS = [
  "auto", "solid", "outline", "hatch", "crosshatch", "stipple",
  "halftone", "engraved", "rough", "overprint",
];
export const CHART_GRIDS = ["auto", "full", "baseline", "none"];
export const CASES = ["none", "upper", "lower"];
export const RADII = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28];

// Every top-level style gene that evolution may recombine. Keeping this list
// beside the schema prevents mutation/crossover from silently lagging behind
// newly added genes.
export const GENE_KEYS = [
  "p", "fonts", "radius", "ctl", "bw", "shadow", "texture", "density",
  "case", "hw", "track", "chart", "chartTreatment", "chartGrid", "motifs",
];

// Raw random genes before an archetype imposes its canonical identity. These
// are also the variation reservoir for later evolutionary rounds: the bespoke
// archetype CSS remains constant while selected token groups can genuinely
// move instead of being reset by conform().
export function randomGeneGenome(r, archetypeId) {
  const archetype = archetypeId || pick(r, ARCHETYPE_IDS);
  return {
    schemaVersion: GENOME_SCHEMA_VERSION,
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
    texture: wpick(r, [
      ["none", 7], ["grain", 2], ["dots", 1], ["lines", 1], ["paper", 2], ["grid", 1],
      ["crosshatch", 1], ["stipple", 1], ["halftone", 1], ["fibers", 1], ["engraved", 1],
    ]),
    density: pick(r, DENSITIES),
    case: wpick(r, [["none", 5], ["upper", 2], ["lower", 1]]),
    hw: pick(r, [400, 500, 600, 700, 800, 900]),
    track: pick(r, [-0.025, -0.01, 0, 0.02, 0.06]),
    chart: pick(r, CHARTS),
    chartTreatment: "auto",
    chartGrid: "auto",
    motifs: {},
  };
}

// A design = archetype identity (conform) + one optional motif per component
// slot the archetype leaves open. The motif draw happens after conform so it
// can respect the final palette mode and the archetype's own craft CSS.
export function randomGenome(r, archetypeId) {
  const g = randomGeneGenome(r, archetypeId);
  const archetype = ARCHETYPES[g.archetype];
  archetype.conform(g, r);
  g.motifs = sampleMotifs(r, g, archetype.css(".x", g), archetype.traits, ".x");
  return g;
}

export function cloneGenome(g) {
  return JSON.parse(JSON.stringify(g));
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

// Stable identity for dedup ("have we shown this style already?"). Include
// the complete genome so custom decor colors and future genes cannot collide.
export function genomeKey(g) {
  return hashStr(stableJson(g));
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
  if (g.chartTreatment && g.chartTreatment !== "auto" && bits.length < 4) bits.push(g.chartTreatment);
  return bits.slice(0, 4).join(" · ");
}
