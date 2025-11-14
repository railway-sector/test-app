import { useEffect, useState } from "react";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import { chainageLayer, lotLayer } from "../layers";
import "../index.css";
import "../App.css";

function MapDisplay() {
  const [mapView, setMapView] = useState();
  const arcgisMap = document.querySelector("arcgis-map");

  useEffect(() => {
    if (mapView) {
      // arcgisMap.map.add(chainageLayer);
      arcgisMap.map.add(lotLayer);
      arcgisMap.view.ui.components = [];
    }
  });

  return (
    <arcgis-map
      basemap="dark-gray-vector"
      zoom="10"
      center="120.99, 14.4"
      onarcgisViewReadyChange={(event) => {
        setMapView(event.target);
      }}
    ></arcgis-map>
  );
}

export default MapDisplay;
