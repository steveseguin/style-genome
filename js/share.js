// Permalinks and genome import. A genome is small enough to live in the URL
// hash as base64url JSON, so any style can be bookmarked, shared, or reopened
// in the editor without a server.

import { ARCHETYPES } from "./archetypes/index.js";
import { GENOME_SCHEMA_VERSION } from "./genome.js";
import { SPECIMEN_IDS } from "./specimens.js";

const REQUIRED_ROLES = ["bg", "surface", "surface2", "ink", "muted", "accent", "accent2", "border"];

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeGenome(g) {
  return toBase64Url(JSON.stringify(g));
}

export function decodeGenome(str) {
  return normalizeGenome(JSON.parse(fromBase64Url(str)));
}

// Accepts a parsed genome object (from JSON paste/file/hash) and returns a
// clean genome or throws a readable error. Unknown extra keys are kept only
// inside the palette (archetype decor roles); everything else is normalized.
export function normalizeGenome(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Not a genome object.");
  const src = JSON.parse(JSON.stringify(raw));
  if (!ARCHETYPES[src.archetype]) throw new Error(`Unknown archetype "${src.archetype}".`);
  if (!src.p || typeof src.p !== "object") throw new Error("Missing palette (p).");
  for (const role of REQUIRED_ROLES) {
    if (typeof src.p[role] !== "string") throw new Error(`Palette is missing "${role}".`);
  }
  const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const fonts = src.fonts && typeof src.fonts === "object" ? src.fonts : {};
  return {
    schemaVersion: GENOME_SCHEMA_VERSION,
    archetype: src.archetype,
    p: { ...src.p, dark: typeof src.p.dark === "boolean" ? src.p.dark : false },
    fonts: { display: fonts.display || "grotesk", body: fonts.body || "grotesk", mono: fonts.mono || "mono" },
    radius: num(src.radius, 8),
    ctl: num(src.ctl, 8),
    bw: num(src.bw, 1),
    shadow: src.shadow || "none",
    texture: src.texture || "none",
    density: src.density || "normal",
    case: src.case || "none",
    hw: num(src.hw, 700),
    track: num(src.track, 0),
    chart: src.chart || "bars",
    chartTreatment: src.chartTreatment || "auto",
    chartGrid: src.chartGrid || "auto",
  };
}

export function genomeLink(g, specimen = "brand", base = "") {
  const parts = [`g=${encodeGenome(g)}`];
  if (specimen && specimen !== "brand") parts.push(`s=${specimen}`);
  return `${base}#${parts.join("&")}`;
}

// Parses `#g=…&s=…`. Returns null when the hash carries no genome; throws on
// a corrupt one so the caller can tell the user.
export function parseHash(hash) {
  const h = (hash || "").replace(/^#/, "");
  if (!h) return null;
  const params = new URLSearchParams(h);
  const g = params.get("g");
  if (!g) return null;
  const genome = decodeGenome(g);
  const s = params.get("s");
  return { genome, specimen: SPECIMEN_IDS.includes(s) ? s : "brand" };
}
