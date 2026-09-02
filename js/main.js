import { diverseSet, neighborSet } from "./evolve.js";
import {
  genomeKey, genomeName, genomeGenesLabel, randomGenome, SHADOWS, TEXTURES, DENSITIES,
  CHARTS, CHART_TREATMENTS, CHART_GRIDS, CASES,
} from "./genome.js";
import { sampleElement, SAMPLE_W, shadowValues } from "./render.js";
import { buildPrompt } from "./prompt.js";
import { exportPng, downloadText, copyText } from "./export.js";
import { FONTS, FONT_KEYS, fontStack } from "./fonts.js";
import { mulberry32 } from "./rng.js";
import { onColor, isDark } from "./color.js";
import { SPECIMENS, SPECIMEN_IDS } from "./specimens.js";
import { ARCHETYPES } from "./archetypes/index.js";
import { fullStylesheet } from "./starter.js";
import { genomeLink, parseHash, normalizeGenome } from "./share.js";
import { MOTIF_SLOTS, SLOT_LABELS, freeSlots, allowedMotifs } from "./motifs.js";
import { auditContrast, hardFailures, summarizeIssues, paletteIssues } from "./a11y.js";

const ROUNDS = 4;
const GRID_N = 12;

// ------------------------------------------------------------------- state

const state = {
  seed: Date.now() % 2147483647,
  r: null,
  round: 1,
  liked: [],
  seen: new Set(),
  grid: [],
  specimen: "brand",
  finalGenome: null,
  prefs: { mode: "any", energy: "any" },
  shownArchs: new Set(),   // archetypes the user has been shown…
  likedArchs: new Set(),   // …and the ones they actually picked
  history: [],             // snapshots for "Back" (one per pick)
  promptMode: "full",
};

const els = {
  roundmsg: document.getElementById("roundmsg"),
  intro: document.getElementById("intro"),
  introtitle: document.getElementById("introtitle"),
  introsub: document.getElementById("introsub"),
  grid: document.getElementById("pickgrid"),
  prefsbar: document.getElementById("prefsbar"),
  finale: document.getElementById("finale"),
  editor: document.getElementById("editor-controls"),
  finPreviewWrap: document.getElementById("fin-preview-wrap"),
  finPreview: document.getElementById("fin-preview"),
  finName: document.getElementById("fin-name"),
  finBlurb: document.getElementById("fin-blurb"),
  finA11y: document.getElementById("fin-a11y"),
  prompt: document.getElementById("prompttext"),
  promptMode: document.getElementById("prompt-mode"),
  promptMeta: document.getElementById("prompt-meta"),
  note: document.getElementById("tb-note"),
  specimenSelect: document.getElementById("specimen-select"),
  backbtn: document.getElementById("backbtn"),
  importDialog: document.getElementById("import-dialog"),
  importText: document.getElementById("import-text"),
  importFile: document.getElementById("import-file"),
  importError: document.getElementById("import-error"),
};

// Style elements: base sample CSS once; per-screen genome CSS swapped in bulk.
import { SAMPLE_BASE } from "./render.js";
const baseStyle = document.createElement("style");
baseStyle.textContent = SAMPLE_BASE;
document.head.appendChild(baseStyle);

const gridStyle = document.createElement("style");
document.head.appendChild(gridStyle);

const finStyle = document.createElement("style");
document.head.appendChild(finStyle);

const isTaken = (key) => state.seen.has(key);

// ----------------------------------------------------------------- history

function snapshot() {
  return {
    round: state.round,
    grid: state.grid,
    liked: state.liked.slice(),
    seen: new Set(state.seen),
    shownArchs: new Set(state.shownArchs),
    likedArchs: new Set(state.likedArchs),
    finalGenome: state.finalGenome ? JSON.parse(JSON.stringify(state.finalGenome)) : null,
  };
}

function restore(snap) {
  state.round = snap.round;
  state.grid = snap.grid;
  state.liked = snap.liked;
  state.seen = snap.seen;
  state.shownArchs = snap.shownArchs;
  state.likedArchs = snap.likedArchs;
}

function updateBackButton() {
  els.backbtn.hidden = state.history.length === 0;
}

// ------------------------------------------------------------------ rounds

