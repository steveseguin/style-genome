// Interactive-evolution engine.
//   Round 1: farthest-point sampling → 12 provably spread-out styles,
//   optionally constrained by the user's quick filters (mode/energy).
//   Rounds 2+: neighbors of the liked set — same archetype re-parameterized,
//   cousins carrying the liked genes, occasional wildcards — with the
//   mutation radius shrinking every round. Archetypes the user has seen and
//   NOT picked are treated as soft rejections and avoided (the explicit
//   mode/energy filter always outranks rejection-avoidance).
//
// Convergence is deliberately gradual: a first pick is treated as evidence,
// not a template. Round 2 carries the liked palette to only about a third of
// the cousins and caps identical-palette tiles, so the grid explores form
// and color separately; by round 4 nearly everything inherits the palette.

import { ARCHETYPES, ARCHETYPE_IDS, relatedArchetypes } from "./archetypes/index.js";
import { randomGenome, randomGeneGenome, cloneGenome, genomeKey, genomeGenesLabel, GENE_KEYS } from "./genome.js";
import { hexToHsl } from "./color.js";
import { fontClass } from "./fonts.js";
import { chartSpec } from "./render.js";
import { normalizeMotifs, MOTIF_SLOTS } from "./motifs.js";
import { pick, chance, shuffle, mulberry32 } from "./rng.js";

const STANDARD_ROLES = new Set(["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border", "dark"]);
const decorRoles = (p) => Object.fromEntries(Object.entries(p).filter(([key]) => !STANDARD_ROLES.has(key)));

// ---------------------------------------------------------------- distance

function features(g) {
  const arch = ARCHETYPES[g.archetype];
  const accent = hexToHsl(g.p.accent);
  return {
    archetype: g.archetype,
    family: arch.family,
    dark: g.p.dark ? 1 : 0,
    hueBucket: Math.round(accent.h / 45) % 8,
    satBucket: accent.s > 65 ? 2 : accent.s > 30 ? 1 : 0,
    displayKey: g.fonts.display,
    displayCls: fontClass(g.fonts.display),
    bodyCls: fontClass(g.fonts.body),
    radiusBucket: g.radius === 0 ? 0 : g.radius <= 8 ? 1 : g.radius <= 16 ? 2 : 3,
    controlBucket: g.ctl === 999 ? 4 : g.ctl === 0 ? 0 : g.ctl <= 6 ? 1 : g.ctl <= 12 ? 2 : 3,
    borderBucket: g.bw || 0,
    shadow: g.shadow,
    texture: g.texture,
    density: g.density,
    caseStyle: g.case,
    weightBucket: Math.round((g.hw || 400) / 200),
    trackBucket: Math.round((g.track || 0) * 50),
    chart: g.chart,
    chartTreatment: g.chartTreatment || "auto",
    chartGrid: g.chartGrid || "auto",
    motifs: g.motifs || {},
  };
}

export function dist(a, b) {
  const fa = features(a), fb = features(b);
  let d = 0;
  if (fa.archetype !== fb.archetype) d += 2;
  if (fa.family !== fb.family) d += 3;
  if (fa.dark !== fb.dark) d += 2.5;
  const hueDiff = Math.min(Math.abs(fa.hueBucket - fb.hueBucket), 8 - Math.abs(fa.hueBucket - fb.hueBucket));
  d += hueDiff * 0.5;
  if (fa.satBucket !== fb.satBucket) d += 0.75;
  if (fa.displayCls !== fb.displayCls) d += 1.5;
  else if (fa.displayKey !== fb.displayKey) d += 0.45;
  if (fa.bodyCls !== fb.bodyCls) d += 0.65;
  d += Math.abs(fa.radiusBucket - fb.radiusBucket) * 0.5;
  d += Math.abs(fa.controlBucket - fb.controlBucket) * 0.25;
  d += Math.abs(fa.borderBucket - fb.borderBucket) * 0.2;
  if (fa.shadow !== fb.shadow) d += 1;
  if (fa.texture !== fb.texture) d += 0.65;
  if (fa.density !== fb.density) d += 0.5;
  if (fa.caseStyle !== fb.caseStyle) d += 0.5;
  d += Math.min(Math.abs(fa.weightBucket - fb.weightBucket), 2) * 0.2;
  d += Math.min(Math.abs(fa.trackBucket - fb.trackBucket), 3) * 0.12;
  if (fa.chart !== fb.chart) d += 0.25;
  if (fa.chartTreatment !== fb.chartTreatment) d += 0.25;
  if (fa.chartGrid !== fb.chartGrid) d += 0.15;
  for (const slot of MOTIF_SLOTS) if ((fa.motifs[slot] || "") !== (fb.motifs[slot] || "")) d += 0.15;
  return d;
}

