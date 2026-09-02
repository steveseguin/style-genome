// Generates the LLM prompt from the genome. Because the prompt and the CSS
// both derive from the same genome, the prompt always describes exactly what
// the user is looking at.
//
// The document is ordered for progressive fidelity: a small or hurried model
// that only reads the first three sections (summary, rules, tokens) still
// lands on the right style; a capable model keeps reading and gets the exact
// craft CSS, class contract, structure contract, and the machine genome.

import { ARCHETYPES } from "./archetypes/index.js";
import { fontLabel, fontStack } from "./fonts.js";
import { colorName, describeColor, onColor, contrast } from "./color.js";
import { shadowValues, chartSpec, chartSvg } from "./render.js";
import { motifsCss, motifNotes } from "./motifs.js";
import { genomeKey } from "./genome.js";
import { specimenDefinition } from "./specimens.js";
import { tokensRootCss, starterCss, glossaryFor, spacingUnit, customPaletteRoles } from "./starter.js";

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

const SHADOW_SHORT = {
  none: "no drop shadows",
  soft: "large soft blurry shadows",
  lifted: "small crisp lift shadows",
  hard: "hard offset shadows with zero blur",
  emboss: "paired light/dark neumorphic shadows",
  glow: "accent-colored glows",
};

const DENSITY_DESC = {
  airy: "Very generous — whitespace is a primary design material. Wide margins, tall gaps.",
  normal: "Comfortable, evenly measured spacing.",
  dense: "Compact and information-dense; small gaps, efficient use of space.",
};

const DENSITY_SHORT = { airy: "airy and generous", normal: "comfortable", dense: "compact and dense" };

function caseDesc(c) {
  return c === "upper" ? "UPPERCASE" : c === "lower" ? "lowercase" : "normal (sentence) case";
}

function radiusWord(px) {
  if (px === 0) return "square";
  if (px <= 4) return "barely rounded";
  if (px <= 10) return "softly rounded";
  if (px <= 16) return "rounded";
  return "very round";
}

function controlWord(ctl) {
  if (ctl === 999) return "fully pill-shaped";
  if (ctl === 0) return "square (0px)";
  return `${radiusWord(ctl)} (${ctl}px)`;
}

function trackWord(track) {
  if (track <= -0.02) return "tight";
  if (track < 0) return "snug";
  if (track === 0) return "normal";
  if (track <= 0.03) return "slightly open";
  if (track <= 0.08) return "wide";
  return "very wide";
}

function fontShort(key) {
  return fontLabel(key).replace(/\s*\(.*\)$/, "");
}

const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1);

// ------------------------------------------------------------- sections

function summaryParagraph(g, a) {
  const p = g.p;
  const chart = chartSpec(g);
  const borderPhrase = g.bw === 0
    ? "Panels have no visible border; edges come from surface color and shadow."
    : `Every panel and button border is ${g.bw}px solid ${p.border}.`;
  const texture = g.texture === "none" ? "Backgrounds are clean with no texture." : `The whole page carries a ${g.texture} texture overlay.`;
  return [
    `"${a.name}" is a ${p.dark ? "DARK" : "LIGHT"} style (family: ${a.family}).`,
    `The page background is ${describeColor(p.bg)} (${p.bg}) and body text is ${describeColor(p.ink)} (${p.ink}).`,
    `The main accent is ${describeColor(p.accent)} (${p.accent}) and the second accent is ${describeColor(p.accent2)} (${p.accent2}).`,
    `Headings use ${fontShort(g.fonts.display)} type at weight ${g.hw}, ${caseDesc(g.case)}, with ${trackWord(g.track)} letter-spacing; body text uses ${fontShort(g.fonts.body)}.`,
    `Panel corners are ${radiusWord(g.radius)} (${g.radius}px) and buttons/chips are ${controlWord(g.ctl)}.`,
    borderPhrase,
    `Depth: ${SHADOW_SHORT[g.shadow]}.`,
    texture,
    `Spacing is ${DENSITY_SHORT[g.density]}.`,
    `Charts are ${CHART_DESC[chart.mark] || CHART_DESC[g.chart]} drawn as ${CHART_TREATMENT_DESC[chart.treatment] || chart.treatment}.`,
  ].join(" ");
}

