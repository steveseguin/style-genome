import { modernist } from "./modernist.js";
import { print } from "./print.js";
import { retro } from "./retro.js";
import { soft } from "./soft.js";
import { bold } from "./bold.js";
import { organic } from "./organic.js";
import { craftTactile } from "./craftTactile.js";
import { craftPrint } from "./craftPrint.js";
import { webUtil } from "./webUtil.js";
import { webRetro } from "./webRetro.js";
import { futureTech } from "./futureTech.js";
import { futureSpace } from "./futureSpace.js";
import { heritageModern } from "./heritageModern.js";
import { heritageClassic } from "./heritageClassic.js";
import { atmos } from "./atmos.js";
import { popPack } from "./popPack.js";

export const ARCHETYPE_LIST = [
  ...modernist, ...print, ...retro, ...soft, ...bold, ...organic,
  ...craftTactile, ...craftPrint, ...webUtil, ...webRetro,
  ...futureTech, ...futureSpace, ...heritageModern, ...heritageClassic,
  ...atmos, ...popPack,
];

export const ARCHETYPES = Object.fromEntries(ARCHETYPE_LIST.map((a) => [a.id, a]));

export const ARCHETYPE_IDS = ARCHETYPE_LIST.map((a) => a.id);

// Archetypes that share a family or at least one trait — used when evolution
// wants a "cousin" of a liked style.
export function relatedArchetypes(id) {
  const base = ARCHETYPES[id];
  if (!base) return ARCHETYPE_IDS;
  const rel = ARCHETYPE_LIST.filter(
    (a) =>
      a.id !== id &&
      (a.family === base.family || a.traits.some((t) => base.traits.includes(t)))
  ).map((a) => a.id);
  return rel.length ? rel : ARCHETYPE_IDS.filter((x) => x !== id);
}
