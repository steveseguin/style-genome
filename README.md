# Style Genome

A taste-discovery tool for visual style. It shows you 12 deliberately diverse
webpage styles; you pick the one you like; each following round shows 11 unseen
styles that share DNA with your picks, converging on your taste over 4 rounds.
The winner opens an editor (palette, type, shape, texture, charts — all live),
and every candidate can be inspected through nine real website/component structures.
The final style exports five artifacts:

- **LLM prompt (.md)** — a spec any AI can rebuild the style from. It is ordered
  for progressive fidelity: a plain-English summary, do/don't rules, and a
  paste-ready `:root` token block come first (enough for a small model), then a
  starter component stylesheet, the archetype's exact craft CSS with a class
  glossary, the structure contract, and the genome (for a capable model). A
  **compact** variant drops the code blocks for short-context models.
- **Stylesheet (.css)** — tokens + starter components + craft CSS; add
  `class="style-scope"` to `<body>` and it works without the prompt.
- **PNG** — a pixel snapshot of the sample page in your style
- **Genome (.json)** — the machine-readable encoding of the style
- **Link** — the genome lives in the URL hash, so any style can be bookmarked,
  shared, or reopened in the editor. **Import** reopens a saved .json or .md.

Mis-clicked? **Back** undoes the last pick, filter change, or refresh.
**More options** explores a fresh grid without spending a round and preserves
your current favorite. Progress and tile captions show where you are and which
options vary your favorite or explore another family. **Re-roll** in the editor
gives a fresh set of parameters for the same archetype.

Legibility is enforced, not hoped for (`js/a11y.js`): every sampled genome
passes a palette contrast check calibrated to its archetype, a light-only
archetype can never be handed a dark palette (and vice versa), every rendered
tile is audited in the DOM and swapped if readable text falls to
white-on-white territory, and the editor reports any remaining WCAG misses
for the style you are tuning. Accents used as text go through contrast-safe
`--accent-text` / `--accent2-text` tokens, which the prompt and stylesheet
export as well.

The point: AI-generated websites all converge on the same look. A few human
gut-choices through a deliberately diverse style space land you somewhere
specific — and the exported prompt pins an AI to that spot.

<img width="777" alt="image" src="https://github.com/user-attachments/assets/fce4b857-53ee-4eea-82ec-4050b4e51f21" />

## Run it

Static site, no build step, no dependencies. ES modules need an HTTP server:

```
npx serve .          # or
python -m http.server 8000
```

Then open the printed localhost URL.

Run the schema, prompt, render, structure, identity, and discovery-exposure checks with:

```
npm test
```

## How it works

Everything derives from one **genome** — a JSON object encoding the style:

```
genome ──┬─► scoped CSS (what you see, live)
         ├─► LLM prompt (generated description)
         └─► PNG + JSON exports
```

A genome = **archetype × parameters × component motifs**:

- **Archetypes** (`js/archetypes/*.js`, 114 of them across 12 families and 21 registry modules) are
  hand-crafted design languages — Swiss Modern, Phosphor Terminal,
  Neo-Brutalist, Stained Glass, Art Deco, Riso Print, De Stijl, Film Noir,
  Copperplate Engraving, Mokuhanga, Dada, Arts & Crafts, Metro, Material,
  Cassette Futurism, Geocities Revival, Kawaii, Bureaucracy, LCARS Console,
  Transit Wayfinding, Split-Flap Board, Thermal Receipt, Circuit Board,
  Survey Map, Celestial Almanac, Béton Brut, Varsity Letterman… Each contributes
  bespoke CSS craft (heading treatments, card constructions, decorative
  motifs) plus constraints on the parameters.
- **Parameters** are the continuous/enumerated genes: palette (8 role colors),
  font pairing (system font stacks — offline and export-safe), radius, border
  width, shadow model, substrate texture, density, letter case, chart geometry,
  mark treatment, and grid treatment. Print charts include true crosshatch,
  stipple, halftone, engraved linework, rough relief, and overprint processes.