function glanceTable(g, a) {
  const p = g.p;
  const chart = chartSpec(g);
  const rows = [
    ["Archetype", `${a.name} (family: ${a.family})`],
    ["Mode", p.dark ? "Dark" : "Light"],
    ["Background / text", `${p.bg} (${describeColor(p.bg)}) / ${p.ink} (${describeColor(p.ink)})`],
    ["Accent / second accent", `${p.accent} (${describeColor(p.accent)}) / ${p.accent2} (${describeColor(p.accent2)})`],
    ["Text on accent", onColor(p.accent)],
    ["Heading font", `${fontShort(g.fonts.display)}, weight ${g.hw}, ${caseDesc(g.case)}, letter-spacing ${g.track}em`],
    ["Body font", fontShort(g.fonts.body)],
    ["Mono font", fontShort(g.fonts.mono)],
    ["Panel corners", `${g.radius}px (${radiusWord(g.radius)})`],
    ["Control corners", controlWord(g.ctl)],
    ["Borders", g.bw === 0 ? "none (0px)" : `${g.bw}px solid ${p.border}`],
    ["Shadows", SHADOW_SHORT[g.shadow]],
    ["Texture", g.texture],
    ["Spacing", `${g.density} (base unit ${spacingUnit(g)}px)`],
    ["Charts", `${chart.mark}, ${chart.treatment} marks, ${chart.grid} grid`],
  ];
  return `| Property | Value |\n|---|---|\n${rows.map(([k, v]) => `| ${k} | ${v} |`).join("\n")}`;
}

function alwaysRules(g) {
  const p = g.p;
  const sh = shadowValues(g);
  const chart = chartSpec(g);
  const rules = [
    `Set the page background to ${p.bg}, body text to ${p.ink}, and card/panel surfaces to ${p.surface}.`,
    `Set every heading in ${fontShort(g.fonts.display)} at font-weight ${g.hw}, letter-spacing ${g.track}em, ${caseDesc(g.case)}.`,
    `Set body text in ${fontShort(g.fonts.body)} and code/data labels in ${fontShort(g.fonts.mono)}, using the exact font-family stacks in the tokens.`,
    `Use ${p.accent} for primary buttons, links, and active/selected states, with ${onColor(p.accent)} text on it. Use ${p.accent2} for second data series, status dots, and alternate tags.`,
    `Use ${p.muted} for secondary text and ${p.border} for every border, rule, and divider.`,
    `Give panels ${g.radius}px corners and give buttons, chips, and inputs ${controlWord(g.ctl)} corners.`,
    g.bw === 0
      ? "Draw no visible borders on panels or buttons; separate surfaces with background color and shadow."
      : `Draw panel and button borders ${g.bw}px solid ${p.border}.`,
    `Shadows: ${SHADOW_SHORT[g.shadow]}. Card shadow is exactly \`${sh.card}\`; primary button shadow is exactly \`${sh.btn}\`.`,
  ];
  if (g.texture !== "none") rules.push(`Texture: ${TEXTURE_DESC[g.texture]}`);
  rules.push(`Spacing: ${DENSITY_DESC[g.density]} Base unit ${spacingUnit(g)}px; pad cards about 2× the unit and gap sections about 2.5×.`);
  rules.push(`Charts: ${CHART_DESC[chart.mark] || CHART_DESC[g.chart]}; marks are ${CHART_TREATMENT_DESC[chart.treatment] || chart.treatment}. ${CHART_GRID_DESC[chart.grid] || CHART_GRID_DESC.full}`);
  rules.push("Keep every interactive element accessible: visible focus ring, 4.5:1 text contrast, real buttons and labels, navigation that survives narrow screens.");
  return rules;
}

