import { lotLayer } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";

// Create data for chart
const lotStausLabel = [
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Buy",
  "For Notice of Taking",
  "With PTE",
  "For Expropriation",
  "Harmonized",
];

export const lotStatusColor = [
  "#00734d",
  "#0070ff",
  "#ffff00",
  "#ffaa00",
  "#FF5733",
  "#70AD47",
  "#FF0000",
  "#B2B2B2",
];
export const lotStatusQuery = lotStausLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: lotStatusColor[index],
  });
});

// 1. One queryFeature in one funcion
export async function totalNumberOfLots(municipals: any, barangays: any) {
  var total_lot_number = new StatisticDefinition({
    onStatisticField: "CASE WHEN LotID IS NOT NULL THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lot_number",
    statisticType: "sum", // use 'sum' when onStatisticField is 'CASE WHEN...'
  });

  var query = new Query();
  query.outFields = ["Municipality", "Barangay", "StatusLA"];
  const queryMunicipality = `Municipality = '${municipals}'`;
  const queryBarangay = `Barangay = '${barangays}'`;

  if (!municipals) {
    query.where = "1=1";
  } else if (municipals && !barangays) {
    query.where = queryMunicipality;
  } else if (municipals && barangays) {
    query.where = queryMunicipality + " AND " + queryBarangay;
  }

  query.outStatistics = [total_lot_number];
  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const total = stats.total_lot_number;
    return total;
  });

  // return total_lot;
}

// export async function NumberOfLotsByStatus() {
//   var total_lot_number = new StatisticDefinition({
//     onStatisticField: "CASE WHEN LotID IS NOT NULL THEN 1 ELSE 0 END",
//     outStatisticFieldName: "total_lot_number",
//     statisticType: "sum", // use 'sum' when onStatisticField is 'CASE WHEN...'
//   });

//   var query = new Query();
//   query.where = "StatusLA IS NOT NULL";
//   query.outFields = ["StatusLA"];
//   query.outStatistics = [total_lot_number];
//   query.orderByFields = ["StatusLA"];
//   query.groupByFieldsForStatistics = ["StatusLA"];

//   const total_lot_number_status = lotLayer
//     .queryFeatures(query)
//     .then((response: any) => {
//       var stats = response.features;
//       return stats.map((result: any) => {
//         const attributes = result.attributes;
//         const status_id = attributes["StatusLA"]; // attributes.StatusLA;
//         const count = attributes.total_lot_number;
//         return Object.assign({
//           category: lotStausLabel[status_id - 1],
//           value: count,
//         });
//       });
//     });

//   return total_lot_number_status;
// }

// 2. Multiple queryFeatures in one function
/// 'async' secures a task without disrupting or halting other main operations in progress.
/// Adding 'async' before function has two primary purposes:

/// A. It makes the function always return a Promise:
///    This means it allows us to generateLotData.then((response: any) => {})

/// B. It enables the use of the 'await' keyword inside the function:
///    'await' pauses the execution of the aysnc function until a Promise is resolved.
///    For example, 'await' pauses each of the following queries until its Promise is resolved.

export async function generateLotData(municipals: any, barangays: any) {
  const queryMunicipality = `Municipality = '${municipals}'`;
  const queryBarangay = `Barangay = '${barangays}'`;
  const queryField = "StatusLA IS NOT NULL";

  // Total number of lots
  var total_lot_number = new StatisticDefinition({
    onStatisticField: "CASE WHEN LotID IS NOT NULL THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lot_number",
    statisticType: "sum", // use 'sum' when onStatisticField is 'CASE WHEN...'
  });

  var query0 = new Query();

  if (!municipals) {
    query0.where = queryField;
  } else if (municipals && !barangays) {
    query0.where = queryField + " AND " + queryMunicipality;
  } else if (municipals && barangays) {
    query0.where =
      queryField + " AND " + queryMunicipality + " AND " + queryBarangay;
  }

  query0.outStatistics = [total_lot_number];
  const total_lot = lotLayer.queryFeatures(query0).then((response: any) => {
    var stats = response.features[0].attributes;
    const total = stats.total_lot_number;
    return total;
  });

  // Total number of lots for each LA status

  var total_lot_status = new StatisticDefinition({
    onStatisticField: "StatusLA",
    outStatisticFieldName: "total_lot_status",
    statisticType: "count", // use 'count' when onStatisticField is just field name.
  });

  var query1 = new Query();
  if (!municipals) {
    query1.where = queryField;
  } else if (municipals && !barangays) {
    query1.where = queryField + " AND " + queryMunicipality;
  } else if (municipals && barangays) {
    query1.where =
      queryField + " AND " + queryMunicipality + " AND " + queryBarangay;
  }
  query1.outFields = ["StatusLA"];
  query1.outStatistics = [total_lot_status];
  query1.orderByFields = ["StatusLA"];
  query1.groupByFieldsForStatistics = ["StatusLA"];

  const total_lot_number_status = lotLayer
    .queryFeatures(query1)
    .then((response: any) => {
      var stats = response.features;
      return stats.map((result: any) => {
        const attributes = result.attributes;
        const status_id = attributes["StatusLA"];
        const count = attributes.total_lot_status;
        return Object.assign({
          category: lotStausLabel[status_id - 1],
          value: count,
        });
      });
    });

  const totalLot = await total_lot;
  const totalLotStatus = await total_lot_number_status;

  return [totalLot, totalLotStatus];
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch(function (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}
