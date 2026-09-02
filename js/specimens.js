// Website structure is deliberately separate from the visual genome. A user
// should be able to inspect the same style on different information
// architectures without teaching the evolution engine that a preferred page
// type is a preferred aesthetic.

export const SPECIMENS = [
  {
    id: "brand", label: "Brand / landing",
    contract: "Use a primary navigation, focused value proposition, clear primary and secondary actions, supporting feature/proof sections, and a useful footer.",
  },
  {
    id: "publication", label: "Publication",
    contract: "Use edition or section context, a lead story with media and metadata, a scannable story index, secondary editorial material, and subscription/navigation paths.",
  },
  {
    id: "knowledge", label: "Docs / knowledge",
    contract: "Use breadcrumbs and search, persistent section navigation, readable long-form content, code or structured examples, callouts, and related-topic navigation.",
  },
  {
    id: "operations", label: "Dashboard / admin",
    contract: "Use a workspace toolbar, metric summaries, trend or distribution views, dense data tables, explicit statuses, filters, and clear row/bulk actions.",
  },
  {
    id: "storefront", label: "Storefront",
    contract: "Use collection context and filters, a product grid with meaningful media, metadata, price and availability, unambiguous add-to-cart actions, and cart state.",
  },
  {
    id: "workflow", label: "Form / workflow",
    contract: "Use visible progress, grouped labeled fields, help and validation text, appropriate choices, a review/summary surface, and clear back/continue actions.",
  },
  {
    id: "community", label: "Community / feed",
    contract: "Use feed/discovery navigation, a composer, attributed posts with timestamps and media, reaction controls and counts, plus profile or community context.",
  },
  {
    id: "reservation", label: "Booking / events",
    contract: "Use date/location/party context, a calendar or event index, available time or ticket choices, selection state, and a booking summary with price and confirmation action.",
  },
  {
    id: "components", label: "Components / states",
    contract: "Demonstrate primary, secondary and disabled controls; default, focus, help, and error form states; tabs, status feedback, progress, and pagination with accessible labels and unmistakable state differences.",
  },
];

export const SPECIMEN_IDS = SPECIMENS.map((item) => item.id);

export function specimenLabel(id) {
  return SPECIMENS.find((item) => item.id === id)?.label || SPECIMENS[0].label;
}

export function specimenDefinition(id) {
  return SPECIMENS.find((item) => item.id === id) || SPECIMENS[0];
}

function topbar(active = "Work", action = "Contact") {
  const links = ["Work", "Notes", "About"]
    .map((name) => `<a class="nl${name === active ? " on" : ""}" href="#" tabindex="-1">${name}</a>`)
    .join("");
  return `<header class="topbar">
  <span class="brand"><span class="logo"></span>Nordwind</span>
  <nav class="topnav">${links}</nav>
  <button class="btn btn-b navbtn" type="button" tabindex="-1">${action}</button>
</header>`;
}

const footer = `<footer class="foot"><span>© Nordwind Studio</span><span>Imprint · Colophon · RSS</span></footer>`;

const button = (label, primary = false) =>
  `<button class="btn ${primary ? "btn-a" : "btn-b"}" type="button" tabindex="-1">${label}</button>`;

const chip = (label, extra = "") => `<span class="chip ${extra}">${label}</span>`;

function brand({ chart, spark }) {
  return `${topbar()}
<main class="smain specimen-brand">
  <div class="hero">
    <span class="kicker">Field notes · 04</span>
    <h1 class="display">Make it feel deliberate</h1>
    <p class="sub">A short standfirst that sets the tone — cadence, contrast, and a point of view carried through every surface.</p>
    <div class="actions">${button("Get started", true)}${button("Browse the notes")}</div>
  </div>
  <div class="cards">
    <section class="card">
      <h3 class="card-t">Palette &amp; texture</h3>
      <p class="card-p">Surfaces, ink, and accent working in proportion — the quiet parts doing most of the talking.</p>
      <div class="chips">${chip("design")}${chip("systems")}${chip("type")}</div>
    </section>
    <section class="card stat">
      <span class="stat-label">Monthly readers</span><span class="stat-num">48,210</span>
      <span class="stat-delta">▲ 12.4% vs last month</span>${spark}
    </section>
    <section class="card chartcard"><h3 class="card-t">Output by quarter</h3>${chart}</section>
  </div>
</main>${footer}`;
}

