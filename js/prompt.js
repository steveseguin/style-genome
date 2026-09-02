// Generates the LLM prompt from the genome. Because the prompt and the CSS
// both derive from the same genome, the prompt always describes exactly what
// the user is looking at.

import { ARCHETYPES } from "./archetypes/index.js";
import { fontLabel, fontStack } from "./fonts.js";
import { colorName } from "./color.js";
import { shadowValues, chartSpec } from "./render.js";
import { genomeKey } from "./genome.js";
import { specimenDefinition } from "./specimens.js";

const CHART_DESC = {
  "bars": "vertical bars with consistent slots and widths, with the maximum value clearly emphasized",
  "bars-outline": "vertical bars with consistent slots and widths",
  "bars-hatch": "vertical bars with consistent slots and widths",
  "line": "a single connected polyline with small point markers",
  "area": "a connected line over an area extending to the baseline",
  "dots": "stacked dot columns (a dot-matrix bar chart)",
};

const CHART_TREATMENT_DESC = {
  solid: "flat solid color marks",
  outline: "unfilled marks outlined in the ink color",
  hatch: "single-angle parallel engraved lines in neutral ink",
  crosshatch: "two intersecting hatch directions in neutral ink; vary density to communicate tone",
  stipple: "ink-dot stippling with denser dots for darker values",
  halftone: "regular halftone/Ben-Day dots whose apparent density carries tone",
  engraved: "fine multi-weight engraved linework, with close parallel contour strokes rather than flat fills",
  rough: "irregular carved/gouged marks with visibly imperfect edges",
  overprint: "two translucent spot inks printed slightly out of register so overlaps create a third color",
};

const CHART_GRID_DESC = {
  full: "Use restrained horizontal gridlines and a baseline in the neutral border color.",
  baseline: "Use only a baseline; omit internal gridlines.",
  none: "Omit axes, baseline, and gridlines entirely; show only the data marks.",
};

const TEXTURE_DESC = {
  none: "None — surfaces are perfectly clean.",
  grain: "Fine photographic grain/noise over the whole page (subtle, multiply-blended).",
  dots: "A small polka-dot pattern over the background at low opacity.",
  lines: "Thin horizontal scanlines across the entire page.",
  paper: "A paper-fiber noise texture, like recycled stock.",
  grid: "A fine drafting grid (≈26px cells) behind the content.",
  crosshatch: "A subtle field of intersecting diagonal ink lines, like lightly cross-hatched print shading.",
  stipple: "Fine irregular-looking ink stipple dots over the substrate, sparse enough to preserve readability.",
  halftone: "A regular small-dot printing screen over the substrate, visibly mechanical rather than a decorative polka dot.",
  fibers: "Toothy fibrous stock with faint directional strands and natural paper noise.",
  engraved: "Very fine intersecting engraved lines at unequal angles, low contrast on the substrate.",
};