function roundGenomes() {
  if (state.round === 1) {
    return diverseSet(state.r, GRID_N, isTaken, state.prefs);
  }
  // Archetypes shown but never picked are soft rejections — don't re-serve them.
  const rejected = new Set([...state.shownArchs].filter((a) => !state.likedArchs.has(a)));
  const fav = state.liked[state.liked.length - 1];
  const fresh = neighborSet(state.r, state.liked, GRID_N - 1, state.round, isTaken, state.prefs, rejected);
  return [fav, ...fresh];
}

function renderRound({ reuseGrid = false } = {}) {
  if (!reuseGrid) state.grid = roundGenomes();
  const favKey = state.liked.length ? genomeKey(state.liked[state.liked.length - 1]) : null;

  els.roundmsg.textContent = `Round ${state.round} of ${ROUNDS}`;
  els.prefsbar.hidden = state.round !== 1;
  if (state.round === 1) {
    els.introtitle.textContent = "Pick the one that draws you in.";
    els.introsub.textContent =
      "Twelve deliberately different directions. Don't overthink it — go with your gut. Each round narrows in on your taste, and the winner becomes a prompt any AI can follow, a stylesheet, a PNG, and a link.";
  } else if (state.round < ROUNDS) {
    els.introtitle.textContent = "Getting warmer — pick again.";
    els.introsub.textContent =
      "Eleven new styles that share DNA with what you've liked so far, plus your current favorite. Pick your favorite of these twelve.";
  } else {
    els.introtitle.textContent = "Last round — final pick.";
    els.introsub.textContent =
      "Fine variations on your taste. The one you pick opens the editor, where you can tune the palette and every other knob.";
  }

  els.grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  const tileCss = new Map();

  const buildTile = (g) => {
    const key = genomeKey(g);
    state.seen.add(key);
    state.shownArchs.add(g.archetype);
    const { el, css: gCss } = sampleElement(g, state.specimen);
    tileCss.set(key, gCss);

    const tile = document.createElement("article");
    tile.className = "tile" + (favKey === key ? " tile-fav" : "");
    tile.dataset.key = key;

    const viewport = document.createElement("div");
    viewport.className = "tile-viewport";
    viewport.appendChild(el);

    const caption = document.createElement("div");
    caption.className = "tile-caption";
    const choose = document.createElement("button");
    choose.type = "button";
    choose.className = "tile-choose";
    choose.setAttribute("aria-label", `Choose style: ${genomeName(g)}`);
    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = genomeName(g);
    const genes = document.createElement("span");
    genes.className = "tile-genes";
    genes.textContent = genomeGenesLabel(g);
    const use = document.createElement("button");
    use.type = "button";
    use.className = "tile-usebtn";
    use.textContent = "Use now →";
    use.title = "Skip remaining rounds and open this style in the editor";
    use.addEventListener("click", (ev) => {
      ev.stopPropagation();
      state.history.push(snapshot());
      enterFinale(g);
    });
    choose.append(name, genes);
    choose.addEventListener("click", () => onPick(g));
    caption.append(choose, use);

    tile.append(viewport, caption);
    viewport.addEventListener("click", () => onPick(g));
    return tile;
  };

  state.grid.forEach((g) => frag.appendChild(buildTile(g)));
  gridStyle.textContent = [...tileCss.values()].join("");
  els.grid.appendChild(frag);

  // Rendered legibility guard: a tile whose readable text falls to
  // white-on-white territory is swapped for a fresh candidate before paint.
  // (The favorite is the user's own pick and is never swapped.)
  if (!reuseGrid) {
    const tiles = [...els.grid.querySelectorAll(".tile")];
    tiles.forEach((tile, index) => {
      if (tile.dataset.key === favKey) return;
      for (let attempt = 0; attempt < 3; attempt++) {
        const sample = tile.querySelector(".sample");
        if (!hardFailures(auditContrast(sample)).length) return;
        const replacement = replacementGenome();
        if (!replacement) return;
        tileCss.delete(tile.dataset.key);
        state.grid[index] = replacement;
        const fresh = buildTile(replacement);
        tile.replaceWith(fresh);
        tile = fresh;
        gridStyle.textContent = [...tileCss.values()].join("");
      }
    });
  }
  updateBackButton();
  requestAnimationFrame(scaleAll);
}

