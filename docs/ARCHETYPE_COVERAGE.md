# Archetype coverage contract

This catalog treats an archetype as a reproducible design language, not a color
preset. A registered archetype must define its character, component rules,
complete conformed genome, print/data treatment, and scoped craft CSS. It must
also render and prompt correctly across every specimen structure.

## Canonical coverage

The registry currently contains 114 archetypes across 12 families:

| Family | Count | Primary territory |
|---|---:|---|
| modernist | 7 | International, Bauhaus, reduction, data-ink, transit wayfinding |
| print | 16 | Editorial plus relief, intaglio, planographic, screen, offset, multi-block processes, and wood-type broadsides |
| heritage | 17 | Historic ornament, major twentieth-century graphic movements, and antique survey cartography |
| retro | 9 | Screen eras, Y2K, Aero, vaporwave, mid-century atomic, handheld LCD, and split-flap boards |
| soft | 7 | Glass, neumorphic, clay, pastel, mesh, Scandinavian restraint, and cottage gingham |
| bold | 9 | Brutal, Memphis, poster, toy, cyber, Deco, New Wave, anti-design, and raw concrete |
| organic | 6 | Earth, wabi-sabi, botanical, sketch, atelier, and industrial materiality |
| craft | 9 | Paper, scrapbook, chalk, letterpress, glass, aggregate, foil, and thermal receipts |
| web | 14 | Docs, civic forms, raw HTML, historical web, skeuomorphic, Metro, Material, Fluent UI, and field manuals |
| future | 10 | Solar, mechanical, holographic, data, wireframe, polygonal, space, bento, LCARS consoles, and circuit boards |
| atmos | 5 | Noir, academia, cassette instruments, neon signage, and celestial almanacs |
| pop | 5 | Kawaii, rave, grunge, cut-and-paste vernacular, and varsity athletics |

Vernacular signage and document systems (`signage.js`) and object-derived
worlds (`worlds.js`) are defined by a production constraint — one ink, one
material, one grid — rather than a decorative motif, and each carries a
signature device that survives every specimen structure.

Print process coverage includes copperplate engraving, etching/aquatint,
mezzotint, woodcut, linocut, stone lithography, screenprint, offset CMYK,
Mokuhanga, letterpress, Risograph, photocopy, newsprint, and cyanotype/blueprint.
Charts independently encode geometry, mark treatment, and grid treatment;
supported material marks include hatch, true crosshatch, stipple, halftone,
engraved linework, rough relief, and translucent misregistered overprint.

Major movement coverage includes Swiss/International, Bauhaus, De Stijl,
Constructivism, Art Nouveau, Art Deco, Arts & Crafts, Victorian engraving,
Gothic Blackletter, Italian Futurism, Dada, Suprematism, Cubism, Surrealism,
Pop Art, Op Art, Psychedelia, Mid-Century Atomic, and New Wave/Cranbrook.

## Structure and component coverage

Every unchanged genome is inspected as:

1. Brand / landing
2. Publication
3. Docs / knowledge
4. Dashboard / admin
5. Storefront
6. Form / workflow
7. Community / feed
8. Booking / events
9. Components / states

Together these cover navigation, media, editorial hierarchy, search, code,
alerts, metrics, charts, tables, filters, commerce, forms, validation, progress,
feeds, profiles, calendars, selection, disabled/focus/error states, tabs, and
pagination. The selected structure is encoded into prompt exports, while the
visual genome remains structure-independent.

## Automated definition of done

`npm test` rejects registrations that regress any of the following:

- Versioned genome schema or required archetype fields
- Complete standard and custom palette serialization
- Stable full-genome identity without collisions
- Valid chart geometry/treatment/grid combinations
- Exact craft CSS, every signature note, the `:root` token block, the starter
  stylesheet, and the selected structure contract in the generated prompt
- A materially shorter compact prompt with continuous section numbering
- A standalone stylesheet (tokens + starter + craft) and a lossless permalink
  round-trip for every archetype
- Rendering across all nine specimen structures
- Reachability in the family-balanced discovery sampler
- Genuine later-round variation even for formerly fixed presets

The taxonomy is intentionally extensible: regional traditions and production
vernacular should be added with specific provenance and process logic, never as
generic cultural skins. Near-duplicates belong as variants when they share the
same process, component logic, and historical lineage.
