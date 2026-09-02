import assert from "node:assert/strict";
import { ARCHETYPE_LIST } from "../js/archetypes/index.js";
import {
  randomGenome, genomeKey, GENE_KEYS, GENOME_SCHEMA_VERSION,
  CHART_TREATMENTS, CHART_GRIDS,
} from "../js/genome.js";
import { buildSample, chartSpec } from "../js/render.js";
import { buildPrompt } from "../js/prompt.js";
import { SPECIMENS, SPECIMEN_IDS } from "../js/specimens.js";
import { mulberry32 } from "../js/rng.js";
import { diverseSet, neighborSet } from "../js/evolve.js";
import { fullStylesheet, tokensRootCss, starterCss } from "../js/starter.js";
import { encodeGenome, decodeGenome, genomeLink, parseHash, normalizeGenome } from "../js/share.js";
import { describeColor } from "../js/color.js";
import { MOTIFS, MOTIF_SLOTS, MOTIF_BY_ID, MOTIF_COMBOS, motifAllowed, motifsCss } from "../js/motifs.js";

const REQUIRED_ARCHETYPE_FIELDS = ["id", "name", "family", "traits", "blurb", "notes", "conform", "css"];
const PALETTE_ROLES = ["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border", "dark"];
const ids = new Set();
const rng = mulberry32(0x5eed1234);
const keys = new Map();
let renders = 0;
let prompts = 0;