// ------------------------------------------------------------ quick filters

// Energy is judged from archetype traits; archetypes with neither calm nor
// bold traits are neutral and pass both filters.
const BOLD_TRAITS = ["bold", "playful", "neon", "punk", "raw", "pattern", "glossy", "vivid", "highcontrast", "chunky"];
const CALM_TRAITS = ["minimal", "calm", "airy", "elegant", "soft", "natural", "scholarly"];

export function matchesPrefs(g, prefs) {
  if (!prefs) return true;
  if (prefs.mode === "light" && g.p.dark) return false;
  if (prefs.mode === "dark" && !g.p.dark) return false;
  if (prefs.energy && prefs.energy !== "any") {
    const t = ARCHETYPES[g.archetype].traits;
    const isBold = t.some((x) => BOLD_TRAITS.includes(x));
    const isCalm = t.some((x) => CALM_TRAITS.includes(x));
    if (prefs.energy === "bold" && isCalm && !isBold) return false;
    if (prefs.energy === "calm" && isBold && !isCalm) return false;
  }
  return true;
}

// Which archetypes can produce dark / light styles at all? Sampled once at
// startup (some archetypes flip mode by chance in conform()), so the samplers
// never waste rolls on — say — asking Photocopy Zine for a dark theme.
const DARK_CAPABLE = new Set();
const LIGHT_CAPABLE = new Set();
{
  const capR = mulberry32(0xc0ffee);
  for (const id of ARCHETYPE_IDS) {
    for (let i = 0; i < 24; i++) {
      const g = randomGenome(capR, id);
      (g.p.dark ? DARK_CAPABLE : LIGHT_CAPABLE).add(id);
    }
  }
}

function modeIds(prefs) {
  if (prefs?.mode === "dark") return ARCHETYPE_IDS.filter((id) => DARK_CAPABLE.has(id));
  if (prefs?.mode === "light") return ARCHETYPE_IDS.filter((id) => LIGHT_CAPABLE.has(id));
  return ARCHETYPE_IDS;
}

// ----------------------------------------------------------- print process

// Physical print treatments (crosshatch, stipple, rough relief…) belong to
// archetypes that are print processes. They must never be inherited by, say,
// a concrete-brutalist or SaaS archetype through a cousin or crossover.
const PROCESS_TREATMENTS = new Set(["hatch", "crosshatch", "stipple", "halftone", "engraved", "rough", "overprint"]);
const PRINT_TRAITS = ["print", "intaglio", "relief", "planographic", "screen", "offset", "woodblock"];
const isPrintArchetype = (id) => ARCHETYPES[id].traits.some((t) => PRINT_TRAITS.includes(t));
export const isPatterned = (g) => PROCESS_TREATMENTS.has(chartSpec(g).treatment);

// Carry chart genes from `from` onto `g` only when the receiving archetype
// can wear them.
function carryChartGenes(g, from) {
  g.chart = from.chart;
  if (isPrintArchetype(g.archetype) || !PROCESS_TREATMENTS.has(chartSpec(from).treatment)) {
    g.chartTreatment = from.chartTreatment || "auto";
    g.chartGrid = from.chartGrid || "auto";
  } else if (g.chart === "bars-hatch") {
    g.chart = "bars";
  }
}

// Warm light "paper" pages (cream, beige, khaki, parchment) and grain-type
// textures are common enough in the catalog that a grid needs a cap on them.
export function isCreamPage(g) {
  const { h, s, l } = hexToHsl(g.p.bg);
  return l >= 78 && s >= 8 && h >= 10 && h <= 65;
}
const isGrainy = (g) => ["grain", "paper", "fibers"].includes(g.texture);

