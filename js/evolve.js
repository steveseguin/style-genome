// Interactive-evolution engine.
//   Round 1: farthest-point sampling → 12 provably spread-out styles,
//   optionally constrained by the user's quick filters (mode/energy).
//   Rounds 2+: neighbors of the liked set — same archetype re-parameterized,
//   cousins carrying the liked genes, occasional wildcards — with the
//   mutation radius shrinking every round. Archetypes the user has seen and
//   NOT picked are treated as soft rejections and avoided (the explicit
//   mode/energy filter always outranks rejection-avoidance).

import { ARCHETYPES, ARCHETYPE_IDS, relatedArchetypes } from "./archetypes/index.js";
import { randomGenome, cloneGenome, genomeKey, genomeGenesLabel } from "./genome.js";
import { hexToHsl } from "./color.js";
import { fontClass } from "./fonts.js";
import { pick, chance, shuffle, mulberry32 } from "./rng.js";

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
    displayCls: fontClass(g.fonts.display),
    radiusBucket: g.radius === 0 ? 0 : g.radius <= 8 ? 1 : g.radius <= 16 ? 2 : 3,
    shadow: g.shadow,
    texture: g.texture === "none" ? 0 : 1,
    density: g.density,
    caseStyle: g.case,
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
  d += Math.abs(fa.radiusBucket - fb.radiusBucket) * 0.5;
  if (fa.shadow !== fb.shadow) d += 1;
  if (fa.texture !== fb.texture) d += 0.5;
  if (fa.density !== fb.density) d += 0.5;
  if (fa.caseStyle !== fb.caseStyle) d += 0.5;
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

// A grid must never show two tiles that read identically: same archetype AND
// same trait caption. (The caption includes the accent color word, so honest
// re-rolls of an archetype still pass.)
const labelKey = (g) => `${g.archetype}|${genomeGenesLabel(g)}`;

// ------------------------------------------------- round 1: maximum spread

export function diverseSet(r, n, isTaken, prefs) {
  // Build a large candidate pool, then greedily pick the candidate whose
  // nearest already-chosen neighbor is farthest (maximin / farthest-point).
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

  const accept = (c, maxPerArch) => {
    if (isTaken(genomeKey(c))) return false;
    if ((archCount.get(c.archetype) || 0) >= maxPerArch) return false;
    if (labels.has(labelKey(c))) return false;
    return true;
  };
  const take = (c) => {
    chosen.push(c);
    archCount.set(c.archetype, (archCount.get(c.archetype) || 0) + 1);
    labels.add(labelKey(c));
  };

  for (const c of shuffle(r, pool)) {
    if (accept(c, 1)) { take(c); break; }
  }
  // Pass 1: unique archetypes. Pass 2 (only if the filtered pool is too thin,
  // e.g. "dark + calm"): allow a second roll of an archetype.
  for (const maxPerArch of [1, 2]) {
    while (chosen.length < n) {
      let best = null, bestScore = -1;
      for (const c of pool) {
        if (!accept(c, maxPerArch)) continue;
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

// Re-run the raw gene sampler for a subset of genes, then re-conform.
function mutate(r, base, rate) {
  const g = cloneGenome(base);
  const fresh = randomGenome(r, g.archetype); // conformed random sibling
  const genes = ["p", "fonts", "radius", "ctl", "bw", "shadow", "texture", "density", "case", "hw", "track", "chart"];
  for (const gene of genes) {
    if (chance(r, rate)) g[gene] = cloneGenome(fresh)[gene];
  }
  ARCHETYPES[g.archetype].conform(g, r);
  return g;
}

// Jump to a related archetype but carry the liked genes the new archetype's
// conform() allows to survive. A cousin exists to EXPLORE: it never lands on
// a liked archetype (mutate() covers those), prefers archetypes the user
// hasn't rejected, but will fall back to rejected relatives rather than
// produce nothing (a re-rolled rejected relative beats an empty slot).
function cousin(r, base, rejectedArchs, prefs, likedArchs) {
  const inMode = new Set(modeIds(prefs));
  let rel = relatedArchetypes(base.archetype).filter((id) => inMode.has(id));
  if (!rel.length) rel = relatedArchetypes(base.archetype);
  const exploring = rel.filter((id) => !likedArchs.has(id));
  const fresh = exploring.filter((id) => !rejectedArchs.has(id));
  const pool = fresh.length ? fresh : exploring.length ? exploring : rel;
  const g = randomGenome(r, pick(r, pool));
  const carried = cloneGenome(base);
  g.density = carried.density;
  g.chart = carried.chart;
  ARCHETYPES[g.archetype].conform(g, r);
  return g;
}

function crossover(r, a, b) {
  const g = cloneGenome(chance(r, 0.5) ? a : b);
  const other = g.archetype === a.archetype ? b : a;
  const genes = ["radius", "ctl", "shadow", "texture", "density", "case", "chart"];
  for (const gene of genes) {
    if (chance(r, 0.5)) g[gene] = cloneGenome(other)[gene];
  }
  ARCHETYPES[g.archetype].conform(g, r);
  return g;
}

// round: 2, 3, 4… — later rounds mutate less and wander less.
export function neighborSet(r, liked, n, round, isTaken, prefs, rejectedArchs = new Set()) {
  const cfg = {
    2: { rate: 0.55, cousinP: 0.4, wildP: 0.15 },
    3: { rate: 0.4, cousinP: 0.3, wildP: 0.06 },
    4: { rate: 0.25, cousinP: 0.2, wildP: 0 },
  }[Math.min(round, 4)] || { rate: 0.2, cousinP: 0.15, wildP: 0 };
  const crossP = liked.length >= 2 ? 0.25 : 0;

  const fav = liked[liked.length - 1];
  const out = [];
  const batchKeys = new Set();
  // The favorite is prepended to the grid by the caller — count it here so we
  // never build a near-clone of it or a same-reading caption.
  const labels = new Set([labelKey(fav)]);
  const archCount = new Map([[fav.archetype, 1]]);
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
      for (const o of out) if (dist(g, o) < 1.2) return false;
    }
    return true;
  };
  const take = (g) => {
    batchKeys.add(genomeKey(g));
    labels.add(labelKey(g));
    archCount.set(g.archetype, (archCount.get(g.archetype) || 0) + 1);
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
    if (roll < crossP + cfg.wildP + cfg.cousinP) return cousin(r, pick(r, liked), rejectedArchs, prefs, likedArchs);
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