function publication({ chart }) {
  return `${topbar("Notes", "Subscribe")}
<main class="smain specimen-publication">
  <div class="hero hero-compact">
    <span class="kicker">The Saturday edition · Vol. 12</span>
    <h1 class="display">Ideas worth keeping</h1>
    <p class="sub">Reporting, criticism, and field notes for people who notice how things are made.</p>
  </div>
  <div class="cards publication-grid">
    <article class="card feature-story">
      <div class="media-block media-wide"><span>Feature image</span></div>
      <div class="meta">Design · 8 min read</div><h3 class="card-t">The quiet machinery behind good work</h3>
      <p class="card-p">A reported feature with a considered standfirst and room for a strong editorial voice.</p>
    </article>
    <section class="card story-index"><h3 class="card-t">Latest stories</h3>
      <div class="list-row"><span class="list-no">01</span><span>Against frictionless everything</span></div>
      <div class="list-row"><span class="list-no">02</span><span>Notes from the field</span></div>
      <div class="list-row"><span class="list-no">03</span><span>A material vocabulary</span></div>
      <div class="chips">${chip("culture")}${chip("process")}</div>
    </section>
    <aside class="card chartcard"><h3 class="card-t">Reader index</h3>${chart}<p class="pullquote">“Clarity is a form of care.”</p></aside>
  </div>
</main>${footer}`;
}

function knowledge() {
  return `${topbar("Notes", "Search docs")}
<main class="smain specimen-knowledge">
  <div class="hero hero-compact">
    <span class="kicker">Docs / Foundations / Color</span><h1 class="display">Build a coherent palette</h1>
    <div class="search-field field"><span class="field-icon">⌕</span><span>Search documentation…</span><kbd>⌘ K</kbd></div>
  </div>
  <div class="cards knowledge-grid">
    <nav class="card side-card"><h3 class="card-t">On this page</h3>
      <div class="nav-tree"><span class="on">Color roles</span><span>Contrast</span><span>Dark mode</span><span>Usage</span></div>
    </nav>
    <article class="card doc-card"><div class="meta">FOUNDATIONS</div><h3 class="card-t">Color roles, not swatches</h3>
      <p class="card-p">Name colors by purpose so components survive theme and context changes.</p>
      <pre class="code-block"><code>--surface: #f7f5ef;
--ink: #1d1c19;
--accent: #b43c2f;</code></pre>
      <div class="alert"><strong>Note</strong><span>Muted text still needs readable contrast.</span></div>
    </article>
    <aside class="card toc-card"><h3 class="card-t">Related</h3><a href="#" tabindex="-1">Typography scale →</a><a href="#" tabindex="-1">Surface depth →</a><div class="chips">${chip("API")}${chip("v2.4")}</div></aside>
  </div>
</main>${footer}`;
}

function operations({ chart, spark }) {
  return `${topbar("Work", "New report")}
<main class="smain specimen-operations">
  <div class="hero hero-row">
    <div><span class="kicker">Workspace / Overview</span><h1 class="display">Operations</h1></div>
    <div class="actions">${button("Export")}${button("Add widget", true)}</div>
  </div>
  <div class="cards metric-row">
    <section class="card stat"><span class="stat-label">Revenue</span><span class="stat-num">$84.2k</span><span class="stat-delta">▲ 8.1%</span>${spark}</section>
    <section class="card stat"><span class="stat-label">Active projects</span><span class="stat-num">24</span><span class="status"><i></i> 21 healthy</span></section>
    <section class="card chartcard"><h3 class="card-t">Throughput</h3>${chart}</section>
  </div>
  <section class="card data-panel"><div class="panel-head"><h3 class="card-t">Recent work</h3><div class="chips">${chip("All")}${chip("Active")}${chip("At risk")}</div></div>
    <table class="data-table"><thead><tr><th>Project</th><th>Owner</th><th>Status</th><th>Updated</th></tr></thead><tbody>
      <tr><td>Northstar</td><td>M. Chen</td><td><span class="status ok">On track</span></td><td>Today</td></tr>
      <tr><td>Field Guide</td><td>A. Singh</td><td><span class="status warn">Review</span></td><td>Yesterday</td></tr>
    </tbody></table>
  </section>
</main>${footer}`;
}