// One more candidate for the current round, honoring the same constraints.
function replacementGenome() {
  if (state.round === 1) {
    const onScreen = new Set(state.grid.map((g) => g.archetype));
    return diverseSet(state.r, 1, isTaken, state.prefs, onScreen)[0] || null;
  }
  const rejected = new Set([...state.shownArchs].filter((a) => !state.likedArchs.has(a)));
  const fav = state.liked[state.liked.length - 1];
  const others = state.grid.filter((g) => g !== fav);
  return neighborSet(state.r, state.liked, 1, state.round, isTaken, state.prefs, rejected, others)[0] || null;
}

function onPick(g) {
  state.history.push(snapshot());
  state.liked.push(g);
  state.likedArchs.add(g.archetype);
  if (state.round >= ROUNDS) {
    enterFinale(g);
    return;
  }
  state.round += 1;
  renderRound();
  window.scrollTo({ top: 0, behavior: "instant" });
}

// Undo the last step: a pick returns to the previous grid; a re-roll or
// import from the editor returns to the previous genome in the editor.
function goBack() {
  const snap = state.history.pop();
  if (!snap) return;
  restore(snap);
  state.finalGenome = null;
  if (snap.finalGenome) {
    enterFinale(snap.finalGenome);
    return;
  }
  document.body.classList.remove("themed");
  document.body.removeAttribute("style");
  history.replaceState(null, "", location.pathname + location.search);
  els.finale.hidden = true;
  els.intro.hidden = false;
  els.grid.hidden = false;
  if (state.grid.length) renderRound({ reuseGrid: true });
  else renderRound();
  window.scrollTo({ top: 0, behavior: "instant" });
}

// ------------------------------------------------------------------ finale

