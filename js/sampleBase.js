// Base structural stylesheet for the sample composition (the mini webpage
// every style renders). It is entirely token-driven; archetype CSS layers
// bespoke craft on top. Kept as a JS string (not a .css file) so the live
// preview and the SVG/canvas exporter share the exact same source.

export const SAMPLE_W = 860;
export const SAMPLE_H = 600;

// Inline SVG turbulence noise for grain/paper textures (data URI, offline-safe).
export const NOISE_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.6'/></svg>`
)}")`;

export const SAMPLE_BASE = `
.sample {
  width: ${SAMPLE_W}px;
  height: ${SAMPLE_H}px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--f-body);
  font-size: 15px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.sample * { box-sizing: border-box; margin: 0; }

/* texture overlay slot — archetype/texture CSS fills in the background */
.sample::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}

/* ---------------- top bar ---------------- */
.topbar {
  display: flex;
  align-items: center;
  gap: calc(var(--sp) * 2.2);
  padding: calc(var(--sp) * 1.5) calc(var(--sp) * 3);
  border-bottom: var(--bw) solid var(--border);
  position: relative;
  z-index: 2;
}
.brand {
  font-family: var(--f-display);
  font-weight: var(--hw);
  font-size: 16px;
  letter-spacing: var(--track);
  text-transform: var(--case);
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo {
  width: 14px;
  height: 14px;
  background: var(--accent);
  border-radius: var(--logo-r, 3px);
  display: inline-block;
  flex-shrink: 0;
}
.topnav { display: flex; gap: calc(var(--sp) * 1.8); font-size: 13.5px; }
.topnav .nl { color: var(--muted); }
.topnav .nl.on { color: var(--ink); font-weight: 600; }
.navbtn { margin-left: auto; }

/* ---------------- buttons ---------------- */
.btn {
  display: inline-block;
  padding: 9px 17px;
  border-radius: var(--r-ctl);
  font-size: 13.5px;
  font-weight: 600;
  font-family: var(--f-body);
  line-height: 1.2;
  border: var(--bw) solid transparent;
  white-space: nowrap;
}
.btn-a {
  background: var(--accent);
  color: var(--on-accent);
  box-shadow: var(--shadow-btn);
}
.btn-b {
  background: transparent;
  color: var(--ink);
  border-color: var(--border);
}
.topbar .btn { padding: 6px 13px; font-size: 12.5px; }

/* ---------------- main / hero ---------------- */
.smain {
  flex: 1;
  padding: calc(var(--sp) * 3) calc(var(--sp) * 3) calc(var(--sp) * 2.4);
  display: flex;
  flex-direction: column;
  gap: calc(var(--sp) * 2.6);
  position: relative;
  z-index: 2;
  min-height: 0;
}
.hero { display: flex; flex-direction: column; gap: calc(var(--sp) * 1.1); }
.kicker {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.display {
  font-family: var(--f-display);
  font-weight: var(--hw);
  font-size: 44px;
  line-height: 1.06;
  letter-spacing: var(--track);
  text-transform: var(--case);
  max-width: 15ch;
}
.sub {
  color: var(--muted);
  font-size: 15.5px;
  max-width: 54ch;
}
.actions { display: flex; gap: calc(var(--sp) * 1.2); margin-top: calc(var(--sp) * 0.6); align-items: center; }

/* ---------------- cards row ---------------- */
.cards {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr 1.15fr;
  gap: calc(var(--sp) * 2);
  align-items: stretch;
}
.card {
  background: var(--surface);
  border: var(--bw) solid var(--border);
  border-radius: var(--radius);
  padding: calc(var(--sp) * 1.9);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: calc(var(--sp) * 1.1);
  position: relative;
  min-width: 0;
}
.card-t {
  font-family: var(--f-display);
  font-weight: var(--hw);
  font-size: 15px;
  letter-spacing: var(--track);
  text-transform: var(--case);
}
.card-p { font-size: 13px; color: var(--muted); }

.chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: auto; }
.chip {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: var(--r-ctl);
  color: var(--muted);
  white-space: nowrap;
}

/* stat card */
.stat-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}
.stat-num {
  font-family: var(--f-display);
  font-weight: var(--hw);
  font-size: 33px;
  line-height: 1.1;
  letter-spacing: var(--track);
}
.stat-delta { font-size: 12px; color: var(--accent); font-weight: 600; }
.spark { width: 100%; height: 34px; margin-top: auto; display: block; }

/* chart card */
.chart { width: 100%; height: auto; display: block; margin-top: auto; }

/* ---------------- footer ---------------- */
.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--sp) * 1.4) calc(var(--sp) * 3);
  border-top: var(--bw) solid var(--border);
  color: var(--muted);
  font-size: 12px;
  position: relative;
  z-index: 2;
}
`;
