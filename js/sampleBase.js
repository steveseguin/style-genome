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
  min-height: ${SAMPLE_H}px;
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
  color: var(--accent-text);
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
.stat-delta { font-size: 12px; color: var(--accent-text); font-weight: 600; }
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

/* ---------------- shared semantic component contract ---------------- */
.sample a { color: var(--accent-text); text-underline-offset: 2px; }
.sample button { font: inherit; }
.sample input { font: inherit; color: inherit; }
.hero-compact { gap: calc(var(--sp) * .65); }
.hero-compact .display { font-size: 34px; max-width: 22ch; }
.hero-row { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: calc(var(--sp) * 2); }
.hero-row .display { font-size: 34px; max-width: 22ch; }
.hero-row .actions { margin: 0; flex-shrink: 0; }
.meta { color: var(--muted); font-size: 10px; letter-spacing: .09em; text-transform: uppercase; }
.media-block {
  min-height: 74px; display: grid; place-items: center; overflow: hidden;
  color: var(--muted); background: var(--surface2); border: 1px solid var(--border);
  border-radius: max(0px, calc(var(--radius) * .7)); font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
}
.media-wide { min-height: 96px; background: linear-gradient(135deg, var(--surface2), color-mix(in srgb, var(--accent) 18%, var(--surface))); }
.list-row { display: grid; grid-template-columns: 26px 1fr; gap: 8px; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
.list-no { color: var(--muted); font-family: var(--f-mono); }
.pullquote { margin-top: auto; color: var(--ink); font-family: var(--f-display); font-size: 16px; font-style: italic; }
.publication-grid { grid-template-columns: 1.35fr .85fr 1fr; }
.feature-story { gap: 7px; }

.field {
  display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 7px 10px;
  background: var(--surface); border: var(--bw) solid var(--border); border-radius: var(--r-ctl);
  color: var(--muted); font-size: 12px;
}
.field kbd { margin-left: auto; padding: 2px 6px; border: 1px solid var(--border); border-radius: 4px; font: 10px var(--f-mono); color: var(--ink); }
.knowledge-grid { grid-template-columns: .62fr 1.55fr .78fr; }
.nav-tree { display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.nav-tree span { padding: 5px 7px; color: var(--muted); }
.nav-tree .on { background: var(--surface2); color: var(--ink); font-weight: 700; }
.doc-card { gap: 7px; }
.code-block { margin: 0; padding: 8px 10px; border: 1px solid var(--border); background: var(--surface2); color: var(--ink); font: 10.5px/1.4 var(--f-mono); overflow: hidden; }
.alert { display: flex; gap: 8px; padding: 7px 9px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); font-size: 10.5px; }
.alert strong { color: var(--ink); }
.toc-card a { font-size: 11px; }

.metric-row { grid-template-columns: .85fr .85fr 1.3fr; }
.metric-row .card { padding: calc(var(--sp) * 1.35); gap: calc(var(--sp) * .6); }
.metric-row .stat-num { font-size: 27px; }
.metric-row .spark { height: 25px; }
.status { display: inline-flex; align-items: center; gap: 5px; color: var(--muted); font-size: 10.5px; }
.status i { width: 7px; height: 7px; border-radius: 50%; background: var(--accent2); }
.status.ok { color: var(--accent2-text); }
.status.warn { color: var(--accent-text); }
.data-panel { padding: calc(var(--sp) * 1.25) calc(var(--sp) * 1.6); gap: 6px; }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
.data-table th { color: var(--muted); font-size: 9px; letter-spacing: .07em; text-transform: uppercase; text-align: left; }
.data-table th, .data-table td { padding: 5px 7px; border-top: 1px solid var(--border); }

.filter-field { min-width: 220px; justify-content: space-between; color: var(--ink); }
.product-grid { grid-template-columns: repeat(3, 1fr); }
.product-card { padding: calc(var(--sp) * 1.25); gap: 5px; }
.product-media { min-height: 122px; font-family: var(--f-display); font-size: 26px; color: var(--ink); }
.media-a { background: linear-gradient(145deg, var(--surface2), color-mix(in srgb, var(--accent) 30%, var(--surface))); }
.media-b { background: linear-gradient(35deg, color-mix(in srgb, var(--accent2) 24%, var(--surface)), var(--surface2)); }
.media-c { background: radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, var(--surface)), var(--surface2)); }
.product-foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.product-foot .btn { padding: 5px 11px; }
.price { font-family: var(--f-display); font-size: 18px; }

