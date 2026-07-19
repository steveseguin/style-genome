import { pick } from "../rng.js";

// Keep the current gene value if it's in the allowed set, else pick one.
// Lets archetypes constrain without erasing all sampled variety.
export const among = (r, cur, allowed) =>
  allowed.includes(cur) ? cur : pick(r, allowed);
