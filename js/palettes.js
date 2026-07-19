// Palette generation. A palette is a set of role colors:
//   { bg, surface, surface2, ink, muted, accent, accent2, border, dark }
// Strategies generate candidates from a hue; `pal()` lets archetypes hand-craft
// palettes and fills in the derived roles with sane, contrast-checked values.

import { hslToHex, hexToHsl, mix, ensureContrast, relLum, isDark } from "./color.js";
import { irange, frange, chance, pick } from "./rng.js";

// Fill in derived roles from whatever an archetype (or strategy) specifies.
export function pal(spec) {
  const p = { ...spec };
  p.dark = p.dark !== undefined ? p.dark : isDark(p.bg);
  if (!p.surface) p.surface = p.dark ? mix(p.bg, "#ffffff", 0.055) : mix(p.bg, "#ffffff", 0.55);
  if (!p.surface2) p.surface2 = p.dark ? mix(p.bg, "#ffffff", 0.11) : mix(p.bg, p.ink, 0.045);
  if (!p.border) p.border = p.dark ? mix(p.bg, p.ink, 0.24) : mix(p.bg, p.ink, 0.22);
  if (!p.muted) p.muted = mix(p.ink, p.bg, 0.38);
  if (!p.accent2) p.accent2 = mix(p.accent, p.ink, 0.3);
  // Contrast floors: body ink ≥ 7, muted ≥ 3.6 against bg.
  p.ink = ensureContrast(p.ink, p.bg, 7);
  p.muted = ensureContrast(p.muted, p.bg, 3.6);
  return p;
}

export const STRATEGIES = ["paper", "mono", "duo", "analogous", "earth", "pastel", "neon", "slate"];

export function basePalette(r, strategy, hue, dark) {
  const h = ((hue % 360) + 360) % 360;
  switch (strategy) {
    case "paper": {
      const warm = irange(r, 38, 52);
      return pal({
        bg: hslToHex(warm, irange(r, 18, 34), irange(r, 94, 97)),
        ink: hslToHex(warm, 14, 12),
        accent: hslToHex(h, irange(r, 62, 82), irange(r, 38, 50)),
        accent2: hslToHex(h + 150, 45, 40),
        dark: false,
      });
    }
    case "mono": {
      if (dark) {
        return pal({
          bg: hslToHex(h, irange(r, 12, 26), irange(r, 8, 13)),
          ink: hslToHex(h, 12, 92),
          accent: hslToHex(h, irange(r, 55, 80), irange(r, 58, 70)),
          accent2: hslToHex(h, 30, 45),
          dark: true,
        });
      }
      return pal({
        bg: hslToHex(h, irange(r, 14, 30), irange(r, 95, 98)),
        ink: hslToHex(h, 22, 13),
        accent: hslToHex(h, irange(r, 55, 78), irange(r, 34, 46)),
        accent2: hslToHex(h, 30, 60),
        dark: false,
      });
    }
    case "duo": {
      const h2 = h + irange(r, 160, 200);
      const isD = dark;
      return pal({
        bg: isD ? hslToHex(h, 18, 10) : hslToHex(h, 12, 96),
        ink: isD ? hslToHex(h, 10, 92) : hslToHex(h, 20, 12),
        accent: hslToHex(h, irange(r, 62, 85), isD ? irange(r, 58, 68) : irange(r, 40, 50)),
        accent2: hslToHex(h2, irange(r, 55, 80), isD ? irange(r, 55, 68) : irange(r, 42, 55)),
        dark: isD,
      });
    }
    case "analogous": {
      const h2 = h + irange(r, 28, 48);
      return pal({
        bg: dark ? hslToHex(h, 20, 9) : hslToHex(h + 15, 25, 96),
        ink: dark ? hslToHex(h, 12, 93) : hslToHex(h, 25, 13),
        accent: hslToHex(h, irange(r, 60, 82), dark ? 62 : 44),
        accent2: hslToHex(h2, irange(r, 55, 75), dark ? 60 : 48),
        dark,
      });
    }
    case "earth": {
      const eh = pick(r, [22, 30, 38, 55, 75, 95]);
      if (dark) {
        return pal({
          bg: hslToHex(eh, 22, 11),
          ink: hslToHex(eh, 22, 88),
          accent: hslToHex(eh + irange(r, -8, 8), irange(r, 40, 58), irange(r, 52, 62)),
          accent2: hslToHex(eh + 130, 25, 45),
          dark: true,
        });
      }
      return pal({
        bg: hslToHex(eh, irange(r, 22, 35), irange(r, 92, 95)),
        ink: hslToHex(eh, 28, 14),
        accent: hslToHex(eh + irange(r, -10, 10), irange(r, 42, 60), irange(r, 34, 44)),
        accent2: hslToHex(eh + 140, irange(r, 22, 38), 38,),
        dark: false,
      });
    }
    case "pastel": {
      return pal({
        bg: hslToHex(h + irange(r, 20, 60), irange(r, 45, 70), irange(r, 95, 97)),
        ink: hslToHex(h, 30, 16),
        accent: hslToHex(h, irange(r, 55, 75), irange(r, 66, 76)),
        accent2: hslToHex(h + irange(r, 90, 150), irange(r, 50, 70), irange(r, 68, 78)),
        dark: false,
      });
    }
    case "neon": {
      return pal({
        bg: hslToHex(h + irange(r, -20, 20), irange(r, 25, 45), irange(r, 5, 9)),
        ink: hslToHex(h, 15, 93),
        accent: hslToHex(h, irange(r, 88, 100), irange(r, 55, 65)),
        accent2: hslToHex(h + irange(r, 120, 200), irange(r, 85, 100), irange(r, 55, 68)),
        dark: true,
      });
    }
    case "slate":
    default: {
      const cool = irange(r, 205, 235);
      if (dark) {
        return pal({
          bg: hslToHex(cool, irange(r, 15, 25), irange(r, 10, 14)),
          ink: hslToHex(cool, 12, 92),
          accent: hslToHex(h, irange(r, 60, 85), irange(r, 55, 66)),
          accent2: hslToHex(h + 40, 45, 55),
          dark: true,
        });
      }
      return pal({
        bg: hslToHex(cool, irange(r, 12, 22), irange(r, 96, 98)),
        ink: hslToHex(cool, 25, 13),
        accent: hslToHex(h, irange(r, 60, 85), irange(r, 40, 50)),
        accent2: hslToHex(h + 40, 45, 45),
        dark: false,
      });
    }
  }
}