function storefront() {
  return `${topbar("Work", "Cart · 2")}
<main class="smain specimen-storefront">
  <div class="hero hero-row"><div><span class="kicker">New collection · No. 04</span><h1 class="display">Objects for daily rituals</h1></div>
    <div class="filter-field field"><span>Material: All</span><span>Sort: Featured⌄</span></div></div>
  <div class="cards product-grid">
    <article class="card product-card"><div class="media-block product-media media-a"><span>01</span></div><div class="meta">STONEWARE</div><h3 class="card-t">Field mug</h3><div class="product-foot"><strong class="price">$42</strong>${button("Add", true)}</div></article>
    <article class="card product-card"><div class="media-block product-media media-b"><span>02</span></div><div class="meta">LINEN</div><h3 class="card-t">Workshop cloth</h3><div class="product-foot"><strong class="price">$28</strong>${button("Add", true)}</div></article>
    <article class="card product-card"><div class="media-block product-media media-c"><span>03</span></div><div class="meta">BRASS</div><h3 class="card-t">Desk weight</h3><div class="product-foot"><strong class="price">$64</strong>${button("Add", true)}</div></article>
  </div>
</main>${footer}`;
}

function workflow() {
  return `${topbar("Work", "Help")}
<main class="smain specimen-workflow">
  <div class="hero hero-compact"><span class="kicker">Account setup</span><h1 class="display">Create your workspace</h1><p class="sub">A short guided workflow showing labels, fields, validation, choices, and progress.</p></div>
  <div class="stepper"><span class="on">1 Details</span><span>2 Preferences</span><span>3 Review</span></div>
  <div class="cards workflow-grid">
    <form class="card form-card"><h3 class="card-t">Workspace details</h3>
      <label class="form-field"><span>Name</span><input value="Nordwind Studio" readonly tabindex="-1"></label>
      <label class="form-field"><span>Workspace URL</span><span class="input-group"><span>studio.co/</span><input value="nordwind" readonly tabindex="-1"></span><small>Available</small></label>
      <div class="choice-row"><span class="choice checked">● Small team</span><span class="choice">○ Company</span></div>
      <div class="actions">${button("Back")}${button("Continue", true)}</div>
    </form>
    <aside class="card review-card"><div class="alert success"><strong>✓ Ready to continue</strong><span>Your workspace name and URL are valid.</span></div>
      <h3 class="card-t">Included</h3><div class="check-list"><span>✓ Shared projects</span><span>✓ Version history</span><span>✓ Team permissions</span></div>
    </aside>
  </div>
</main>${footer}`;
}

function community() {
  return `${topbar("Notes", "New post")}
<main class="smain specimen-community">
  <div class="hero hero-row"><div><span class="kicker">Community / Following</span><h1 class="display">The studio feed</h1></div><div class="chips">${chip("Following")}${chip("Discover")}</div></div>
  <div class="cards community-grid">
    <section class="card composer"><div class="person"><span class="avatar">NS</span><div><strong>Nordwind Studio</strong><span class="meta">Share an update…</span></div></div><div class="actions">${chip("Image")}${chip("Link")}${button("Post", true)}</div></section>
    <article class="card feed-card"><div class="person"><span class="avatar avatar-b">MC</span><div><strong>Mara Chen</strong><span class="meta">2 hours ago · Toronto</span></div></div>
      <p class="card-p">New field study: how small material decisions change the rhythm of a page.</p><div class="media-block feed-media"><span>Study 07</span></div><div class="reaction-row"><span>♡ 128</span><span>◯ 24</span><span>↗ Share</span></div></article>
    <aside class="card profile-card"><span class="avatar avatar-lg">AS</span><h3 class="card-t">Ari Singh</h3><p class="card-p">Type designer and patient observer.</p><div class="stat-line"><strong>4.8k</strong><span>followers</span></div>${button("Follow", true)}</aside>
  </div>
</main>${footer}`;
}