// A grid must never show two tiles that read identically: same archetype AND
// same trait caption. (The caption includes the accent color word, so honest
// re-rolls of an archetype still pass.)
const labelKey = (g) => `${g.archetype}|${genomeGenesLabel(g)}`;
const paletteKey = (g) => `${g.p.bg}|${g.p.accent}`;

// ------------------------------------------------- round 1: maximum spread

export function diverseSet(r, n, isTaken, prefs) {
  // Build a large candidate pool. The first pass gives each available family
  // one fair slot and chooses the archetype inside that family uniformly;
  // maximin scoring then picks its strongest roll. This keeps a growing family
  // (especially print) discoverable instead of letting its most extreme member
  // monopolize the distance metric. A global maximin pass fills any spare slots.
  const pool = [];
  for (const id of shuffle(r, modeIds(prefs))) {
    for (let i = 0; i < 8; i++) {
      const g = randomGenome(r, id);
      if (matchesPrefs(g, prefs)) pool.push(g);
    }
  }
  const chosen = [];
  const archCount = new Map();
  const labels = new Set();
  let patterned = 0;
  let cream = 0;
  let textured = 0;
  // The opening grid must read as twelve different worlds, not a print show
  // or a stack of beige paper: cap patterned charts, warm cream/beige pages,
  // and grain/paper textures. Nearly a third of the catalog lives on cream
  // stock, so without a cap it dominates the light half of every grid.
  const MAX_PATTERNED = 3;
  const MAX_CREAM = prefs?.mode === "light" ? 5 : 3;
  const MAX_TEXTURED = 3;
  const MIN_DARK = prefs?.mode === "light" ? 0 : 5;
  let dark = 0;

  const accept = (c, maxPerArch, relaxed = false) => {
    if (isTaken(genomeKey(c))) return false;
    if ((archCount.get(c.archetype) || 0) >= maxPerArch) return false;
    if (labels.has(labelKey(c))) return false;
    if (relaxed) return true;
    if (patterned >= MAX_PATTERNED && isPatterned(c)) return false;
    if (cream >= MAX_CREAM && isCreamPage(c)) return false;
    if (textured >= MAX_TEXTURED && isGrainy(c)) return false;
    return true;
  };
  const take = (c) => {
    chosen.push(c);
    archCount.set(c.archetype, (archCount.get(c.archetype) || 0) + 1);
    labels.add(labelKey(c));
    if (isPatterned(c)) patterned++;
    if (isCreamPage(c)) cream++;
    if (isGrainy(c)) textured++;
    if (c.p.dark) dark++;
  };

  const families = shuffle(r, [...new Set(pool.map((g) => ARCHETYPES[g.archetype].family))]);
  for (const family of families) {
    if (chosen.length >= n) break;
    const familyPool = pool.filter((g) => ARCHETYPES[g.archetype].family === family && accept(g, 1));
    const archetypeIds = [...new Set(familyPool.map((g) => g.archetype))];
    if (!archetypeIds.length) continue;
    const targetId = pick(r, archetypeIds);
    const rolls = familyPool.filter((g) => g.archetype === targetId);
    let best = null, bestScore = -1;
    for (const candidate of rolls) {
      const nearest = chosen.length
        ? Math.min(...chosen.map((existing) => dist(candidate, existing)))
        : r();
      if (nearest > bestScore) { bestScore = nearest; best = candidate; }
    }
    if (best) take(best);
  }

  // Pass 1: unique archetypes. Pass 2 (only if the filtered pool is too thin,
  // e.g. "dark + calm"): allow a second roll of an archetype. Pass 3 drops
  // the mix caps so a constrained filter still fills the grid.
  for (const [maxPerArch, relaxed] of [[1, false], [2, false], [2, true]]) {
    while (chosen.length < n) {
      // Once the remaining slots are needed to reach the dark minimum, only
      // dark candidates qualify (if the pool has any left).
      const mustBeDark = !relaxed && dark < MIN_DARK && n - chosen.length <= MIN_DARK - dark
        && pool.some((c) => c.p.dark && accept(c, maxPerArch));
      let best = null, bestScore = -1;
      for (const c of pool) {
        if (mustBeDark && !c.p.dark) continue;
        if (!accept(c, maxPerArch, relaxed)) continue;
        let nearest = Infinity;
        for (const ch of chosen) nearest = Math.min(nearest, dist(c, ch));
        if (nearest > bestScore) { bestScore = nearest; best = c; }
      }
      if (!best) break;
      take(best);
    }
    if (chosen.length >= n) break;
  }
  return chosen;
}

