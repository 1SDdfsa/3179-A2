/* ============================================================
   Paddock to Port — embeds every chart on the page.
   One Vega-Lite spec per chart lives in specs/; this file
   loads each one into its <div> with a shared look.
   ============================================================ */

// Shared look for every chart: fonts, text colours, axes, legends.
// Matches style.css so the charts and the page read as one.
const VEGA_CONFIG = {
  background: null,                 // let the page colour show through
  // Font names are quoted: "Source Sans 3" ends in a number, and the canvas Vega
  // uses to measure text rejects it unquoted (labels would then overlap).
  font: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif",
  padding: 4,
  view: { stroke: null },           // no box around each chart
  text: { color: "#222", fontSize: 13 },
  title: {
    color: "#222",
    fontSize: 16,
    fontWeight: 600,
    anchor: "start",
    subtitleColor: "#555",
    subtitleFontSize: 13
  },
  axis: {
    labelColor: "#555",
    labelFontSize: 12,
    titleColor: "#222",
    titleFontSize: 13,
    titleFontWeight: 600,
    domainColor: "#999",
    tickColor: "#999",
    gridColor: "#E6E3DC"
  },
  legend: {
    labelColor: "#222",
    labelFontSize: 13,
    titleColor: "#222",
    titleFontSize: 13,
    titleFontWeight: 600
  },
  header: {
    labelColor: "#222",
    labelFontSize: 13,
    titleColor: "#222"
  }
};

const EMBED_OPTIONS = {
  renderer: "svg",     // crisp at any zoom; web fonts render correctly
  actions: false,      // no "..." menu on the page
  config: VEGA_CONFIG
};

// One line per chart: which <div> it goes in, and which spec file.
// Add each new chart here as it is built.
const CHARTS = [
  { el: "#chart-1a", spec: "specs/1a_grain_mix_waffle.vg.json" },
  { el: "#chart-2a", spec: "specs/2a_map1_wheat_choropleth.vg.json" },
  { el: "#chart-2b", spec: "specs/2b_state_winter_bars.vg.json" },
  { el: "#chart-3a", spec: "specs/3a_rain_radial.vg.json" },
  { el: "#chart-3b", spec: "specs/3b_rain_yield_scatter.vg.json" }
  // { el: "#chart-4a", spec: "specs/4a_export_month_heatmap.vg.json" },
  // { el: "#chart-5a", spec: "specs/5a_winter_crop_bars.vg.json" },
  // { el: "#chart-5b", spec: "specs/5b_state_streamgraph.vg.json" },
  // { el: "#chart-6a", spec: "specs/6a_crop_rank_bump.vg.json" },
  // { el: "#chart-6b", spec: "specs/6b_crop_area_slope.vg.json" },
  // { el: "#chart-7a", spec: "specs/7a_map2_port_symbols.vg.json" },
  // { el: "#chart-7b", spec: "specs/7b_wheat_use_vs_export.vg.json" },
  // { el: "#chart-8a", spec: "specs/8a_map3_export_flows.vg.json" },
  // { el: "#chart-8b", spec: "specs/8b_top_wheat_buyers.vg.json" }
];

// Keep each chart's Vega view, so later charts can talk to each other
// (e.g. click a state in 2b to highlight it on Map 1).
const views = {};

function embedChart({ el, spec }) {
  const target = document.querySelector(el);
  if (!target) return Promise.resolve();
  target.classList.remove("chart--todo");

  return vegaEmbed(el, spec, EMBED_OPTIONS)
    .then((result) => { views[el] = result.view; })
    .catch((err) => {
      console.error(`Chart ${el} (${spec}) failed:`, err);
      const hint = location.protocol === "file:"
        ? " The page was opened as a file. Run a local server (e.g. <code>python -m http.server</code>) and open <code>http://localhost:8000</code> instead."
        : "";
      target.innerHTML = `<p class="chart-error">This chart could not load (${spec}).${hint}</p>`;
    });
}

// ---------- Links between charts ----------

// 2b -> 2a: clicking a state's bar highlights that state on Map 1.
// 2b's click selection "pick_state" holds e.g. {region: ["Western Australia"]},
// or nothing when cleared; Map 1 has a plain parameter "focus_state".
function linkStateBarsToMap() {
  const bars = views["#chart-2b"];
  const map = views["#chart-2a"];
  if (!bars || !map) return;

  bars.addSignalListener("pick_state", (_name, value) => {
    const picked = value && value.region && value.region.length ? value.region[0] : null;
    map.signal("focus_state", picked).runAsync();
  });
}

// Wait for the web fonts first, so Vega measures text with the right font.
document.fonts.ready
  .then(() => Promise.all(CHARTS.map(embedChart)))
  .then(linkStateBarsToMap);
