// Generates the LLM prompt from the genome. Because the prompt and the CSS
// both derive from the same genome, the prompt always describes exactly what
// the user is looking at.

import { ARCHETYPES } from "./archetypes/index.js";
import { fontLabel, fontStack } from "./fonts.js";
import { colorName } from "./color.js";
import { shadowValues } from "./render.js";
import { genomeKey } from "./genome.js";

const CHART_DESC = {
  "bars": "flat filled bars in the secondary accent, with the maximum bar emphasized in the primary accent; axis and gridlines are hairlines in the border color",
  "bars-outline": "outlined bars (no fill), stroked in the ink color — drafting style",
  "bars-hatch": "bars filled with a 45° hatch pattern in the accent, outlined in ink — print style",
  "line": "a single accent-colored polyline with small round point markers, hairline gridlines",
  "area": "a smooth accent line over a translucent accent area fill (~20% opacity)",
  "dots": "stacked dot columns (a dot-matrix bar chart), top dot in the primary accent",
};

const TEXTURE_DESC = {
  none: "None — surfaces are perfectly clean.",
  grain: "Fine photographic grain/noise over the whole page (subtle, multiply-blended).",
  dots: "A small polka-dot pattern over the background at low opacity.",
  lines: "Thin horizontal scanlines across the entire page.",
  paper: "A paper-fiber noise texture, like recycled stock.",
  grid: "A fine drafting grid (≈26px cells) behind the content.",
};

const SHADOW_DESC = {
  none: "No shadows anywhere — the style is perfectly flat.",
  soft: "Large, soft, diffuse drop shadows (blurry, low opacity).",
  lifted: "Small crisp lift shadows (1–3px offset, tight blur) — barely-there depth.",
  hard: "Hard offset shadows in the ink color with ZERO blur (e.g. 5px 5px 0) — graphic, sticker-like.",
  emboss: "Dual neumorphic shadows: light from top-left, dark toward bottom-right; elements look extruded from the background.",
  glow: "Accent-colored glows instead of gray shadows (neon light emission).",
};

const DENSITY_DESC = {
  airy: "Very generous — whitespace is a primary design material. Wide margins, tall gaps.",
  normal: "Comfortable, evenly measured spacing.",
  dense: "Compact and information-dense; small gaps, efficient use of space.",
};

function caseDesc(c) {
  return c === "upper" ? "UPPERCASE" : c === "lower" ? "lowercase" : "normal (sentence) case";
}

export function buildPrompt(g) {
  const a = ARCHETYPES[g.archetype];
  const p = g.p;
  const sh = shadowValues(g);
  const radiusCtl = g.ctl === 999 ? "fully pill-shaped (999px)" : `${g.ctl}px`;

  const genomeJson = JSON.stringify(g, null, 2);

  return `# Visual style spec — "${a.name}" (id: ${g.archetype}-${genomeKey(g)})

You are implementing a SPECIFIC, deliberately chosen visual style for a website/app.
Follow this spec exactly. Do NOT fall back to generic defaults (no default Tailwind
look, no indigo-gradient SaaS cards, no substituting fonts or colors you prefer).
Where this spec is silent, extrapolate from its character — never from convention.
If a reference PNG accompanies this prompt, treat it as the ground-truth rendering
of this spec.

## Character

${a.blurb}

Mode: ${p.dark ? "DARK — the page background is dark" : "LIGHT — the page background is light"}. Dominant accent family: ${colorName(p.accent)}.

## Color palette (exact hex — use these, do not restyle them)

- Page background: ${p.bg}
- Panel/card surface: ${p.surface}
- Secondary surface: ${p.surface2}
- Ink (primary text): ${p.ink}
- Muted text: ${p.muted}
- Primary accent: ${p.accent}
- Secondary accent: ${p.accent2}
- Border/rule color: ${p.border}

Usage rules:
- Accents go into FILLS, text emphasis, data, and glows — never into decorative
  edge borders or stripes on panels. All borders/rules use the border color above
  (or the ink color where this spec says so). Never add an accent-colored
  left/top border stripe to a card — that pattern is explicitly banned.
- Text on the primary accent must use a contrast-checked counter-color
  (white or near-black, whichever reads better).

## Typography

- Display/headings: ${fontLabel(g.fonts.display)}
  font-family: ${fontStack(g.fonts.display)}
- Body: ${fontLabel(g.fonts.body)}
  font-family: ${fontStack(g.fonts.body)}
- Mono/labels: font-family: ${fontStack(g.fonts.mono)}
- Heading weight: ${g.hw}. Heading letter-spacing: ${g.track}em. Heading case: ${caseDesc(g.case)}.
- Hero display size ≈ 44–56px with tight leading (~1.05); section titles ≈ 15–18px.

## Shape & depth

- Panel corner radius: ${g.radius}px. Control (button/chip) radius: ${radiusCtl}.
- Border width: ${g.bw}px${g.bw === 0 ? " (borderless — depth comes from shadows alone)" : ""}.
- Shadows: ${SHADOW_DESC[g.shadow]}
  Exact card shadow: \`${sh.card}\`
  Exact button shadow: \`${sh.btn}\`

## Texture

${TEXTURE_DESC[g.texture]}

## Spacing & density

${DENSITY_DESC[g.density]} Base spacing unit ≈ ${g.density === "airy" ? 12 : g.density === "dense" ? 7 : 9}px; pad cards ~2× the unit, gap sections ~2.5×.

## Component treatments (the craft — follow closely)

${a.notes.map((n) => `- ${n}`).join("\n")}

## Charts & data viz

Render charts as: ${CHART_DESC[g.chart]}.
Sparklines are thin accent-colored lines with no axes.

## Machine-readable genome

The JSON below is the canonical encoding of this style. Keep it with the project;
any tool that understands it can regenerate the exact same style.

\`\`\`json
${genomeJson}
\`\`\`
`;
}