function reservation() {
  return `${topbar("Work", "My bookings")}
<main class="smain specimen-reservation">
  <div class="hero hero-compact"><span class="kicker">Toronto · September</span><h1 class="display">Book a studio session</h1>
    <div class="booking-search field"><span>Sep 18, 2026</span><span>2 guests</span>${button("Find times", true)}</div></div>
  <div class="cards reservation-grid">
    <section class="card calendar-card"><div class="panel-head"><h3 class="card-t">September</h3><span>‹ &nbsp; ›</span></div><div class="calendar"><b>M</b><b>T</b><b>W</b><b>T</b><b>F</b><b>S</b><b>S</b><span>14</span><span>15</span><span>16</span><span>17</span><span class="on">18</span><span>19</span><span>20</span></div></section>
    <section class="card slots-card"><h3 class="card-t">Available times</h3><div class="slot-list">${chip("09:30")}${chip("11:00", "on")}${chip("13:30")}${chip("15:00")}</div><p class="card-p">90-minute guided studio session.</p></section>
    <aside class="card summary-card"><div class="media-block venue-media"><span>Studio 04</span></div><h3 class="card-t">North room</h3><div class="summary-row"><span>Thu, Sep 18</span><strong>$120</strong></div>${button("Reserve", true)}</aside>
  </div>
</main>${footer}`;
}

function components() {
  return `${topbar("Work", "Close lab")}
<main class="smain specimen-components">
  <div class="hero hero-row"><div><span class="kicker">System / Component states</span><h1 class="display">Interface language</h1></div><div class="status ok"><i></i> Accessibility checks active</div></div>
  <div class="cards component-grid">
    <section class="card state-card"><h3 class="card-t">Actions &amp; selection</h3>
      <div class="actions state-actions">${button("Primary", true)}${button("Secondary")}<button class="btn btn-b" type="button" disabled tabindex="-1">Disabled</button></div>
      <div class="chips">${chip("Default")}${chip("Selected", "on")}${chip("Count 12")}</div>
      <div class="tabs"><span class="tab on">Overview</span><span class="tab">Activity</span><span class="tab">Settings</span></div>
    </section>
    <form class="card state-form"><h3 class="card-t">Form states</h3>
      <label class="form-field"><span>Email <small>Helpful context</small></span><input value="studio@example.com" readonly tabindex="-1"></label>
      <label class="form-field"><span>Focused field</span><input class="input-focus" value="Nordwind" readonly tabindex="-1"></label>
      <label class="form-field field-error"><span>Project code</span><input value="NW!" aria-invalid="true" readonly tabindex="-1"><small class="error-text">Use letters and numbers only.</small></label>
    </form>
    <section class="card feedback-card"><h3 class="card-t">Feedback &amp; progress</h3>
      <div class="alert success"><strong>&#10003; Changes saved</strong><span>Your settings are up to date.</span></div>
      <div class="alert warning"><strong>Review needed</strong><span>Two items need attention.</span></div>
      <div class="progress-label"><span>Profile completeness</span><strong>72%</strong></div><div class="progress-track"><span></span></div>
      <nav class="pagination" aria-label="Example pagination"><span>&larr;</span><span class="on">1</span><span>2</span><span>3</span><span>&rarr;</span></nav>
    </section>
  </div>
</main>${footer}`;
}

const BUILDERS = { brand, publication, knowledge, operations, storefront, workflow, community, reservation, components };

export function specimenMarkup(id, parts) {
  return (BUILDERS[id] || BUILDERS.brand)(parts);
}