function enterFinale(g) {
  state.finalGenome = JSON.parse(JSON.stringify(g));
  els.intro.hidden = true;
  els.grid.hidden = true;
  els.finale.hidden = false;
  els.roundmsg.textContent = "Your style — tune it, then export";
  buildEditor();
  refreshFinale();
  updateBackButton();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function currentPrompt() {
  return buildPrompt(state.finalGenome, state.specimen, { mode: state.promptMode });
}

function refreshFinale() {
  const g = state.finalGenome;
  const a = ARCHETYPES[g.archetype];
  const { el, css } = sampleElement(g, state.specimen);
  finStyle.textContent = css;
  els.finPreview.innerHTML = "";
  els.finPreview.appendChild(el);
  els.finName.textContent = `${a.name} · ${genomeGenesLabel(g)}`;
  els.finBlurb.textContent = a.blurb;
  refreshLegibility(el);
  refreshPrompt();
  applyTheme(g);
  // Keep the URL a permalink to exactly what is on screen.
  history.replaceState(null, "", genomeLink(g, state.specimen, location.pathname + location.search));
  requestAnimationFrame(scaleAll);
}

function refreshLegibility(sampleEl) {
  const issues = auditContrast(sampleEl);
  const tokenIssues = paletteIssues(state.finalGenome);
  const hard = hardFailures(issues);
  els.finA11y.textContent = issues.length || tokenIssues.length
    ? `Legibility: ${summarizeIssues(issues)}${tokenIssues.length ? ` Palette: ${tokenIssues.map((i) => `${i.label} ${i.ratio.toFixed(1)}:1`).join(", ")}.` : ""}`
    : "Legibility: all text in this preview passes WCAG contrast.";
  els.finA11y.className = `fin-a11y ${hard.length ? "a11y-bad" : issues.length || tokenIssues.length ? "a11y-warn" : "a11y-ok"}`;
}

function refreshPrompt() {
  const text = currentPrompt();
  els.prompt.value = text;
  const words = text.split(/\s+/).filter(Boolean).length;
  els.promptMeta.textContent = `${text.split("\n").length} lines · ~${Math.round(words * 1.35).toLocaleString()} tokens`;
}

function applyTheme(g) {
  const b = document.body;
  const sh = shadowValues(g);
  b.classList.add("themed");
  const vars = {
    "--bg": g.p.bg, "--surface": g.p.surface, "--surface2": g.p.surface2,
    "--ink": g.p.ink, "--muted": g.p.muted, "--accent": g.p.accent,
    "--accent2": g.p.accent2, "--border": g.p.border, "--on-accent": onColor(g.p.accent),
    "--f-display": fontStack(g.fonts.display), "--f-body": fontStack(g.fonts.body),
    "--f-mono": fontStack(g.fonts.mono),
    "--radius": `${Math.min(g.radius, 14)}px`,
    "--r-ctl": g.ctl === 999 ? "999px" : `${g.ctl}px`,
    "--bw": `${Math.max(g.bw, 1)}px`,
    "--shadow": sh.card,
  };
  for (const [k, v] of Object.entries(vars)) b.style.setProperty(k, v);
}

// ------------------------------------------------------------------ editor

const PALETTE_ROLES = [
  ["bg", "Background"], ["surface", "Surface"], ["surface2", "Surface 2"], ["ink", "Ink (text)"],
  ["muted", "Muted text"], ["accent", "Accent"], ["accent2", "Accent 2"],
  ["border", "Borders"],
];

function buildEditor() {
  const g = state.finalGenome;
  els.editor.innerHTML = "";

  // --- palette
  const palGroup = group("Palette");
  const swWrap = document.createElement("div");
  swWrap.className = "ed-swatches";
  const standardRoles = new Set([...PALETTE_ROLES.map(([role]) => role), "dark"]);
  const customRoles = Object.keys(g.p)
    .filter((role) => !standardRoles.has(role))
    .map((role) => [role, role.replace(/([a-z])([0-9])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase())]);
  for (const [role, label] of [...PALETTE_ROLES, ...customRoles]) {
    const row = document.createElement("label");
    row.className = "ed-swatch";
    const input = document.createElement("input");
    input.type = "color";
    input.value = toHex6(g.p[role]);
    const roleEl = document.createElement("span");
    roleEl.className = "sw-role";
    roleEl.textContent = label;
    const hexEl = document.createElement("span");
    hexEl.className = "sw-hex";
    hexEl.textContent = toHex6(g.p[role]);
    input.addEventListener("input", () => {
      state.finalGenome.p[role] = input.value;
      if (role === "bg") state.finalGenome.p.dark = isDark(input.value);
      hexEl.textContent = input.value;
      refreshFinale();
    });
    row.append(input, roleEl, hexEl);
    swWrap.appendChild(row);
  }
  palGroup.appendChild(swWrap);

  // --- typography
  const typeGroup = group("Typography");
  typeGroup.appendChild(selectRow("Display", FONT_KEYS, g.fonts.display, (v) => {
    state.finalGenome.fonts.display = v; refreshFinale();
  }, (k) => FONTS[k].label.split(" (")[0]));
  typeGroup.appendChild(selectRow("Body", FONT_KEYS.filter((k) => k !== "black"), g.fonts.body, (v) => {
    state.finalGenome.fonts.body = v; refreshFinale();
  }, (k) => FONTS[k].label.split(" (")[0]));
  typeGroup.appendChild(selectRow("Mono", FONT_KEYS.filter((k) => FONTS[k].cls === "mono"), g.fonts.mono, (v) => {
    state.finalGenome.fonts.mono = v; refreshFinale();
  }, (k) => FONTS[k].label.split(" (")[0]));
  typeGroup.appendChild(selectRow("Weight", ["400", "500", "600", "700", "800", "900"], String(g.hw), (v) => {
    state.finalGenome.hw = Number(v); refreshFinale();
  }));
  typeGroup.appendChild(selectRow("Case", CASES, g.case, (v) => {
    state.finalGenome.case = v; refreshFinale();
  }, (c) => (c === "none" ? "normal" : c)));
  typeGroup.appendChild(selectRow("Tracking", ["-0.025", "-0.01", "0", "0.02", "0.06", "0.14"], String(g.track), (v) => {
    state.finalGenome.track = Number(v); refreshFinale();
  }, (t) => ({ "-0.025": "tight", "-0.01": "snug", "0": "normal", "0.02": "open", "0.06": "wide", "0.14": "ultra-wide" }[t] || t)));

  // --- shape & depth
  const shapeGroup = group("Shape & depth");
  shapeGroup.appendChild(rangeRow("Radius", 0, 28, 2, g.radius, (v) => {
    state.finalGenome.radius = v; refreshFinale();
  }, (v) => `${v}px`));
  shapeGroup.appendChild(selectRow("Controls", ["0", "4", "8", "12", "16", "999"], String(g.ctl), (v) => {
    state.finalGenome.ctl = Number(v); refreshFinale();
  }, (v) => (v === "999" ? "pill" : `${v}px`)));
  shapeGroup.appendChild(rangeRow("Borders", 0, 3, 1, g.bw, (v) => {
    state.finalGenome.bw = v; refreshFinale();
  }, (v) => `${v}px`));
  shapeGroup.appendChild(selectRow("Shadow", SHADOWS, g.shadow, (v) => {
    state.finalGenome.shadow = v; refreshFinale();
  }));
  shapeGroup.appendChild(selectRow("Texture", TEXTURES, g.texture, (v) => {
    state.finalGenome.texture = v; refreshFinale();
  }));
  shapeGroup.appendChild(selectRow("Density", DENSITIES, g.density, (v) => {
    state.finalGenome.density = v; refreshFinale();
  }));

  // --- data viz
  const vizGroup = group("Charts");
  vizGroup.appendChild(selectRow("Geometry", CHARTS, g.chart, (v) => {
    state.finalGenome.chart = v; refreshFinale();
  }));
  vizGroup.appendChild(selectRow("Treatment", CHART_TREATMENTS, g.chartTreatment || "auto", (v) => {
    state.finalGenome.chartTreatment = v; refreshFinale();
  }, (v) => v === "auto" ? "style default" : v));
  vizGroup.appendChild(selectRow("Grid", CHART_GRIDS, g.chartGrid || "auto", (v) => {
    state.finalGenome.chartGrid = v; refreshFinale();
  }, (v) => v === "auto" ? "style default" : v));

  // --- component motifs (only the slots this archetype leaves open)
  const motifGroup = group("Component motifs");
  const craft = ARCHETYPES[g.archetype].css(".x", g);
  const free = freeSlots(craft, ".x");
  g.motifs = g.motifs || {};
  for (const slot of MOTIF_SLOTS) {
    const allowed = allowedMotifs(slot, craft, ".x");
    if (!allowed.length) continue;
    const options = ["none", ...allowed.map((m) => m.id)];
    const labels = Object.fromEntries(allowed.map((m) => [m.id, m.name]));
    motifGroup.appendChild(selectRow(SLOT_LABELS[slot], options, g.motifs[slot] || "none", (v) => {
      if (v === "none") delete state.finalGenome.motifs[slot];
      else state.finalGenome.motifs[slot] = v;
      refreshFinale();
    }, (v) => labels[v] || "none"));
  }
  const claimedNote = document.createElement("p");
  claimedNote.className = "ed-note";
  claimedNote.textContent = free.length === MOTIF_SLOTS.length
    ? "Each slot is an independent sub-component; this archetype leaves all of them open."
    : `Slots this archetype styles itself (${MOTIF_SLOTS.filter((s) => !free.includes(s)).map((s) => SLOT_LABELS[s].toLowerCase()).join(", ")}) keep its design; only additive decorations can stack on them.`;
  motifGroup.appendChild(claimedNote);

  const note = document.createElement("p");
  note.className = "ed-note";
  note.textContent =
    "Every change updates the preview, this whole page, the prompt, the stylesheet, and the link in your address bar — they all derive from the same style genome.";

  els.editor.append(palGroup, typeGroup, shapeGroup, vizGroup, motifGroup, note);

  function group(title) {
    const div = document.createElement("div");
    div.className = "ed-group";
    const label = document.createElement("div");
    label.className = "ed-label";
    label.textContent = title;
    div.appendChild(label);
    els.editor.appendChild(div);
    return div;
  }
}

function selectRow(label, options, current, onChange, display) {
  const row = document.createElement("label");
  row.className = "ed-row";
  const name = document.createElement("span");
  name.textContent = label;
  const sel = document.createElement("select");
  // Preserve and expose valid archetype-specific values even when they are not
  // part of the generic editor's suggested option set.
  const actualOptions = options.some((opt) => String(opt) === String(current))
    ? options
    : [current, ...options];
  for (const opt of actualOptions) {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = display ? display(opt) : opt;
    if (String(opt) === String(current)) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener("change", () => onChange(sel.value));
  row.append(name, sel);
  return row;
}

function rangeRow(label, min, max, step, current, onChange, fmt) {
  const row = document.createElement("label");
  row.className = "ed-row";
  const name = document.createElement("span");
  name.textContent = label;
  const input = document.createElement("input");
  input.type = "range";
  input.min = min; input.max = max; input.step = step; input.value = current;
  const val = document.createElement("span");
  val.className = "ed-val";
  val.textContent = fmt(current);
  input.addEventListener("input", () => {
    val.textContent = fmt(Number(input.value));
    onChange(Number(input.value));
  });
  row.append(name, input, val);
  return row;
}

// Color inputs need #rrggbb; palettes occasionally hold rgba() from hand edits.
function toHex6(c) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = c;
  const v = ctx.fillStyle;
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : "#888888";
}

// ----------------------------------------------------------------- exports

const styleId = (g) => `style-${g.archetype}-${genomeKey(g)}`;

document.getElementById("btn-png").addEventListener("click", async () => {
  const g = state.finalGenome;
  if (!g) return;
  setNote("Rendering PNG…");
  try {
    await exportPng(g, `${styleId(g)}-${state.specimen}.png`, state.specimen);
    setNote("PNG downloaded.");
  } catch (err) {
    setNote(`PNG export failed: ${err.message}`);
  }
});

document.getElementById("btn-copyprompt").addEventListener("click", async () => {
  if (!state.finalGenome) return;
  const ok = await copyText(currentPrompt());
  setNote(ok ? `${state.promptMode === "compact" ? "Compact" : "Full"} prompt copied to clipboard.` : "Copy failed — select the text below instead.");
});

document.getElementById("btn-dlprompt").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  const suffix = state.promptMode === "compact" ? "-compact" : "";
  downloadText(`${styleId(g)}-${state.specimen}${suffix}.md`, currentPrompt(), "text/markdown");
  setNote("Prompt downloaded.");
});