const SHADOW_DESC = {
  none: "The base depth token has no generic drop shadow. Keep surfaces flat except for any process-specific impression, registration, inset, or craft shadow explicitly required below.",
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

export function buildPrompt(g, specimenId = "brand") {
  const a = ARCHETYPES[g.archetype];
  const p = g.p;
  const sh = shadowValues(g);
  const chart = chartSpec(g);
  const radiusCtl = g.ctl === 999 ? "fully pill-shaped (999px)" : `${g.ctl}px`;
  const standardPaletteRoles = new Set(["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border", "dark"]);
  const customColors = Object.entries(p).filter(([key]) => !standardPaletteRoles.has(key));
  const craftCss = a.css(".style-scope", g).trim();
  const specimen = specimenDefinition(specimenId);

  const genomeJson = JSON.stringify(g, null, 2);

  return `# Visual style spec — "${a.name}" (id: ${g.archetype}-${genomeKey(g)})

You are implementing a SPECIFIC, deliberately chosen visual style for a website/app.
Follow this spec exactly. Do NOT fall back to generic defaults (no default Tailwind
look, no indigo-gradient SaaS cards, no substituting fonts or colors you prefer).
Where this spec is silent, extrapolate from its character — never from convention.
If a reference PNG accompanies this prompt, treat it as the ground-truth rendering
of this spec.

Precedence when instructions appear to conflict:
1. Reference PNG (if supplied)
2. Canonical archetype craft CSS and component notes below
3. Exact palette/type/shape genes
4. Generic implementation guidance

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
${customColors.length ? customColors.map(([key, value]) => `- Custom ${key} color: ${value}`).join("\n") : ""}

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
- Heading scale follows the canonical craft CSS below. Where it does not override
  size, begin around 44–56px for a desktop display heading with tight leading and
  scale responsively; section titles normally begin around 15–18px.

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

## Canonical archetype craft CSS

This is the exact bespoke CSS recipe used by the reference renderer. Treat its
values, motifs, pseudo-elements, nth-child variations, and process effects as
authoritative. Map \`.style-scope\` and the semantic class roles to the target
project rather than copying the sample's information architecture verbatim.

\`\`\`css
${craftCss}
\`\`\`

## Site structure and component fidelity

- Selected structure: **${specimen.label}** (id: \`${specimen.id}\`).
  Structure contract: ${specimen.contract}
- This is a VISUAL LANGUAGE, not a command to copy the Nordwind sample page or
  force every project into a hero-plus-cards landing page. Preserve the target
  product's real information architecture and apply this style to it.
- Carry the style through every component the product actually uses: navigation,
  links and visited/current states, buttons and hover/focus/pressed/disabled
  states, form fields and validation, cards/panels, lists/tables, alerts/status,
  media/figures, charts, overlays, empty/loading states, and the footer.
- Responsive layouts must reflow at narrow widths; do not shrink a desktop
  canvas. Preserve hierarchy, touch targets, readable type, and visible focus.
  Navigation must remain available on mobile through a compact menu, drawer, or
  equivalent; never simply hide it without a replacement.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text and
  control boundaries. Reflow or clamp display type before it clips or overflows.
- Bespoke motifs must remain subordinate to content and must not replace semantic
  controls, labels, headings, or accessible state indicators.

## Charts & data viz

Geometry: ${CHART_DESC[chart.mark] || CHART_DESC[g.chart] || "a restrained data display consistent with this style"}.
Mark treatment: ${CHART_TREATMENT_DESC[chart.treatment] || chart.treatment}.
${CHART_GRID_DESC[chart.grid] || CHART_GRID_DESC.full}
Sparklines are thin accent-colored lines with no axes.

For print treatments, patterns must encode actual process: crosshatch uses two
angles, stipple uses dot density, engraving uses fine contour strokes, rough
relief uses carved marks, and overprint uses translucent misregistered inks.
Do not substitute a generic diagonal CSS stripe for all of these techniques.
For a named physical print process, place at least one unmistakable signature
mark above the fold and repeat its logic in a chart or functional component.
Do not borrow a neighboring process's shortcut: relief printing needs carved
negative space/chatter, lithography needs greasy crayon or tusche grain,
Mokuhanga needs washi/bokashi or registration-edge evidence, and intaglio needs
line-density or tonal-plate evidence rather than generic vintage decoration.

## Fidelity checklist before delivery

- Exact palette roles and font stacks above are used; no framework-default indigo.
- The named archetype is recognizable without relying on its label.
- Every visible component follows the same border, radius, depth, texture, type,
  and interaction-state logic.
- Print/data patterns match the specified physical process and remain legible.
- Desktop and mobile layouts are both intentionally composed.
- Every required motif in the component-treatment notes is plainly perceptible
  at normal 1x viewing. The result fails if hiding the archetype name makes it
  read as a generic SaaS, generic editorial, or default component-library skin.

## Machine-readable genome

The JSON below is the canonical encoding of this style. Keep it with the project;
any tool that understands it can regenerate the exact same style.

\`\`\`json
${genomeJson}
\`\`\`
`;
}
