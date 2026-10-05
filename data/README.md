# Data pack — Paddock to Port

All files the page loads. Total ≈ 1.5 MB. Prepared 5 October 2026.

Every file below is a **format conversion or subset** of a published source. No values were edited, estimated or invented. Where something was corrected or set by hand, it is listed under that file.

## Which chart uses which file

| Sketch | Chart | File(s) |
|---|---|---|
| 1a | Waffle: grain types | `abares_state_crops.csv` (state = Australia, year 2026-27) |
| 2a | MAP 1 choropleth | `abs_sa2_crops_2024-25.csv` + `aus_sa2_states_2021.topojson` (object `sa2`) |
| 2b | Bars by state | `abares_winter_production.csv` |
| 3a | Radial rainfall | `bom_monthly_rainfall_4_stations.csv` |
| 3b | Rain vs yield | `bom_monthly_rainfall_4_stations.csv` + `abares_state_crops.csv` |
| 4a | Export heatmap | `abs_exports_monthly_1995-2026.csv` |
| 5a, 5b | Bars, streamgraph | `abares_winter_production.csv` |
| 6a, 6b | Bump, slope | `abares_state_crops.csv` (state = Australia) |
| 7a | MAP 2 ports | `accc_ports_2021-22.csv` + `aus_sa2_states_2021.topojson` (object `states`) |
| 7b | Used here vs exported | `abares_supply_disposal.csv` |
| 8a | MAP 3 flow | `abares_exports_by_destination.csv` + `destination_points.csv` + `world_countries_110m.json` |
| 8b | Top buyers | `abares_exports_by_destination.csv` |

---