- **Component motifs** (`js/motifs.js`, 96 of them across 9 slots: backdrop,
  hero decoration, headline, eyebrow label, panels, buttons, tags, logo mark,
  header/footer) are independent sub-component treatments sampled per design.
  An archetype's own craft CSS keeps authority over every slot it styles;
  motifs fill the slots it leaves open, and a few additive ones (prefix
  glyphs, index labels, accent initials, nav underlines) can stack where
  nothing conflicts. Quiet archetypes (minimal, calm, elegant) draw fewer.
  The result is a combinatorial design space rather than a set of presets:
  the same archetype rolls differently in palette, type, shape, texture,
  chart, and motifs every time.
- **Structures** (`js/specimens.js`) are deliberately separate from taste genes.
  Brand, publication, knowledge, operations, storefront, workflow, community,
  reservation, and component-state previews apply one unchanged genome to
  different information architectures. The selected structure and its semantic
  contract are included in copied and downloaded prompts.

### Selection rounds (`js/evolve.js`)

- **Round 1** uses a fair family-stratified pass followed by farthest-point
  sampling over a style-distance metric, so all 12 families are represented
  when the filters allow it (and openers never share an archetype). Optional
  quick filters (Light/Dark, Calm/Bold) constrain the whole session for people
  who already know that much.
- The unfiltered opening sampler reserves at least five light and five dark
  slots, while retaining family coverage and the caps on cream pages and print
  textures. Presentation order is shuffled so constrained families do not
  always occupy the first row.
- **Rounds 2–4** sample neighbors of the liked set: same archetype re-rolled,
  "cousins" (related archetypes), crossovers of two liked styles, and
  early-round wildcards. Mutation radius shrinks each round. Convergence is
  gradual: a first pick is evidence, not a template — in round 2 only about a
  third of cousins carry the liked palette and identical-palette tiles are
  capped, so the grid explores form and color separately; by round 4 nearly
  everything inherits the palette. Palette and font mutations mostly come from
  the archetype's own conform() so identities hold. Physical print chart
  treatments (crosshatch, stipple, rough relief…) never leak onto non-print
  archetypes, and patterned charts are capped per grid unless you picked one.
  Everything shown is tracked so no style repeats; archetypes you were shown
  but didn't pick are treated as soft rejections and avoided; and every grid
  enforces a minimum style-distance from your current favorite so you never
  see a near-clone of it.
- Recent picks carry more weight as rounds progress. Repeated selections of
  the same genome count as one crossover parent; different rolls of the same
  archetype can still recombine. Later rounds allow more variations within an
  archetype and tighter spacing, making refinement visibly closer to the
  current favorite. Replacement tiles account for the remaining visible grid.

### Export (`js/export.js`, `js/prompt.js`, `js/starter.js`, `js/share.js`)

The PNG renders the exact selected structure, markup, and CSS you saw into an
SVG `<foreignObject>`, rasterized to a 2× canvas. System font stacks mean no
font embedding issues.

The prompt and the stylesheet share one class contract (`.card`, `.btn-a`,
`.kicker`, …): `starter.js` emits the `:root` tokens and a structure-agnostic
baseline for those classes, and the archetype craft CSS layers on top of it, so
tokens → starter → craft pasted into any project reproduces the style.
`share.js` encodes a genome as base64url JSON in the URL hash and validates
anything imported back in.

## Adding an archetype

Add an entry to a family file in `js/archetypes/` (or a new family file wired
into `js/archetypes/index.js`):

```js
{
  id: "myid", name: "My Style", family: "bold", traits: ["dark", "playful"],
  blurb: "One paragraph of character prose — this feeds the LLM prompt.",
  notes: ["Component treatment bullets — these feed the prompt too."],
  conform(g, r) { /* pin identity genes, including chartTreatment/chartGrid */ },
  css(s, g) { return `${s} .card { … }`; },  // s is the scope selector
}
```

`npm test` requires every registered archetype to satisfy the current versioned
genome schema, render across all nine structures, produce a structure-aware
prompt containing its exact craft CSS and colors, avoid genome-key collisions,
and remain reachable through the discovery sampler.

See [`docs/ARCHETYPE_COVERAGE.md`](docs/ARCHETYPE_COVERAGE.md) for the maintained
coverage matrix and the definition of done for future archetypes.

House rule honored throughout: no accent-colored decorative edge borders or
stripes on panels — borders always use the neutral border/ink tokens; accents
live in fills, text, data, and glows. (The generated LLM prompt passes this
rule along to whichever AI consumes it.)
