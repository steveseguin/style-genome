// Color utilities. Everything is stored as hex; HSL is used for generation.

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function hexToRgb(hex) {
  const s = hex.replace("#", "");
  const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function hexToHsl(hex) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function relLum(hex) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a, b) {
  const la = relLum(a), lb = relLum(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function mix(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  const to = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${to(ca.r, cb.r)}${to(ca.g, cb.g)}${to(ca.b, cb.b)}`;
}

export function alpha(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function isDark(hex) {
  return relLum(hex) < 0.35;
}

// Nudge fg lightness away from bg until the contrast ratio is met.
// Walks BOTH directions — on mid-tone backgrounds only one direction can
// reach the target (e.g. cork tan supports dark ink but never light ink),
// so we take the first direction that satisfies `min`, preferring the one
// suggested by the background, and otherwise the best achievable color.
export function ensureContrast(fg, bg, min = 4.5) {
  if (contrast(fg, bg) >= min) return fg;
  const { h, s, l } = hexToHsl(fg);
  const walk = (dir) => {
    let best = fg, bestC = contrast(fg, bg), li = l;
    for (let i = 0; i < 46; i++) {
      li += dir * 2.2;
      if (li < 0 || li > 100) break;
      const c = hslToHex(h, s, li);
      const cc = contrast(c, bg);
      if (cc > bestC) { bestC = cc; best = c; }
      if (cc >= min) return { hex: c, ok: true, c: cc };
    }
    return { hex: best, ok: false, c: bestC };
  };
  const preferUp = relLum(bg) < 0.4;
  const first = walk(preferUp ? 1 : -1);
  if (first.ok) return first.hex;
  const second = walk(preferUp ? -1 : 1);
  if (second.ok) return second.hex;
  // Neither direction reaches `min`: return the strongest candidate,
  // considering the extremes as a last resort.
  const candidates = [
    [first.c, first.hex], [second.c, second.hex],
    [contrast("#111111", bg), "#111111"], [contrast("#ffffff", bg), "#ffffff"],
  ];
  candidates.sort((a, b) => b[0] - a[0]);
  return candidates[0][1];
}

// White or near-black, whichever reads better on the given color.
export function onColor(bgHex) {
  return contrast("#ffffff", bgHex) >= contrast("#141414", bgHex) ? "#ffffff" : "#141414";
}

const HUE_WORDS = [
  [15, "Crimson"], [40, "Amber"], [65, "Gold"], [95, "Chartreuse"], [150, "Emerald"],
  [185, "Teal"], [215, "Azure"], [250, "Indigo"], [285, "Violet"], [320, "Magenta"],
  [345, "Rose"], [360, "Crimson"],
];

export function colorName(hex) {
  const { h, s, l } = hexToHsl(hex);
  if (s < 10) return l > 60 ? "Silver" : "Graphite";
  for (const [limit, name] of HUE_WORDS) if (h <= limit) return name;
  return "Crimson";
}