## abares_state_crops.csv
- **Source:** ABARES, *Australian Crop Report* No. 219, September 2026 — "State Data Underpinning" (`03_AustCropRrt20260901_StateCropData_v1_0_0.xlsx`). https://www.agriculture.gov.au/abares/research-topics/agricultural-outlook/australian-crop-report/september-2026
- **Licence:** CC BY 4.0. Cite as: ABARES 2026, *Australian Crop Report: September quarter 2026*, ABARES, Canberra, DOI: https://doi.org/10.25814/5s62-8a44. CC BY 4.0.
- **How made:** the seven state/Australia sheets reshaped from wide (one column per year) to long. The flag stuck to each year label was moved into its own column.
- **Columns:** `state, season (winter|summer), crop, year (e.g. 2024-25), year_start, status (final|estimate|forecast), area_kha ('000 ha), production_kt`
- **Notes:** 1989-90 to 2026-27. `estimate` = ABARES "s", `forecast` = "f" (2026-27). Yield = production ÷ area planted (ABARES's own definition): compute it in the spec. Cotton area is harvested area. Includes cotton lint, which is not a grain: filter it out.

## abares_winter_production.csv
- **Source:** same report, "Crop Data Underpinning", Table 1 *Winter crop production, Australia, 1989–90 to 2026–27*.
- **How made:** wide to long.
- **Columns:** `year, year_start, status, region (state or Australia), production_kt`

## abares_supply_disposal.csv
- **Source:** same workbook, Tables 15 (wheat, canola, pulses) and 16 (coarse grains).
- **How made:** wide to long; sub-rows kept as `sub_item` (e.g. domestic use → seed / other; barley exports → feed / malting).
- **Columns:** `crop, marketing_year, item (production|domestic_use|exports|imports), sub_item, year, year_start, status, kt`
- **Notes:** ⚠ **Marketing years, not financial years:** wheat Oct–Sep; canola, pulses, barley, oats, triticale Nov–Oct; sorghum, maize Mar–Feb. ABARES: not comparable with financial-year export figures. Domestic use is calculated by ABARES as a residual. Runs to 2024-25.

## abares_exports_by_destination.csv
- **Source:** ABARES, *Agricultural Commodity Statistics 2024–25* — wheat, coarse grains and oilseeds tables (`21_…Wheat…`, `04_…CoarseGrains…`, `16_…Oilseeds…`). https://www.agriculture.gov.au/abares/research-topics/agricultural-commodities/agricultural-commodities-trade-data
- **Licence:** check the copyright note on that page (past ABARES releases are CC BY 4.0).
- **How made:** export-by-destination columns (financial year, kt) for wheat, barley and canola, reshaped to long. Added `map_name` so destinations join to `world_countries_110m.json`; three renamed: "Korea Republic of" → South Korea, "Iran, Islamic Republic of" → Iran, "Tanzania, United Republic of" → Tanzania.
- **Columns:** `crop, year, year_start, destination, export_kt, map_name`
- **Notes:** `destination = World` is the total. Listed destinations cover 94% (wheat), 95% (barley) and 100% (canola, incl. "Other") of 2024-25 exports. "Other" and "Former Sudan" have no `map_name`. Years go back to the late 1980s; not every destination has every year.

## destination_points.csv
- **Source:** Natural Earth (public domain) via the `world-atlas` package, 110m countries; Singapore from Natural Earth 10m populated places (too small for the 110m map).
- **How made:** one interior point per country (`mapshaper -points inner`), used as the end of each flow line. Australia's point is the start.
- **Columns:** `map_name, lat, lon, source`

## world_countries_110m.json
- **Source:** `world-atlas` 2.0.2 `countries-110m.json` (Natural Earth, public domain; package ISC licence). https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
- **How made:** copied unchanged. Object `countries`, property `name`.

## abs_sa2_crops_2024-25.csv
- **Source:** ABS, *Australian Agriculture: Broadacre Crops, 2024–25*, Data Explorer dataflow AG_BROADACRE. https://www.abs.gov.au/statistics/industry/agriculture/australian-agriculture-broadacre-crops/latest-release
- **Licence:** CC BY 4.0.
- **How made:** filtered export (2024-25; total crop area and levied production) → one row per SA2 and crop, with area and production side by side; sugarcane and cotton dropped (not grain); state added from the first digit of the SA2 code.
- **Columns:** `year, sa2_code, sa2_name, state, crop, area_ha, production_t`
- **Notes:** 386 SA2s. SA2s not listed grew none of these crops. SA2 wheat sums to the published national total (34,779,179 t). Production is **levied** production geocoded to the **business address** — caption it. Griffith rice has area 0 and production 0: guard the yield division.

## abs_exports_monthly_1995-2026.csv
- **Source:** ABS, *International Trade in Goods*, Data Explorer — merchandise exports by SITC; country = Total, state = Total.
- **How made:** label columns dropped.
- **Columns:** `month (YYYY-MM), sitc (041 wheat, 043 barley, 222 oilseeds), commodity, value_aud_thousands`
- **Notes:** A$ thousands, not adjusted for inflation. SITC 222 includes canola plus other oilseeds (e.g. cotton seed). Jul 1995 – Aug 2026.

## accc_ports_2021-22.csv and accc_port_facilities_2021-22.csv
- **Source:** ACCC, *Bulk grain ports monitoring report – data update 2021–22*, Appendix 1 supplementary spreadsheet, Supplementary Tables 4.4, 5.4, 6.4, 7.4, 8.4. https://www.accc.gov.au/about-us/publications/serial-publications/bulk-grain-ports-monitoring-reports/bulk-grain-ports-monitoring-report-data-update-2021-22
- **Licence:** CC BY 3.0 AU.
- **How made:** the 2021-22 column of each facility × crop table. Facilities summed by port town for the map.
- **Corrections (all listed in the `note` column):** dropped the Vic column "Riordan (Geelong and Portland)", which double-counts the two Riordan columns; relabelled "Pineknba BCS" → Pinkenba BCS and "Wagner BCS" → Pinkenba Wagner; four cells printed "<0.01" set to 0; "Graincorp" → GrainCorp.
- **Check:** state sums match the report (WA 18.18, SA 7.21, Vic 6.05, NSW 6.22 vs 6.23 rounding, Qld 2.91 vs 2.90); national 40.57 Mt.
- **Coordinates** (`lat, lon, coord_source`): Natural Earth 10m ports for 15 ports; Natural Earth populated places for Kwinana and Wallaroo; Wikipedia for Port Giles and Lucky Bay; Flinders Port Holdings for Thevenard.
- **Notes:** bulk ship exports only (no containers), **Oct 2021 – Sep 2022 shipping year**, the last year the ACCC published. Port Pirie shipped nothing (`active_2021_22 = false`).

## bom_monthly_rainfall_4_stations.csv
- **Source:** Bureau of Meteorology, Climate Data Online, monthly rainfall (product IDCJAC0001): stations 010092 Merredin, 016055 Minnipa, 078010 Horsham, 053018 Moree. http://www.bom.gov.au/climate/data/
- **Licence:** © Commonwealth of Australia, Bureau of Meteorology. Study use permitted; acknowledge the Bureau.
- **How made:** the four `_Data1.csv` files stacked, with town and state added.
- **Columns:** `station, town, state, year, month, rain_mm, quality (Y = quality-checked, N = not yet)`
- **Notes:** gaps exist. For April–October totals, count the months and keep only years with all 7 (drops Moree 2017; Horsham 1994, 2001, 2003). Season year Y matches ABARES crop year Y–(Y+1).

## aus_sa2_states_2021.topojson
- **Objects:** `sa2` (2,450 SA2s; properties `code, name, state`) and `states` (8 outlines dissolved from the SA2s).
- **⚠ Provisional:** built from a public mirror of the ABS ASGS 2021 SA2 boundaries (`absmapsdata`, already simplified). **Before submitting, rebuild from the official ABS file** so the provenance is clean:
  1. Download https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files/SA2_2021_AUST_SHP_GDA2020.zip (CC BY 4.0) and unzip.
  2. Run (adjust the 3% until the file is ~600 KB):
  ```
  mapshaper SA2_2021_AUST_GDA2020.shp \
    -filter '["Other Territories","Outside Australia"].indexOf(STE_NAME21) == -1' \
    -filter remove-empty \
    -filter-fields SA2_CODE21,SA2_NAME21,STE_NAME21 \
    -rename-fields code=SA2_CODE21,name=SA2_NAME21,state=STE_NAME21 \
    -simplify 3% weighted keep-shapes -rename-layers sa2 \
    -dissolve state copy-fields=state + name=states \
    -o format=topojson quantization=1e5 target=sa2,states aus_sa2_states_2021.topojson
  ```
- **Projection** (set in each spec, not in the file): `{"type":"conicEqualArea","rotate":[-132,0],"parallels":[-18,-36]}`.