function neverRules(g, craftCss) {
  const p = g.p;
  const rules = [
    "Do not use any color outside the palette (transparent tints of palette colors and the on-accent text color are fine).",
    "Do not use framework defaults: no Tailwind indigo/blue, no Bootstrap blue, no generic gray-100 cards, no default component-library look.",
    "Do not add an accent-colored left/top border stripe to cards, alerts, or panels. Borders use the border color (or ink where the craft CSS says so).",
    "Do not substitute fonts. Use the exact font-family stacks given; the first family listed is the preferred face.",
  ];
  switch (g.shadow) {
    case "none": rules.push("Do not add drop shadows or glows to any element, except effects the craft CSS explicitly defines."); break;
    case "hard": rules.push("Do not use blurred shadows; every shadow is a hard offset with 0 blur in the ink color."); break;
    case "soft": rules.push("Do not use hard-edged or zero-blur shadows; shadows are large, soft, and low opacity."); break;
    case "lifted": rules.push("Do not use large dramatic shadows; keep every shadow small and crisp."); break;
    case "glow": rules.push("Do not use gray drop shadows; depth is expressed with accent-colored glows."); break;
    case "emboss": rules.push("Do not use single-direction drop shadows; use the paired light/dark neumorphic shadows."); break;
  }
  if (g.texture === "none") rules.push("Do not add noise, grain, paper, or pattern textures to backgrounds.");
  if (g.radius === 0) rules.push("Do not round panel or card corners: they are square (0px).");
  else if (g.radius >= 16) rules.push(`Do not use square or barely-rounded panels: panel corners are clearly round (${g.radius}px).`);
  if (g.ctl === 0) rules.push("Do not round buttons, chips, or inputs: control corners are square (0px).");
  else if (g.ctl === 999) rules.push("Do not give buttons or chips square or slightly-rounded corners: they are fully pill-shaped.");
  if (g.bw === 0) rules.push("Do not draw visible borders on cards or buttons.");
  else rules.push(`Do not vary border thickness: panels and buttons use ${g.bw}px; 1px hairlines are only for inner dividers such as table rows.`);
  if (g.case === "upper") rules.push("Do not set headings in sentence case or lowercase: headings are UPPERCASE.");
  if (g.case === "lower") rules.push("Do not capitalize headings: headings are lowercase.");
  if (g.case === "none") rules.push("Do not force headings to uppercase (small labels and kickers may still be uppercase).");
  if (!/gradient/i.test(craftCss)) rules.push("Do not use gradients anywhere; fills are flat.");
  if (g.density === "airy") rules.push("Do not crowd elements; whitespace is part of the design.");
  if (g.density === "dense") rules.push("Do not pad generously; this style is compact and information-dense.");
  rules.push(p.dark
    ? "Do not use white or light surfaces; every surface stays within the dark palette."
    : "Do not use dark surfaces or dark sections unless the craft CSS explicitly inverts an element.");
  rules.push("Do not hide navigation on mobile without a replacement (menu button or drawer).");
  return rules;
}

function paletteTable(g) {
  const p = g.p;
  const rows = [
    ["Page background", p.bg, "body background, page canvas"],
    ["Panel / card surface", p.surface, "cards, panels, header, inputs"],
    ["Secondary surface", p.surface2, "code blocks, table stripes, hover fills, media placeholders"],
    ["Ink (primary text)", p.ink, "headings, body text, strong labels"],
    ["Muted text", p.muted, "captions, metadata, placeholders, inactive nav"],
    ["Primary accent", p.accent, "primary buttons, links, active/selected states, key data, focus ring"],
    ["Secondary accent", p.accent2, "second data series, success/status dots, alternate tags"],
    ["Border / rule", p.border, "every border, divider, table rule, chart baseline"],
    ["Text on accent", onColor(p.accent), "text placed on the primary accent"],
    ...customPaletteRoles(g).map(([key, value]) => [`Custom ${key} color`, value, "archetype decor role used by the craft CSS"]),
  ];
  return `| Role | Hex | Plain description | Use it for |\n|---|---|---|---|\n${rows
    .map(([role, hex, use]) => `| ${role} | ${hex} | ${describeColor(hex)} | ${use} |`)
    .join("\n")}`;
}

function contrastNotes(g) {
  const p = g.p;
  return [
    `ink on background ${fmt(contrast(p.ink, p.bg))}:1`,
    `muted on background ${fmt(contrast(p.muted, p.bg))}:1`,
    `on-accent text on accent ${fmt(contrast(onColor(p.accent), p.accent))}:1`,
  ].join("; ");
}

