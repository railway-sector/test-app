import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
});

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "17cbb2b9a0b94ee582c14ac588881eeb",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Land Acquisition",

  elevationInfo: {
    mode: "on-the-ground",
  },
});