document.getElementById("btn-dlcss").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  const id = `${g.archetype}-${genomeKey(g)}`;
  downloadText(`${styleId(g)}.css`, fullStylesheet(g, ARCHETYPES[g.archetype], id), "text/css");
  setNote("Stylesheet downloaded — add class=\"style-scope\" to <body> and link it.");
});

document.getElementById("btn-dljson").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  downloadText(`${styleId(g)}.json`, JSON.stringify(g, null, 2), "application/json");
  setNote("Genome downloaded.");
});

document.getElementById("btn-copylink").addEventListener("click", async () => {
  const g = state.finalGenome;
  if (!g) return;
  const url = location.href.split("#")[0] + genomeLink(g, state.specimen);
  const ok = await copyText(url);
  setNote(ok ? "Link copied — it reopens this exact style in the editor." : "Copy failed — copy the address bar instead.");
});

document.getElementById("btn-reroll").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  state.history.push(snapshot());
  let next = randomGenome(state.r, g.archetype);
  for (let i = 0; i < 12 && genomeKey(next) === genomeKey(g); i++) next = randomGenome(state.r, g.archetype);
  enterFinale(next);
  setNote(`New roll of ${ARCHETYPES[g.archetype].name}. Back returns to the previous one.`);
});

els.promptMode.addEventListener("change", () => {
  state.promptMode = els.promptMode.value === "compact" ? "compact" : "full";
  if (state.finalGenome) refreshPrompt();
});

