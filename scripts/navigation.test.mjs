import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { genomeKey, randomGenome } from "../js/genome.js";
import { mulberry32 } from "../js/rng.js";
import { genomeLink, parseHash } from "../js/share.js";
import { SPECIMEN_IDS } from "../js/specimens.js";

// Exercise the production hashchange handler without bootstrapping the DOM.
const source = readFileSync(new URL("../js/main.js", import.meta.url), "utf8");
const start = source.indexOf("function openFromHash() {");
const end = source.indexOf("\nif (!openFromHash())", start);
assert.ok(start >= 0 && end > start, "could not locate the hash navigation handler");
const handler = source.slice(start, end);
const genome = randomGenome(mulberry32(123), "swiss");

function navigation(hash, currentGenome = genome) {
  const state = { specimen: "brand", finalGenome: currentGenome, liked: [], history: [] };
  const rendered = [];
  const context = vm.createContext({
    state, parseHash, genomeKey, SPECIMEN_IDS,
    location: { hash },
    els: { specimenSelect: { value: "brand" } },
    setNote() {},
    snapshot: () => ({ finalGenome: state.finalGenome }),
    enterFinale: g => { state.finalGenome = g; rendered.push(state.specimen); },
    refreshFinale: () => rendered.push(state.specimen),
  });
  vm.runInContext(handler, context);
  return { context, state, rendered };
}

test("a same-genome link refreshes the view when its structure changes", () => {
  const { context, state, rendered } = navigation(genomeLink(genome, "operations"));
  assert.equal(context.openFromHash(), true);
  assert.equal(state.specimen, "operations");
  assert.equal(context.els.specimenSelect.value, "operations");
  assert.deepEqual(rendered, ["operations"]);
  assert.equal(state.history.length, 0, "structure-only navigation should preserve style history");
});

test("an unchanged permalink does not rerender or add history", () => {
  const { context, rendered, state } = navigation(genomeLink(genome, "brand"));
  assert.equal(context.openFromHash(), true);
  assert.deepEqual(rendered, []);
  assert.equal(state.history.length, 0);
});

test("a new genome still opens the editor and saves style history", () => {
  const next = randomGenome(mulberry32(456), "cosmic");
  const { context, state, rendered } = navigation(genomeLink(next, "publication"));
  assert.equal(context.openFromHash(), true);
  assert.equal(genomeKey(state.finalGenome), genomeKey(next));
  assert.deepEqual(rendered, ["publication"]);
  assert.equal(state.history.length, 1);
});

test("invalid links leave the current view intact", () => {
  const { context, state, rendered } = navigation("#g=broken&s=operations");
  assert.equal(context.openFromHash(), false);
  assert.equal(state.specimen, "brand");
  assert.deepEqual(rendered, []);
});
