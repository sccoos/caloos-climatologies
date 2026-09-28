---
sql:
  shore_station_climatology: ./data/shore_station_anomaly/shore_station_climatology.parquet
---

```js
//import {renderENSOAlertCard} from "./components/ENSOAlertCard.js";
import {renderLoadingSpinner} from "./components/LoadingSpinner.js";
import {renderMHWMap} from "./components/MHW-Map.js";
import {renderSelectableWaterTemperatureClimatology} from "./components/WaterTemperatureClimatologies.js";

const page = document.createElement("div");
page.className = "dashboard-page dashboard-page--loading";
const loadingSpinner = renderLoadingSpinner({label: "Loading dashboard data"});
page.append(loadingSpinner);
display(page);

const [ensoAlertStatus, maplibreWorkerUrl, shoreStationManifest, shoreStationRows] = await Promise.all([
  FileAttachment("data/ENSO_alert_status.json").json(),
  FileAttachment("data/maplibre-gl-worker.bundle.js").url(),
  FileAttachment("data/shore_station_anomaly/manifest.json").json(),
  sql`SELECT * FROM shore_station_climatology`
]);
//const ensoAlertCard = renderENSOAlertCard(ensoAlertStatus);
const shoreStationRowsByKey = Object.groupBy(shoreStationRows, (row) => row.station_key);
const shoreStationOptions = shoreStationManifest.stations
  .map((station) => ({
    key: station.station_key,
    name: station.name,
    type: station.type,
    latitude: station.latitude,
    source_url: station.source_url,
    historical_climatology_start_year: station.historical_climatology_start_year,
    historical_climatology_end_year: station.historical_climatology_end_year,
    current_year_days_exceeding_historical_max: station.current_year_days_exceeding_historical_max,
    current_year_days_exceeding_historical_p90: station.current_year_days_exceeding_historical_p90
  }))
  .filter((station) => shoreStationRowsByKey[station.key]?.length);
const requestedSiteName = (new URLSearchParams(location.search).get("site") ?? "")
  .trim()
  .replace(/^["']|["']$/g, "")
  .toLocaleLowerCase();
const initialStationKey = shoreStationOptions.find(
  (station) => station.name.toLocaleLowerCase() === requestedSiteName
)?.key ?? "humboldt";
const stationMap = renderMHWMap({
  title: "Observations Map",
  stations: shoreStationManifest.stations,
  initialStationKey,
  workerUrl: maplibreWorkerUrl,
  onStationSelect: (stationKey) => {
    shoreStationClimatologyPlot.setStationKey?.(stationKey);
  }
});
const shoreStationClimatologyPlot = renderSelectableWaterTemperatureClimatology({
  stationRowsByKey: shoreStationRowsByKey,
  stationOptions: shoreStationOptions,
  initialStationKey,
  onStationChange: (stationKey) => {
    stationMap.flyToStation?.(stationKey);
    const station = shoreStationOptions.find((option) => option.key === stationKey);
    if (station) {
      const url = new URL(location.href);
      url.searchParams.set("site", station.name);
      history.replaceState({}, "", url);
    }
  }
});

// const cardPane = document.createElement("div");
// cardPane.className = "dashboard-card-pane";
// cardPane.append(ensoAlertCard);

const mapPane = document.createElement("div");
mapPane.className = "dashboard-map-pane";
mapPane.append(stationMap);

const plotPane = document.createElement("div");
plotPane.className = "dashboard-plot-pane";
plotPane.append(shoreStationClimatologyPlot);

page.classList.remove("dashboard-page--loading");
loadingSpinner.dispose?.();
page.replaceChildren(mapPane, plotPane);
```