let noteTimer = null;
function setNote(msg) {
  els.note.textContent = msg;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => { els.note.textContent = ""; }, 6000);
}

// ------------------------------------------------------------------ import

function extractGenomeJson(text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Nothing to import.");
  // Accept a raw genome, or a prompt .md whose last ```json block is the genome.
  const fences = [...trimmed.matchAll(/```json\s*([\s\S]*?)```/g)];
  const candidate = fences.length ? fences[fences.length - 1][1] : trimmed;
  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error("That is not valid JSON. Paste the genome .json contents or a prompt .md that ends with the genome block.");
  }
  return normalizeGenome(parsed);
}

function openImport() {
  els.importError.hidden = true;
  els.importText.value = "";
  els.importFile.value = "";
  els.importDialog.showModal();
  els.importText.focus();
}

document.getElementById("importbtn").addEventListener("click", openImport);
document.getElementById("import-cancel").addEventListener("click", () => els.importDialog.close());
els.importFile.addEventListener("change", async () => {
  const file = els.importFile.files?.[0];
  if (!file) return;
  els.importText.value = await file.text();
});
document.getElementById("import-load").addEventListener("click", () => {
  try {
    const g = extractGenomeJson(els.importText.value);
    els.importDialog.close();
    if (!els.finale.hidden || state.liked.length) state.history.push(snapshot());
    enterFinale(g);
    setNote(`Imported ${ARCHETYPES[g.archetype].name}.`);
  } catch (err) {
    els.importError.textContent = err.message;
    els.importError.hidden = false;
  }
});