.stepper { display: flex; gap: 0; color: var(--muted); font-size: 10.5px; }
.stepper span { flex: 1; padding: 5px 8px; border-bottom: 2px solid var(--border); }
.stepper .on { color: var(--ink); border-color: var(--accent); font-weight: 700; }
.smain.specimen-workflow, .smain.specimen-reservation {
  gap: calc(var(--sp) * 1.45);
  padding-top: calc(var(--sp) * 1.75);
  padding-bottom: calc(var(--sp) * 1.15);
}
.workflow-grid { grid-template-columns: 1.45fr .8fr; }
.form-card { display: grid; grid-template-columns: 1fr 1fr; align-content: start; }
.form-card .card-t, .form-card .choice-row, .form-card .actions { grid-column: 1 / -1; }
.form-field { display: flex; flex-direction: column; gap: 4px; color: var(--ink); font-size: 10.5px; }
.form-field input { width: 100%; min-width: 0; padding: 7px 8px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-ctl); }
.form-field small { color: var(--accent2-text); }
.input-group { display: flex; align-items: center; border: 1px solid var(--border); border-radius: var(--r-ctl); background: var(--bg); overflow: hidden; }
.input-group > span { padding-left: 7px; color: var(--muted); }
.input-group input { border: none; padding-left: 2px; }
.choice-row { display: flex; gap: 8px; }
.choice { padding: 6px 9px; border: 1px solid var(--border); border-radius: var(--r-ctl); font-size: 10.5px; }
.choice.checked { background: var(--surface2); color: var(--ink); border-color: var(--ink); }
.success { flex-direction: column; }
.check-list { display: flex; flex-direction: column; gap: 7px; color: var(--muted); font-size: 11px; }

.community-grid { grid-template-columns: .85fr 1.35fr .72fr; align-items: start; }
.composer { gap: 10px; }
.person { display: flex; align-items: center; gap: 8px; }
.person > div { display: flex; flex-direction: column; }
.avatar { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 50%; background: var(--accent); color: var(--on-accent); font: 9px var(--f-mono); flex-shrink: 0; }
.avatar-b { background: var(--accent2); }
.avatar-lg { width: 52px; height: 52px; font-size: 13px; }
.composer .actions { flex-wrap: wrap; margin: 0; }
.feed-media { min-height: 110px; background: linear-gradient(145deg, var(--surface2), color-mix(in srgb, var(--accent2) 30%, var(--surface))); }
.reaction-row { display: flex; justify-content: space-between; color: var(--muted); font-size: 10.5px; }
.profile-card { align-items: flex-start; }
.stat-line { display: flex; gap: 6px; align-items: baseline; font-size: 10.5px; color: var(--muted); }
.stat-line strong { color: var(--ink); font-size: 18px; }

.booking-search { max-width: 500px; color: var(--ink); }
.booking-search > span { padding-right: 12px; border-right: 1px solid var(--border); }
.booking-search .btn { margin-left: auto; padding: 5px 11px; }
.reservation-grid { grid-template-columns: 1.1fr .85fr .9fr; }
.calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; font: 10px var(--f-mono); }
.calendar b { color: var(--muted); font-size: 8px; }
.calendar span { padding: 5px 2px; border-radius: var(--r-ctl); }
.calendar .on { background: var(--accent); color: var(--on-accent); }
.slot-list { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.slot-list .chip { text-align: center; }
.slot-list .on { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.venue-media { min-height: 82px; }
.summary-row { display: flex; justify-content: space-between; color: var(--muted); font-size: 11px; }
.summary-row strong { color: var(--ink); }

.component-grid { grid-template-columns: 1.05fr 1.05fr .9fr; }
.state-card, .state-form, .feedback-card { gap: 9px; }
.state-actions { margin: 0; flex-wrap: wrap; }
.sample .btn[disabled] { opacity: .42; box-shadow: none; cursor: not-allowed; }
.chip.on { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.tabs { display: flex; gap: 3px; border-bottom: 1px solid var(--border); margin-top: auto; }
.tab { padding: 5px 7px; color: var(--muted); font-size: 10px; border-bottom: 2px solid transparent; }
.tab.on { color: var(--ink); border-color: var(--accent); font-weight: 700; }
.state-form .form-field span { display: flex; justify-content: space-between; gap: 8px; }
.state-form .form-field small { color: var(--muted); }
.state-form .input-focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: var(--accent); }
.state-form .field-error input { border-color: var(--accent); }
.state-form .field-error .error-text { color: var(--accent-text); }
.feedback-card .alert { flex-direction: column; gap: 2px; }
.warning { border-color: var(--accent); }
.progress-label { display: flex; justify-content: space-between; color: var(--muted); font-size: 10px; }
.progress-label strong { color: var(--ink); }
.progress-track { height: 7px; overflow: hidden; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r-ctl); }
.progress-track span { display: block; width: 72%; height: 100%; background: var(--accent); }
.pagination { display: flex; gap: 4px; margin-top: auto; }
.pagination span { min-width: 24px; padding: 3px 6px; text-align: center; border: 1px solid var(--border); color: var(--muted); font-size: 10px; border-radius: var(--r-ctl); }
.pagination .on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
`;