// ------------------------------------------- later rounds: guided neighbors

// Re-roll a subset of genes while preserving the selected archetype's bespoke
// CSS identity. Palette and fonts are identity-critical, so they mostly come
// from the archetype's own conform() (a Bauhaus stays primary-colored) with
// an occasional raw roll for genuine surprise; the remaining genes vary raw.
function mutate(r, base, rate) {
  const g = cloneGenome(base);
  const fresh = randomGeneGenome(r, g.archetype);
  const conformed = randomGenome(r, g.archetype);
  for (const gene of GENE_KEYS) {
    if (!chance(r, rate)) continue;
    if (gene === "p") {
      g.p = chance(r, 0.7)
        ? cloneGenome(conformed.p)
        : { ...cloneGenome(fresh.p), ...decorRoles(g.p) };
    } else if (gene === "fonts") {
      g.fonts = cloneGenome(chance(r, 0.7) ? conformed.fonts : fresh.fonts);
    } else if (gene === "chart") {
      g.chart = fresh.chart === "bars-hatch" && !isPrintArchetype(g.archetype) ? "bars" : fresh.chart;
    } else if (gene === "chartTreatment" || gene === "chartGrid") {
      g[gene] = conformed[gene];
    } else if (gene === "motifs") {
      g.motifs = cloneGenome(conformed.motifs || {});
    } else {
      g[gene] = cloneGenome(fresh)[gene];
    }
  }
  return g;
}

// Jump to a related archetype. With probability carryP it wears the liked
// palette (a "bridge"); otherwise it keeps its own palette so the grid
// explores form independently of color. A cousin exists to EXPLORE: it never
// lands on a liked archetype (mutate() covers those), prefers archetypes the
// user hasn't rejected, but will fall back to rejected relatives rather than
// produce nothing.
function cousin(r, base, rejectedArchs, prefs, likedArchs, carryP) {
  const inMode = new Set(modeIds(prefs));
  let rel = relatedArchetypes(base.archetype).filter((id) => inMode.has(id));
  if (!rel.length) rel = relatedArchetypes(base.archetype);
  const exploring = rel.filter((id) => !likedArchs.has(id));
  const fresh = exploring.filter((id) => !rejectedArchs.has(id));
  const pool = fresh.length ? fresh : exploring.length ? exploring : rel;
  const g = randomGenome(r, pick(r, pool));
  const carried = cloneGenome(base);
  if (chance(r, carryP)) {
    // Carry the complete standard palette promised by the picker while
    // preserving target-archetype custom decor roles such as gold/paper3.
    g.p = { ...cloneGenome(carried.p), ...decorRoles(g.p) };
  }
  g.density = carried.density;
  carryChartGenes(g, carried);
  return g;
}

function crossover(r, a, b) {
  const g = cloneGenome(chance(r, 0.5) ? a : b);
  const other = g.archetype === a.archetype ? b : a;
  for (const gene of GENE_KEYS) {
    if (!chance(r, 0.5)) continue;
    if (gene === "p") {
      g.p = { ...cloneGenome(other.p), ...decorRoles(g.p) };
    } else if (gene === "chart" || gene === "chartTreatment" || gene === "chartGrid") {
      carryChartGenes(g, other);
    } else if (gene === "motifs") {
      const craft = ARCHETYPES[g.archetype].css(".x", g);
      g.motifs = normalizeMotifs(other.motifs, craft, ".x");
    } else {
      g[gene] = cloneGenome(other)[gene];
    }
  }
  // Re-conforming would reset nearly every crossed gene. The base archetype's
  // bespoke CSS remains the identity; the crossed token groups remain visible.
  return g;
}

