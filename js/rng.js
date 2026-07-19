// Seeded PRNG + small sampling helpers. Seeding makes any session's styles
// reproducible from its seed (style IDs embed it).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

// Weighted pick: entries is [[value, weight], ...]
export function wpick(r, entries) {
  const total = entries.reduce((s, e) => s + e[1], 0);
  let x = r() * total;
  for (const [v, w] of entries) {
    x -= w;
    if (x <= 0) return v;
  }
  return entries[entries.length - 1][0];
}

export const irange = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const frange = (r, a, b) => a + r() * (b - a);
export const chance = (r, p) => r() < p;

export function shuffle(r, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
