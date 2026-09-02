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

const REQUIRED_ARCHETYPE_FIELDS = ["id", "name", "family", "traits", "blurb", "notes", "conform", "css"];
const ids = new Set();
const rng = mulberry32(0x5eed1234);
const keys = new Map();
let renders = 0;

for (const archetype of ARCHETYPE_LIST) {
  for (const field of REQUIRED_ARCHETYPE_FIELDS) {
    assert.notEqual(archetype[field], undefined, `${archetype.id || "unknown"}: missing ${field}`);
  }
  assert.equal(typeof archetype.conform, "function", `${archetype.id}: conform must be a function`);
  assert.equal(typeof archetype.css, "function", `${archetype.id}: css must be a function`);
  assert.ok(Array.isArray(archetype.traits) && archetype.traits.length, `${archetype.id}: traits required`);
  assert.ok(Array.isArray(archetype.notes) && archetype.notes.length, `${archetype.id}: notes required`);
  assert.ok(!ids.has(archetype.id), `duplicate archetype id: ${archetype.id}`);
  ids.add(archetype.id);

  for (let roll = 0; roll < 12; roll++) {
    const genome = randomGenome(rng, archetype.id);
    assert.equal(genome.schemaVersion, GENOME_SCHEMA_VERSION, `${archetype.id}: schema version`);
    for (const gene of GENE_KEYS) assert.notEqual(genome[gene], undefined, `${archetype.id}: missing gene ${gene}`);
    for (const role of ["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border", "dark"]) {
      assert.notEqual(genome.p[role], undefined, `${archetype.id}: missing palette role ${role}`);
    }

    const key = genomeKey(genome);
    const json = JSON.stringify(genome);
    if (keys.has(key)) assert.equal(keys.get(key), json, `genome key collision: ${archetype.id}`);
    else keys.set(key, json);

    const spec = chartSpec(genome);
    assert.ok(CHART_TREATMENTS.includes(spec.treatment), `${archetype.id}: invalid chart treatment ${spec.treatment}`);
    assert.ok(CHART_GRIDS.filter((item) => item !== "auto").includes(spec.grid), `${archetype.id}: invalid chart grid ${spec.grid}`);

    const prompt = buildPrompt(genome);
    assert.ok(prompt.includes(archetype.name), `${archetype.id}: prompt missing name`);
    assert.ok(prompt.includes("Canonical archetype craft CSS"), `${archetype.id}: prompt missing craft CSS`);
    for (const [role, value] of Object.entries(genome.p)) {
      if (role === "dark") continue;
      assert.ok(prompt.includes(String(value)), `${archetype.id}: prompt missing palette/decor role ${role}`);
    }

    if (roll === 0) {
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

assert.ok(ids.size >= 101, `expected at least 101 archetypes, found ${ids.size}`);
assert.deepEqual(
  new Set(CHART_TREATMENTS),
  new Set(["auto", "solid", "outline", "hatch", "crosshatch", "stipple", "halftone", "engraved", "rough", "overprint"]),
  "chart treatment coverage changed without updating validation",
);

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

console.log(`Validated ${ids.size} archetypes, ${keys.size} genomes, ${renders} specimen renders, complete discovery exposure, and live sibling variation.`);
