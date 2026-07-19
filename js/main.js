import { diverseSet, neighborSet } from "./evolve.js";
import { genomeKey, genomeName, genomeGenesLabel, SHADOWS, TEXTURES, DENSITIES, CHARTS, CASES } from "./genome.js";
import { sampleElement, SAMPLE_BASE, SAMPLE_W, tokensCss, buildSample } from "./render.js";
import { buildPrompt } from "./prompt.js";
import { exportPng, downloadText, copyText } from "./export.js";
import { FONTS, FONT_KEYS, fontStack } from "./fonts.js";
import { mulberry32 } from "./rng.js";
import { onColor } from "./color.js";
import { shadowValues } from "./render.js";

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
  finalGenome: null,
  prefs: { mode: "any", energy: "any" },
  shownArchs: new Set(),   // archetypes the user has been shown…
  likedArchs: new Set(),   // …and the ones they actually picked
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
  prompt: document.getElementById("prompttext"),
  note: document.getElementById("tb-note"),
};

// Style elements: base sample CSS once; per-screen genome CSS swapped in bulk.
const baseStyle = document.createElement("style");
baseStyle.textContent = SAMPLE_BASE;
document.head.appendChild(baseStyle);

const gridStyle = document.createElement("style");
document.head.appendChild(gridStyle);

const finStyle = document.createElement("style");
document.head.appendChild(finStyle);

const isTaken = (key) => state.seen.has(key);

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

function renderRound() {
  state.grid = roundGenomes();
  const favKey = state.liked.length ? genomeKey(state.liked[state.liked.length - 1]) : null;

  els.roundmsg.textContent = `Round ${state.round} of ${ROUNDS}`;
  els.prefsbar.hidden = state.round !== 1;
  if (state.round === 1) {
    els.introtitle.textContent = "Pick the one that draws you in.";
    els.introsub.textContent =
      "Twelve deliberately different directions. Don't overthink it — go with your gut. Each round narrows in on your taste.";
  } else if (state.round < ROUNDS) {
    els.introtitle.textContent = "Getting warmer — pick again.";
    els.introsub.textContent =
      "Eleven new styles that share DNA with what you've liked so far, plus your current favorite. Pick your favorite of these twelve.";
  } else {
    els.introtitle.textContent = "Last round — final pick.";
    els.introsub.textContent =
      "Fine variations on your taste. The one you pick opens the editor, where you can tune the palette and every other knob.";
  }

  let css = "";
  els.grid.innerHTML = "";
  const frag = document.createDocumentFragment();

  state.grid.forEach((g) => {
    const key = genomeKey(g);
    state.seen.add(key);
    state.shownArchs.add(g.archetype);
    const { el, css: gCss } = sampleElement(g);
    css += gCss;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile" + (favKey === key ? " tile-fav" : "");
    tile.setAttribute("aria-label", `Choose style: ${genomeName(g)}`);

    const viewport = document.createElement("div");
    viewport.className = "tile-viewport";
    viewport.appendChild(el);

    const caption = document.createElement("div");
    caption.className = "tile-caption";
    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = genomeName(g);
    const genes = document.createElement("span");
    genes.className = "tile-genes";
    genes.textContent = genomeGenesLabel(g);
    const use = document.createElement("span");
    use.className = "tile-usebtn";
    use.textContent = "Use now →";
    use.title = "Skip remaining rounds and open this style in the editor";
    use.addEventListener("click", (ev) => {
      ev.stopPropagation();
      enterFinale(g);
    });
    caption.append(name, genes, use);

    tile.append(viewport, caption);
    tile.addEventListener("click", () => onPick(g));
    frag.appendChild(tile);
  });

  gridStyle.textContent = css;
  els.grid.appendChild(frag);
  requestAnimationFrame(scaleAll);
}

function onPick(g) {
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

// ------------------------------------------------------------------ finale

function enterFinale(g) {
  state.finalGenome = JSON.parse(JSON.stringify(g));
  els.intro.hidden = true;
  els.grid.hidden = true;
  els.finale.hidden = false;
  els.roundmsg.textContent = "Your style — tune it, then export";
  buildEditor();
  refreshFinale();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function refreshFinale() {
  const g = state.finalGenome;
  const { el, css } = sampleElement(g);
  finStyle.textContent = css;
  els.finPreview.innerHTML = "";
  els.finPreview.appendChild(el);
  els.prompt.value = buildPrompt(g);
  applyTheme(g);
  requestAnimationFrame(scaleAll);
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
  ["bg", "Background"], ["surface", "Surface"], ["ink", "Ink (text)"],
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
  for (const [role, label] of PALETTE_ROLES) {
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
  vizGroup.appendChild(selectRow("Style", CHARTS, g.chart, (v) => {
    state.finalGenome.chart = v; refreshFinale();
  }));

  const note = document.createElement("p");
  note.className = "ed-note";
  note.textContent =
    "Every change updates the preview, this whole page, and the LLM prompt below — they all derive from the same style genome.";

  els.editor.append(palGroup, typeGroup, shapeGroup, vizGroup, note);

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
  for (const opt of options) {
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

document.getElementById("btn-png").addEventListener("click", async () => {
  const g = state.finalGenome;
  if (!g) return;
  setNote("Rendering PNG…");
  try {
    await exportPng(g, `style-${g.archetype}-${genomeKey(g)}.png`);
    setNote("PNG downloaded.");
  } catch (err) {
    setNote(`PNG export failed: ${err.message}`);
  }
});

document.getElementById("btn-copyprompt").addEventListener("click", async () => {
  if (!state.finalGenome) return;
  const ok = await copyText(buildPrompt(state.finalGenome));
  setNote(ok ? "Prompt copied to clipboard." : "Copy failed — select the text below instead.");
});

document.getElementById("btn-dlprompt").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  downloadText(`style-${g.archetype}-${genomeKey(g)}.md`, buildPrompt(g), "text/markdown");
  setNote("Prompt downloaded.");
});

document.getElementById("btn-dljson").addEventListener("click", () => {
  const g = state.finalGenome;
  if (!g) return;
  downloadText(`style-${g.archetype}-${genomeKey(g)}.json`, JSON.stringify(g, null, 2), "application/json");
  setNote("Genome downloaded.");
});

let noteTimer = null;
function setNote(msg) {
  els.note.textContent = msg;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => { els.note.textContent = ""; }, 5000);
}

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

document.getElementById("restartbtn").addEventListener("click", () => {
  state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
  state.r = mulberry32(state.seed);
  state.round = 1;
  state.liked = [];
  state.seen = new Set();
  state.shownArchs = new Set();
  state.likedArchs = new Set();
  state.finalGenome = null;
  document.body.classList.remove("themed");
  document.body.removeAttribute("style");
  els.finale.hidden = true;
  els.intro.hidden = false;
  els.grid.hidden = false;
  renderRound();
  window.scrollTo({ top: 0, behavior: "instant" });
});

// ----------------------------------------------------------------- scaling

function scaleAll() {
  document.querySelectorAll(".tile-viewport, .fin-preview-wrap").forEach((vp) => {
    const sample = vp.querySelector(".sample");
    if (!sample) return;
    const scale = vp.clientWidth / SAMPLE_W;
    sample.style.transform = `scale(${scale})`;
  });
}
window.addEventListener("resize", scaleAll);

// ------------------------------------------------------------------- start

state.r = mulberry32(state.seed);
renderRound();
