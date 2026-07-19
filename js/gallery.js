// Gallery: one sample per archetype, in registry order. Handy for browsing
// the whole style space (and for visually regression-checking archetype CSS).

import { ARCHETYPE_LIST } from "./archetypes/index.js";
import { randomGenome, genomeGenesLabel } from "./genome.js";
import { sampleElement, SAMPLE_BASE, SAMPLE_W } from "./render.js";
import { mulberry32 } from "./rng.js";

const r = mulberry32((Date.now() / 60000) | 0); // varies per minute, stable within it

const baseStyle = document.createElement("style");
baseStyle.textContent = SAMPLE_BASE;
document.head.appendChild(baseStyle);

const galStyle = document.createElement("style");
document.head.appendChild(galStyle);

const grid = document.getElementById("gallery");
let css = "";
const frag = document.createDocumentFragment();

for (const arch of ARCHETYPE_LIST) {
  const g = randomGenome(r, arch.id);
  const { el, css: gCss } = sampleElement(g);
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
document.getElementById("count").textContent = `${ARCHETYPE_LIST.length} archetypes`;

function scaleAll() {
  document.querySelectorAll(".tile-viewport").forEach((vp) => {
    const sample = vp.querySelector(".sample");
    if (!sample) return;
    sample.style.transform = `scale(${vp.clientWidth / SAMPLE_W})`;
  });
}
window.addEventListener("resize", scaleAll);
requestAnimationFrame(scaleAll);