function glossaryTable(craftCss) {
  return `| Class in the CSS | What it means in your project |\n|---|---|\n${glossaryFor(craftCss)
    .map(([cls, meaning]) => `| \`${cls}\` | ${meaning} |`)
    .join("\n")}`;
}

// ------------------------------------------------------------- builder

export function buildPrompt(g, specimenId = "brand", options = {}) {
  const compact = options.mode === "compact";
  const a = ARCHETYPES[g.archetype];
  const p = g.p;
  const sh = shadowValues(g);
  const chart = chartSpec(g);
  const archetypeCss = a.css(".style-scope", g).trim();
  const motifCss = motifsCss(g, ".style-scope").trim();
  const craftCss = motifCss ? `${archetypeCss}\n\n/* ---- Component motifs (free slots) ---- */\n${motifCss}` : archetypeCss;
  const notes = [...a.notes, ...motifNotes(g)];
  const specimen = specimenDefinition(specimenId);
  const id = `${g.archetype}-${genomeKey(g)}`;
  const customColors = customPaletteRoles(g);

  const parts = [];
  let sec = 0;
  const H = (title) => `## ${++sec}. ${title}`;

  parts.push(`# Visual style spec — "${a.name}" (id: ${id})

Build the website/app in THIS exact visual style. Every section below is
generated from one style genome, so the sections never contradict each other.
Read sections 1–3 first; they are enough to land on the right style. Sections
4 onward add exact CSS, component craft, and structure so a capable
implementation can be precise.

Precedence when instructions appear to conflict:
1. Reference PNG (if one accompanies this prompt) — it is the ground-truth rendering
2. Section 2 rules${compact ? "" : " and the archetype craft CSS (section 8)"}
3. Exact tokens, palette, type, and shape values
4. Generic guidance

Do NOT fall back to generic defaults: no default Tailwind look, no
indigo-gradient SaaS cards, no substituting fonts or colors you prefer. Where
this spec is silent, extrapolate from its character — never from convention.`);

  parts.push(`${H("At a glance")}

${summaryParagraph(g, a)}

${glanceTable(g, a)}`);

  parts.push(`${H("Rules")}

### Signature details — the design is not recognizable without these

${notes.map((n) => `- ${n}`).join("\n")}

### Always

${alwaysRules(g).map((r) => `- ${r}`).join("\n")}

### Never

${neverRules(g, craftCss).map((r) => `- ${r}`).join("\n")}`);

  parts.push(`${H("Design tokens — paste this CSS first")}

Every value below is exact. Map them to your framework's theme if you are not
writing plain CSS (Tailwind config, CSS-in-JS theme, design-token JSON).

\`\`\`css
${tokensRootCss(g)}
\`\`\``);

  if (!compact) {
    parts.push(`${H("Starter component CSS")}

A structure-agnostic baseline that already obeys the tokens. It uses the same
class names as the archetype craft CSS in section 8, so the two can be pasted
together: tokens → starter → craft. Add \`class="style-scope"\` to \`<body>\`.
Extend it to every component the product needs; do not replace it with a
framework's defaults.

\`\`\`css
${starterCss(g)}
\`\`\``);
  }

  parts.push(`${H("Character")}

${a.blurb}

Mode: ${p.dark ? "DARK — the page background is dark" : "LIGHT — the page background is light"}. Dominant accent family: ${colorName(p.accent)}.`);

  parts.push(`${H("Color palette (exact hex — use these, do not restyle them)")}

${paletteTable(g)}
${customColors.length ? "\n" + customColors.map(([key, value]) => `- Custom ${key} color: ${value}`).join("\n") + "\n" : ""}
Contrast as rendered: ${contrastNotes(g)}.

Usage rules:
- Accents go into FILLS, text emphasis, data, and glows — never into decorative
  edge borders or stripes on panels. All borders/rules use the border color
  (or the ink color where this spec says so). Never add an accent-colored
  left/top border stripe to a card — that pattern is explicitly banned.
- Text on the primary accent must use a contrast-checked counter-color
  (white or near-black, whichever reads better). Here that is ${onColor(p.accent)}.
- Tints are allowed: transparent rgba() versions of palette colors for hover
  fills, selection, and chart areas.`);

  parts.push(`${H("Typography")}

- Display/headings: ${fontLabel(g.fonts.display)}
  font-family: ${fontStack(g.fonts.display)}
- Body: ${fontLabel(g.fonts.body)}
  font-family: ${fontStack(g.fonts.body)}
- Mono/labels: ${fontLabel(g.fonts.mono)}
  font-family: ${fontStack(g.fonts.mono)}
- Heading weight: ${g.hw}. Heading letter-spacing: ${g.track}em (${trackWord(g.track)}). Heading case: ${caseDesc(g.case)}.
- Heading scale follows the archetype craft CSS where it sets sizes. Otherwise
  begin around 44–56px for a desktop display heading with tight leading and
  scale responsively; section titles normally begin around 15–18px.
- Body text 15–16px at line-height 1.5; small labels 10.5–12px.

### Shape, depth, texture, spacing

- Panel corner radius: ${g.radius}px (${radiusWord(g.radius)}). Control (button/chip/input) radius: ${controlWord(g.ctl)}.
- Border width: ${g.bw}px${g.bw === 0 ? (g.shadow === "none" ? " (borderless — surfaces are separated by fill color alone)" : " (borderless — depth comes from shadows alone)") : ` solid ${p.border}`}.
- Shadows: ${SHADOW_DESC[g.shadow]}
  Exact card shadow: \`${sh.card}\`
  Exact button shadow: \`${sh.btn}\`
- Texture: ${TEXTURE_DESC[g.texture]}
- Spacing: ${DENSITY_DESC[g.density]} Base spacing unit ≈ ${spacingUnit(g)}px; pad cards ~2× the unit, gap sections ~2.5×.`);

  if (!compact) {
    parts.push(`${H("Canonical archetype craft CSS")}

This is the exact bespoke CSS recipe used by the reference renderer. Treat its
values, motifs, pseudo-elements, nth-child variations, and process effects as
authoritative. It layers on top of the starter CSS in section 4 and uses the
same class names. Map \`.style-scope\` and the class roles to the target
project rather than copying the sample's information architecture verbatim.

\`\`\`css
${craftCss}
\`\`\`

### Class glossary for the CSS above

${glossaryTable(craftCss)}`);
  }

  parts.push(`${H("Site structure and component fidelity")}

- Selected structure: **${specimen.label}** (id: \`${specimen.id}\`).
  Structure contract: ${specimen.contract}
- This is a VISUAL LANGUAGE, not a command to copy the sample page or force
  every project into a hero-plus-cards landing page. Preserve the target
  product's real information architecture and apply this style to it.
- Carry the style through every component the product actually uses:
  navigation, links and visited/current states, buttons and
  hover/focus/pressed/disabled states, form fields and validation,
  cards/panels, lists/tables, alerts/status, media/figures, charts, overlays,
  empty/loading states, and the footer.
- Responsive layouts must reflow at narrow widths; do not shrink a desktop
  canvas. Preserve hierarchy, touch targets, readable type, and visible focus.
  Navigation must remain available on mobile through a compact menu, drawer,
  or equivalent; never simply hide it without a replacement.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text and
  control boundaries. Reflow or clamp display type before it clips or overflows.
- Bespoke motifs must remain subordinate to content and must not replace
  semantic controls, labels, headings, or accessible state indicators.`);

  if (compact) {
    parts.push(`${H("Charts & data viz")}

Geometry: ${CHART_DESC[chart.mark] || CHART_DESC[g.chart] || "a restrained data display consistent with this style"}.
Mark treatment: ${CHART_TREATMENT_DESC[chart.treatment] || chart.treatment}.
${CHART_GRID_DESC[chart.grid] || CHART_GRID_DESC.full}
Sparklines are thin accent-colored lines with no axes.`);
  } else {
    parts.push(`${H("Charts & data viz")}

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

Reference chart markup — the exact SVG the preview renders. The pattern
\`<defs>\`, fills, and strokes are authoritative; scale the geometry to your data.

\`\`\`svg
${chartSvg(g, "ref")}
\`\`\``);
  }

  parts.push(`${H("Fidelity checklist before delivery")}

- Exact palette roles and font stacks above are used; no framework-default indigo.
- The named archetype is recognizable without relying on its label.
- Every visible component follows the same border, radius, depth, texture, type,
  and interaction-state logic.
- Print/data patterns match the specified physical process and remain legible.
- Desktop and mobile layouts are both intentionally composed.
- Every signature detail in section 2 is plainly perceptible at normal 1× viewing.
  The result fails if hiding the archetype name makes it read as a generic SaaS,
  generic editorial, or default component-library skin.`);

  if (!compact) {
    parts.push(`${H("Machine-readable genome")}

The JSON below is the canonical encoding of this style. Keep it with the project;
any tool that understands it can regenerate the exact same style. Reopen it in
the editor at https://style-genome.com/ by importing this JSON.

\`\`\`json
${JSON.stringify(g, null, 2)}
\`\`\``);
  }

  return parts.join("\n\n") + "\n";
}
