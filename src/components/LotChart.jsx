import React, { useState, useEffect, use, useRef } from "react";
import { MyContext } from "../App";
import {
  generateLotData,
  NumberOfLotsByStatus,
  totalNumberOfLots,
  zoomToLayer,
} from "../Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { lotLayer } from "../layers";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";

import { CalcitePanel } from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/components/calcite-panel";

/// Dispose function
function maybeDisposeRoot(divId) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

export default function LotChart() {
  const chartID = "lotPieChart";

  // useRef hook is used to persist values across renders without
  // causing a re-render (mutable values)
  const pieSeriesRef = useRef({});
  const legendRef = useRef({});
  const chartRef = useRef({});

  const arcgisMap = document.querySelector("arcgis-map");
  const { municipals, barangays } = use(MyContext);
  const [totalNumber, setTotalNumber] = useState();
  const [chartData, setChartData] = useState([]);

  // Statistics when you first open.
  useEffect(() => {
    // Calculate summary statistics
    totalNumberOfLots().then((response) => {
      setTotalNumber(response);
    });

    generateLotData().then((response) => {
      setChartData(response[1]);
    });
  }, []);

  // Query
  const queryMunicipality = `Municipality = '${municipals}'`;
  const queryBarangay = `Barangay = '${barangays}'`;
  if (!municipals) {
    lotLayer.definitionExpression = "1=1";
  } else if (municipals && !barangays) {
    lotLayer.definitionExpression = queryMunicipality;
  } else if (municipals && barangays) {
    lotLayer.definitionExpression = queryMunicipality + " AND " + queryBarangay;
  }

  useEffect(() => {
    // Sample filtering

    // Zoom to filtered lot
    zoomToLayer(lotLayer, arcgisMap);

    // Calculate summary statistics
    totalNumberOfLots(municipals, barangays).then((response) => {
      setTotalNumber(response);
    });

    generateLotData(municipals, barangays).then((response) => {
      setChartData(response[1]);
    });
  }, [municipals, barangays]);

  useEffect(() => {
    // Dispose or reset chartID
    maybeDisposeRoot(chartID);

    // Define root
    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );
    chartRef.current = chart;

    // Create series
    var pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        //legendLabelText: "[{fill}]{category}[/]",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 1.8,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);
    pieSeries.data.setAll(chartData);

    // Properties: color, stroke, tootip text for slices
    pieSeries.slices.template.setAll({
      toggleKey: "none",
      fillOpacity: 0.9,
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5,
      strokeOpacity: 1,
      templateField: "sliceSettings",
      tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
    });

    // Disabling labels and ticksll
    pieSeries.labels.template.set("visible", false);
    pieSeries.ticks.template.set("visible", false);

    // Legend
    // var legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.percent(50),
    //     x: am5.percent(50),
    //     // scale: 0.9,
    //   })
    // );
    // legendRef.current = legend;
    // legend.data.setAll(pieSeries.dataItems);

    // // Change the size of legend markers
    // legend.markers.template.setAll({
    //   width: 18,
    //   height: 18,
    // });

    // // Change the marker shape
    // legend.markerRectangles.template.setAll({
    //   cornerRadiusTL: 10,
    //   cornerRadiusTR: 10,
    //   cornerRadiusBL: 10,
    //   cornerRadiusBR: 10,
    // });

    // legend.labels.template.setAll({
    //   oversizedBehavior: "truncate",
    //   fill: am5.color("#ffffff"),
    //   width: 250,
    //   maxWidth: 270,
    // });

    // legend.valueLabels.template.setAll({
    //   textAlign: "right",
    //   fill: am5.color("#ffffff"),
    // });

    // legend.itemContainers.template.setAll({
    //   paddingTop: 3,
    //   paddingBottom: 1,
    // });

    return () => {
      root.dispose();
    };
  }, [chartID, chartData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data?.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <CalcitePanel
        slot="panel-end"
        scale="s"
        style={{
          width: "35vw",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 3.5,
          borderLeftWidth: 3.5,
          borderBottomWidth: 4.5,
          borderColor: "#555555",
        }}
      >
        <div style={{ fontSize: "50px", color: "white" }}>{totalNumber}</div>
        <div
          id={chartID}
          style={{
            // width: chart_width,
            height: "60vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginTop: "8%",
            marginBottom: "7px",
          }}
        ></div>
      </CalcitePanel>
    </>
  );
}
