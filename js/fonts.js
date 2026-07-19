// Curated system font stacks (based on the "modern font stacks" approach).
// Using system stacks — not webfonts — keeps everything offline, instant, and
// makes canvas/SVG export render with the exact same faces the user saw.
// `cls` buckets fonts for the style-distance metric; `label` feeds the prompt.

export const FONTS = {
  grotesk: {
    label: "Neo-grotesque sans (Helvetica/Arial family)",
    stack: `Inter, Roboto, "Helvetica Neue", "Arial Nova", Helvetica, Arial, sans-serif`,
    cls: "sans",
  },
  humanist: {
    label: "Humanist sans (Segoe/Seravek family)",
    stack: `Seravek, "Gill Sans Nova", Ubuntu, Calibri, "Segoe UI", "DejaVu Sans", sans-serif`,
    cls: "sans",
  },
  geometric: {
    label: "Geometric sans (Futura/Century Gothic family)",
    stack: `Avenir, Montserrat, Corbel, "URW Gothic", "Century Gothic", "Futura", sans-serif`,
    cls: "sans",
  },
  industrial: {
    label: "Industrial condensed sans (DIN/Bahnschrift family)",
    stack: `Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", "Arial Narrow", sans-serif`,
    cls: "sans",
  },
  rounded: {
    label: "Rounded friendly sans",
    stack: `ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, "Arial Rounded MT Bold", Manjari, Calibri, sans-serif`,
    cls: "sans",
  },
  black: {
    label: "Ultra-heavy display sans (Arial Black/Impact family)",
    stack: `"Archivo Black", "Arial Black", "Haettenschweiler", Impact, sans-serif`,
    cls: "display",
  },
  transitional: {
    label: "Transitional serif (Georgia/Charter family)",
    stack: `Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif`,
    cls: "serif",
  },
  oldstyle: {
    label: "Old-style serif (Palatino/Garamond family)",
    stack: `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", "URW Palladio L", Georgia, serif`,
    cls: "serif",
  },
  didone: {
    label: "High-contrast didone serif (Didot/Bodoni family)",
    stack: `Didot, "Bodoni MT", "Bodoni 72", "Playfair Display", "URW Palladio L", serif`,
    cls: "serif",
  },
  slab: {
    label: "Slab serif (Rockwell family)",
    stack: `Rockwell, "Rockwell Nova", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif`,
    cls: "serif",
  },
  typewriter: {
    label: "Typewriter (American Typewriter/Courier family)",
    stack: `"American Typewriter", "Courier Prime", "Courier New", Courier, monospace`,
    cls: "mono",
  },
  mono: {
    label: "Code monospace (Cascadia/Consolas family)",
    stack: `ui-monospace, "Cascadia Code", "Source Code Pro", Consolas, "SF Mono", Menlo, monospace`,
    cls: "mono",
  },
  script: {
    label: "Handwritten casual",
    stack: `"Segoe Print", "Bradley Hand", "Comic Sans MS", "Comic Neue", cursive`,
    cls: "script",
  },
};

export const FONT_KEYS = Object.keys(FONTS);

export function fontStack(key) {
  return (FONTS[key] || FONTS.grotesk).stack;
}

export function fontLabel(key) {
  return (FONTS[key] || FONTS.grotesk).label;
}

export function fontClass(key) {
  return (FONTS[key] || FONTS.grotesk).cls;
}
