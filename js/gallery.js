// Gallery: one sample per archetype, in registry order. Handy for browsing
// the whole style space (and for visually regression-checking archetype CSS).

import { ARCHETYPE_LIST } from "./archetypes/index.js";
import { randomGenome, genomeGenesLabel } from "./genome.js";
import { sampleElement, SAMPLE_BASE, SAMPLE_W } from "./render.js";
import { mulberry32 } from "./rng.js";
import { SPECIMENS } from "./specimens.js";

const r = mulberry32((Date.now() / 60000) | 0); // varies per minute, stable within it

const baseStyle = document.createElement("style");
baseStyle.textContent = SAMPLE_BASE;
document.head.appendChild(baseStyle);

const galStyle = document.createElement("style");
document.head.appendChild(galStyle);

const grid = document.getElementById("gallery");
const specimenSelect = document.getElementById("specimen-select");
const familySelect = document.getElementById("family-select");
const genomes = ARCHETYPE_LIST.map((arch) => ({ arch, g: randomGenome(r, arch.id) }));

for (const specimen of SPECIMENS) {
  const option = document.createElement("option");
  option.value = specimen.id;
  option.textContent = specimen.label;
  specimenSelect.appendChild(option);
}

for (const [value, label] of [
  ["all", "All families"],
  ...[...new Set(ARCHETYPE_LIST.map((arch) => arch.family))]
    .sort()
    .map((family) => [family, family[0].toUpperCase() + family.slice(1)]),
]) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  familySelect.appendChild(option);
}

function renderGallery(specimen = "brand", family = "all") {
  let css = "";
  const frag = document.createDocumentFragment();
  grid.innerHTML = "";
  let shown = 0;

  for (const { arch, g } of genomes) {
    if (family !== "all" && arch.family !== family) continue;
    shown++;
    const { el, css: gCss } = sampleElement(g, specimen);
    css += gCss;

    const tile = document.createElement("div");
    tile.className = "tile";
    const viewport = document.createElement("div");
    viewport.className = "tile-viewport";
    viewport.appendChild(el);
    const caption = document.createElement("div");
    caption.className = "tile-caption";
    const name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = arch.name;
    const genes = document.createElement("span");
    genes.className = "tile-genes";
    genes.textContent = `${arch.family} · ${genomeGenesLabel(g)}`;
    caption.append(name, genes);
    tile.append(viewport, caption);
    frag.appendChild(tile);
  }

  galStyle.textContent = css;
  grid.appendChild(frag);
  document.getElementById("count").textContent = family === "all"
    ? `${ARCHETYPE_LIST.length} archetypes`
    : `${shown} of ${ARCHETYPE_LIST.length}`;
  requestAnimationFrame(scaleAll);
}

const rerender = () => renderGallery(specimenSelect.value, familySelect.value);
specimenSelect.addEventListener("change", rerender);
familySelect.addEventListener("change", rerender);

function scaleAll() {
  document.querySelectorAll(".tile-viewport").forEach((vp) => {
    const sample = vp.querySelector(".sample");
    if (!sample) return;
    sample.style.transform = `scale(${vp.clientWidth / SAMPLE_W})`;
  });
}
window.addEventListener("resize", scaleAll);
renderGallery();
