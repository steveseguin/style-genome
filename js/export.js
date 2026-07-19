// Exports: PNG snapshot (SVG foreignObject → canvas), prompt .md, genome .json.
// The PNG renders the same markup+CSS the user saw, at full size, 2× scale.
// System font stacks mean no font embedding is needed.

import { buildSample, SAMPLE_BASE, SAMPLE_W, SAMPLE_H } from "./render.js";

function triggerDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const aEl = document.createElement("a");
  aEl.href = url;
  aEl.download = filename;
  document.body.appendChild(aEl);
  aEl.click();
  aEl.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadText(filename, text, mime = "text/plain") {
  triggerDownload(filename, new Blob([text], { type: `${mime};charset=utf-8` }));
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

export async function exportPng(g, filename, scale = 2) {
  const { cls, html, css } = buildSample(g);

  // Build the full-size sample in a detached container, then serialize it as
  // well-formed XML for the SVG foreignObject.
  const holder = document.createElement("div");
  holder.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  holder.innerHTML =
    `<style>${SAMPLE_BASE}\n${css}</style>` +
    `<div class="sample ${cls} export-mode">${html}</div>`;

  const serialized = new XMLSerializer().serializeToString(holder);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SAMPLE_W}" height="${SAMPLE_H}">` +
    `<foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;

  // NB: must be a data: URL — Chrome marks canvases tainted when a
  // foreignObject SVG is loaded via a blob: URL, but not via data:.
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const img = new Image();
  img.decoding = "sync";
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("SVG rasterization failed"));
    img.src = url;
  });
  // Give layout/fonts inside the SVG a beat to settle before drawing.
  await new Promise((res) => setTimeout(res, 60));

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W * scale;
  canvas.height = SAMPLE_H * scale;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = g.p.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))), "image/png")
  );
  triggerDownload(filename, blob);
  return true;
}