for (const archetype of ARCHETYPE_LIST) {
  for (const field of REQUIRED_ARCHETYPE_FIELDS) {
    assert.notEqual(archetype[field], undefined, `${archetype.id || "unknown"}: missing ${field}`);
  }
  assert.equal(typeof archetype.conform, "function", `${archetype.id}: conform must be a function`);
  assert.equal(typeof archetype.css, "function", `${archetype.id}: css must be a function`);
  assert.ok(Array.isArray(archetype.traits) && archetype.traits.length, `${archetype.id}: traits required`);
  assert.ok(Array.isArray(archetype.notes) && archetype.notes.length, `${archetype.id}: notes required`);
  assert.ok(archetype.blurb.length > 80, `${archetype.id}: blurb should describe the style in prose`);
  assert.ok(!ids.has(archetype.id), `duplicate archetype id: ${archetype.id}`);
  ids.add(archetype.id);

  for (let roll = 0; roll < 12; roll++) {
    const genome = randomGenome(rng, archetype.id);
    assert.equal(genome.schemaVersion, GENOME_SCHEMA_VERSION, `${archetype.id}: schema version`);
    for (const gene of GENE_KEYS) assert.notEqual(genome[gene], undefined, `${archetype.id}: missing gene ${gene}`);
    for (const role of PALETTE_ROLES) {
      assert.notEqual(genome.p[role], undefined, `${archetype.id}: missing palette role ${role}`);
    }
    for (const [role, value] of Object.entries(genome.p)) {
      if (role === "dark") continue;
      assert.ok(/^#[0-9a-f]{6}$/i.test(value), `${archetype.id}: palette role ${role} is not a hex color (${value})`);
      assert.ok(describeColor(value).length > 2, `${archetype.id}: no plain-language name for ${role}`);
    }

    const key = genomeKey(genome);
    const json = JSON.stringify(genome);
    if (keys.has(key)) assert.equal(keys.get(key), json, `genome key collision: ${archetype.id}`);
    else keys.set(key, json);

    const spec = chartSpec(genome);
    assert.ok(CHART_TREATMENTS.includes(spec.treatment), `${archetype.id}: invalid chart treatment ${spec.treatment}`);
    assert.ok(CHART_GRIDS.filter((item) => item !== "auto").includes(spec.grid), `${archetype.id}: invalid chart grid ${spec.grid}`);

    // The craft CSS must never leak an undefined interpolation.
    const craft = archetype.css(".style-scope", genome);
    assert.ok(!/undefined|NaN/.test(craft), `${archetype.id}: craft CSS contains undefined/NaN`);

    // Motifs occupy slots the archetype's own CSS leaves open, or stack as
    // additive decorations where nothing conflicts.
    for (const [slot, id] of Object.entries(genome.motifs || {})) {
      assert.ok(MOTIF_BY_ID[id] && MOTIF_BY_ID[id].slot === slot, `${archetype.id}: bad motif ${slot}=${id}`);
      assert.ok(motifAllowed(MOTIF_BY_ID[id], craft, ".style-scope"), `${archetype.id}: motif ${id} conflicts with the archetype's own ${slot} styling`);
    }
    assert.ok(!/undefined|NaN/.test(motifsCss(genome, ".style-scope")), `${archetype.id}: motif CSS contains undefined/NaN`);

    const prompt = buildPrompt(genome);
    prompts++;
    assert.ok(prompt.includes(archetype.name), `${archetype.id}: prompt missing name`);
    assert.ok(prompt.includes("## 1. At a glance"), `${archetype.id}: prompt missing summary section`);
    assert.ok(prompt.includes("### Never"), `${archetype.id}: prompt missing never-rules`);
    assert.ok(prompt.includes(":root {"), `${archetype.id}: prompt missing tokens block`);
    assert.ok(prompt.includes("Starter component CSS"), `${archetype.id}: prompt missing starter CSS`);
    assert.ok(prompt.includes("Canonical archetype craft CSS"), `${archetype.id}: prompt missing craft CSS`);
    assert.ok(prompt.includes("Class glossary"), `${archetype.id}: prompt missing class glossary`);
    assert.ok(prompt.includes("Machine-readable genome"), `${archetype.id}: prompt missing genome`);
    for (const note of archetype.notes) assert.ok(prompt.includes(note), `${archetype.id}: prompt missing a signature note`);
    for (const [role, value] of Object.entries(genome.p)) {
      if (role === "dark") continue;
      assert.ok(prompt.includes(String(value)), `${archetype.id}: prompt missing palette/decor role ${role}`);
    }

    if (roll === 0) {
      const compact = buildPrompt(genome, "brand", { mode: "compact" });
      assert.ok(compact.length < prompt.length * 0.7, `${archetype.id}: compact prompt is not materially shorter`);
      assert.ok(compact.includes(":root {") && compact.includes("### Never"), `${archetype.id}: compact prompt lost essentials`);
      assert.ok(!compact.includes("Canonical archetype craft CSS"), `${archetype.id}: compact prompt should omit craft CSS`);
      const sections = [...compact.matchAll(/^## (\d+)\. /gm)].map((m) => Number(m[1]));
      assert.deepEqual(sections, sections.map((_, i) => i + 1), `${archetype.id}: compact section numbering is not continuous`);

      const sheet = fullStylesheet(genome, archetype, `${archetype.id}-${key}`);
      assert.ok(sheet.includes(tokensRootCss(genome)) && sheet.includes(starterCss(genome)), `${archetype.id}: stylesheet missing tokens/starter`);
      assert.ok(sheet.includes(craft.trim()), `${archetype.id}: stylesheet missing craft CSS`);

      const roundTrip = decodeGenome(encodeGenome(genome));
      assert.deepEqual(roundTrip, genome, `${archetype.id}: permalink round-trip changed the genome`);
      assert.equal(genomeKey(roundTrip), key, `${archetype.id}: permalink round-trip changed the identity`);
      const parsed = parseHash(genomeLink(genome, "operations"));
      assert.equal(parsed.specimen, "operations", `${archetype.id}: permalink lost the structure`);
      assert.deepEqual(parsed.genome, genome, `${archetype.id}: permalink hash parse changed the genome`);

      for (const specimen of SPECIMEN_IDS) {
        const sample = buildSample(genome, specimen);
        assert.ok(sample.html.includes("<main"), `${archetype.id}/${specimen}: missing main`);
        assert.ok(sample.html.includes("class=\"card"), `${archetype.id}/${specimen}: missing component surface`);
        assert.ok(sample.css.includes(`.${sample.cls}`), `${archetype.id}/${specimen}: unscoped CSS`);
        const structuredPrompt = buildPrompt(genome, specimen);
        const structure = SPECIMENS.find((item) => item.id === specimen);
        assert.ok(structuredPrompt.includes(`**${structure.label}**`), `${archetype.id}/${specimen}: prompt missing selected structure`);
        assert.ok(structuredPrompt.includes(structure.contract), `${archetype.id}/${specimen}: prompt missing structure contract`);
        renders++;
      }
    }
  }
}

assert.ok(ids.size >= 114, `expected at least 114 archetypes, found ${ids.size}`);
assert.deepEqual(
  new Set(CHART_TREATMENTS),
  new Set(["auto", "solid", "outline", "hatch", "crosshatch", "stipple", "halftone", "engraved", "rough", "overprint"]),
  "chart treatment coverage changed without updating validation",
);

// Every motif renders for a light and a dark genome, declares a real slot,
// and never uses the banned accent edge-stripe pattern.
const lightG = randomGenome(mulberry32(1), "flatneutral");
const darkG = randomGenome(mulberry32(2), "cosmic");
const motifIds = new Set();
for (const m of MOTIFS) {
  assert.ok(MOTIF_SLOTS.includes(m.slot), `motif ${m.id}: unknown slot ${m.slot}`);
  assert.ok(!motifIds.has(m.id), `duplicate motif id ${m.id}`);
  motifIds.add(m.id);
  assert.ok(m.note && m.note.length > 30, `motif ${m.id}: needs a prompt note`);
  for (const g of [lightG, darkG]) {
    const css = m.css(".style-scope", g);
    assert.ok(css.includes(".style-scope"), `motif ${m.id}: unscoped CSS`);
    assert.ok(!/undefined|NaN/.test(css), `motif ${m.id}: CSS contains undefined/NaN`);
    assert.ok(!/border-(left|right)\s*:\s*[^;]*var\(--accent/.test(css), `motif ${m.id}: accent edge stripe`);
  }
}
assert.ok(MOTIF_COMBOS > 1_000_000, `motif combination space too small: ${MOTIF_COMBOS}`);

// Import must reject junk with a readable message and accept a bare genome.
assert.throws(() => normalizeGenome({ archetype: "nope", p: {} }), /Unknown archetype/);
assert.throws(() => normalizeGenome({ archetype: "swiss", p: { bg: "#fff" } }), /Palette is missing/);
assert.equal(parseHash(""), null);
assert.equal(parseHash("#s=brand"), null);

const exposed = new Set();
const familyCount = new Set(ARCHETYPE_LIST.map((archetype) => archetype.family)).size;
for (let seed = 0; seed < 256; seed++) {
  const grid = diverseSet(mulberry32(0x51a70000 + seed), 12, () => false, null);
  assert.equal(grid.length, 12, `discovery seed ${seed}: incomplete opening grid`);
  assert.equal(new Set(grid.map((genome) => genome.archetype)).size, 12, `discovery seed ${seed}: repeated archetype`);
  assert.equal(
    new Set(grid.map((genome) => ARCHETYPE_LIST.find((item) => item.id === genome.archetype).family)).size,
    Math.min(12, familyCount),
    `discovery seed ${seed}: family coverage regression`,
  );
  for (const genome of grid) exposed.add(genome.archetype);
}
assert.deepEqual(
  new Set(ARCHETYPE_LIST.map((archetype) => archetype.id)),
  exposed,
  "some archetypes are unreachable across the discovery exposure probe",
);

// Broadsheet was previously a fully fixed preset: every "sibling" collapsed
// back to the same genome. Later-round raw-gene mutation must keep producing
// distinct but recognizably Broadsheet candidates.
const fixedBase = randomGenome(mulberry32(0xb10ad), "broadsheet");
const siblingKeys = new Set();
for (let seed = 0; seed < 32; seed++) {
  const neighbors = neighborSet(mulberry32(0x700000 + seed), [fixedBase], 11, 2, () => false, null, new Set());
  for (const genome of neighbors) {
    if (genome.archetype === fixedBase.archetype) siblingKeys.add(genomeKey(genome));
  }
}
assert.ok(siblingKeys.size >= 12, `fixed-style variation regressed: only ${siblingKeys.size} unique Broadsheet siblings`);
assert.ok(!siblingKeys.has(genomeKey(fixedBase)), "fixed-style mutation repeated the canonical Broadsheet genome");

console.log(`Validated ${ids.size} archetypes, ${MOTIFS.length} motifs (${MOTIF_COMBOS.toLocaleString()} combinations), ${keys.size} genomes, ${prompts} prompts, ${renders} specimen renders, stylesheet + permalink round-trips, complete discovery exposure, and live sibling variation.`);