// ----------------------------------------------------------- quick filters

// Only visible (and only wired to re-roll) during round 1, before any pick.
document.querySelectorAll(".seg").forEach((seg) => {
  seg.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn || state.round !== 1) return;
    seg.querySelectorAll("button").forEach((b) => b.classList.toggle("seg-on", b === btn));
    state.prefs[seg.dataset.pref] = btn.dataset.val;
    state.seen = new Set();
    state.shownArchs = new Set();
    renderRound();
  });
});

// ----------------------------------------------------------------- restart

function restart() {
  state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
  state.r = mulberry32(state.seed);
  state.round = 1;
  state.liked = [];
  state.seen = new Set();
  state.shownArchs = new Set();
  state.likedArchs = new Set();
  state.finalGenome = null;
  state.history = [];
  document.body.classList.remove("themed");
  document.body.removeAttribute("style");
  history.replaceState(null, "", location.pathname + location.search);
  els.finale.hidden = true;
  els.intro.hidden = false;
  els.grid.hidden = false;
  renderRound();
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.getElementById("restartbtn").addEventListener("click", restart);
document.getElementById("brandlink").addEventListener("click", (ev) => { ev.preventDefault(); restart(); });
els.backbtn.addEventListener("click", goBack);

// Website structure is an inspection lens, not a taste gene. Switching it
// keeps the exact same candidate genomes on screen.
for (const specimen of SPECIMENS) {
  const option = document.createElement("option");
  option.value = specimen.id;
  option.textContent = specimen.label;
  els.specimenSelect.appendChild(option);
}
els.specimenSelect.value = state.specimen;
els.specimenSelect.addEventListener("change", () => {
  state.specimen = els.specimenSelect.value;
  if (state.finalGenome) refreshFinale();
  else renderRound({ reuseGrid: true });
});

// ----------------------------------------------------------------- scaling

// transform: scale() keeps the 860px layout exact (CSS zoom would trigger
// Chrome's minimum font size and re-wrap text at tile scale).
export function fitSample(vp, sample) {
  sample.style.transform = `scale(${vp.clientWidth / SAMPLE_W})`;
}
function scaleAll() {
  document.querySelectorAll(".tile-viewport, .fin-preview-wrap").forEach((vp) => {
    const sample = vp.querySelector(".sample");
    if (sample) fitSample(vp, sample);
  });
}
window.addEventListener("resize", scaleAll);

// ------------------------------------------------------------------- start

state.r = mulberry32(state.seed);

// A permalink (#g=…) opens straight into the editor with that exact genome.
function openFromHash() {
  let parsed = null;
  try {
    parsed = parseHash(location.hash);
  } catch (err) {
    setNote(`Could not read the style in this link: ${err.message}`);
  }
  if (!parsed) return false;
  if (SPECIMEN_IDS.includes(parsed.specimen)) {
    state.specimen = parsed.specimen;
    els.specimenSelect.value = parsed.specimen;
  }
  if (state.finalGenome && genomeKey(state.finalGenome) === genomeKey(parsed.genome)) return true;
  if (state.finalGenome || state.liked.length) state.history.push(snapshot());
  enterFinale(parsed.genome);
  return true;
}

if (!openFromHash()) renderRound();
window.addEventListener("hashchange", () => { openFromHash(); });