// round: 2, 3, 4… — later rounds mutate less, wander less, and inherit more.
export function neighborSet(r, liked, n, round, isTaken, prefs, rejectedArchs = new Set()) {
  const cfg = {
    2: { rate: 0.55, cousinP: 0.4, wildP: 0.15, carryP: 0.35, samePal: 2 },
    3: { rate: 0.4, cousinP: 0.3, wildP: 0.06, carryP: 0.6, samePal: 4 },
    4: { rate: 0.25, cousinP: 0.2, wildP: 0, carryP: 0.85, samePal: 7 },
  }[Math.min(round, 4)] || { rate: 0.2, cousinP: 0.15, wildP: 0, carryP: 0.9, samePal: 8 };
  const crossP = liked.length >= 2 ? 0.25 : 0;

  const fav = liked[liked.length - 1];
  const out = [];
  const batchKeys = new Set();
  // The favorite is prepended to the grid by the caller — count it here so we
  // never build a near-clone of it or a same-reading caption.
  const labels = new Set([labelKey(fav)]);
  const archCount = new Map([[fav.archetype, 1]]);
  const favPal = paletteKey(fav);
  let samePal = 0;
  let patterned = 0;
  // If the user has not shown interest in a print process, keep patterned
  // charts rare; if they picked one, let the print family come through.
  const maxPatterned = liked.some(isPatterned) ? n : 2;
  const inModeIds = modeIds(prefs);
  const wildIdsFresh = inModeIds.filter((id) => !rejectedArchs.has(id));
  const wildIds = wildIdsFresh.length ? wildIdsFresh : inModeIds;

  // strict=true applies every niceness constraint; strict=false keeps the
  // ones that must never break: novelty, the user's filters, no fav clones,
  // and no two tiles that read identically (same archetype + same caption).
  const acceptable = (g, strict) => {
    const key = genomeKey(g);
    if (isTaken(key) || batchKeys.has(key)) return false;
    if (!matchesPrefs(g, prefs)) return false;
    if (dist(g, fav) < 0.55) return false;
    if (labels.has(labelKey(g))) return false;
    if (strict) {
      if ((archCount.get(g.archetype) || 0) >= 2) return false;
      if (paletteKey(g) === favPal && samePal >= cfg.samePal) return false;
      if (isPatterned(g) && patterned >= maxPatterned) return false;
      for (const o of out) if (dist(g, o) < 1.2) return false;
    }
    return true;
  };
  const take = (g) => {
    batchKeys.add(genomeKey(g));
    labels.add(labelKey(g));
    archCount.set(g.archetype, (archCount.get(g.archetype) || 0) + 1);
    if (paletteKey(g) === favPal) samePal++;
    if (isPatterned(g)) patterned++;
    out.push(g);
  };
  const likedArchs = new Set(liked.map((g) => g.archetype));
  const generate = () => {
    const roll = r();
    if (roll < crossP) {
      // Two distinct parents — crossing a genome with itself is a no-op clone.
      const i = Math.floor(r() * liked.length);
      const j = (i + 1 + Math.floor(r() * (liked.length - 1))) % liked.length;
      return crossover(r, liked[i], liked[j]);
    }
    if (roll < crossP + cfg.wildP) return randomGenome(r, pick(r, wildIds));
    if (roll < crossP + cfg.wildP + cfg.cousinP) return cousin(r, pick(r, liked), rejectedArchs, prefs, likedArchs, cfg.carryP);
    return mutate(r, pick(r, liked), cfg.rate);
  };

  let guard = 0;
  while (out.length < n && guard++ < 900) {
    const g = generate();
    if (acceptable(g, true)) take(g);
  }
  // Starvation fallback: same generators, relaxed niceness — but the user's
  // filters and novelty still hold. (No unconditional escape hatch: a thin
  // grid is better than one that breaks an explicit preference.)
  let relaxGuard = 0;
  while (out.length < n && relaxGuard++ < 600) {
    const g = chance(r, 0.5) ? generate() : randomGenome(r, pick(r, wildIds));
    if (acceptable(g, false)) take(g);
  }
  return out;
}
