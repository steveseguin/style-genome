# Style Genome

A taste-discovery tool for visual style. It shows you 12 deliberately diverse
webpage styles; you pick the one you like; each following round shows 11 unseen
styles that share DNA with your picks, converging on your taste over 4 rounds.
The winner opens an editor (palette, type, shape, texture, charts — all live),
and every candidate can be inspected through nine real website/component structures.
The final style exports three artifacts:

- **PNG** — a pixel snapshot of the sample page in your style
- **LLM prompt (.md)** — a precise natural-language spec any AI can rebuild the style from
- **Genome (.json)** — the machine-readable encoding of the style

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

A genome = **archetype × parameters**:

- **Archetypes** (`js/archetypes/*.js`, 101 of them across 12 families and 19 registry modules) are
  hand-crafted design languages — Swiss Modern, Phosphor Terminal,
  Neo-Brutalist, Stained Glass, Art Deco, Riso Print, De Stijl, Film Noir,
  Copperplate Engraving, Mokuhanga, Dada, Arts & Crafts, Metro, Material,
  Cassette Futurism, Geocities Revival, Kawaii, Bureaucracy… Each contributes
  bespoke CSS craft (heading treatments, card constructions, decorative
  motifs) plus constraints on the parameters.
- **Parameters** are the continuous/enumerated genes: palette (8 role colors),
  font pairing (system font stacks — offline and export-safe), radius, border
  width, shadow model, substrate texture, density, letter case, chart geometry,
  mark treatment, and grid treatment. Print charts include true crosshatch,
  stipple, halftone, engraved linework, rough relief, and overprint processes.
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
- **Rounds 2–4** sample neighbors of the liked set: same archetype re-rolled,
  "cousins" (related archetype carrying your palette), crossovers of two liked
  styles, and early-round wildcards. Mutation radius shrinks each round.
  Everything shown is tracked so no style repeats; archetypes you were shown
  but didn't pick are treated as soft rejections and avoided; and every grid
  enforces a minimum style-distance from your current favorite so you never
  see a near-clone of it.

### Export (`js/export.js`)

The PNG renders the exact selected structure, markup, and CSS you saw into an
SVG `<foreignObject>`, rasterized to a 2× canvas. System font stacks mean no
font embedding issues.

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
