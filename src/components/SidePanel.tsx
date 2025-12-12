import "@esri/calcite-components/dist/components/calcite-tabs";
import "@esri/calcite-components/dist/components/calcite-tab";
import "@esri/calcite-components/dist/components/calcite-tab-nav";
import "@esri/calcite-components/dist/components/calcite-tab-title";
import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteTab,
  CalciteTabs,
  CalciteTabNav,
  CalciteTabTitle,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import LotChart from "./LotChart";
import ExpropriationList from "./ExpropriationList";

export default function SidePanel() {
  const [chartTabName, setChartTabName] = useState("Land");
  return (
    <>
      <CalciteTabs
        slot="panel-end"
        layout="center"
        scale="l"
        style={{
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          // borderTopWidth: 5,
          borderColor: "#555555",
          width: "40%",
        }}
      >
        <CalciteTabNav
          slot="title-group"
          id="thetabs"
          onCalciteTabChange={(event: any) =>
            setChartTabName(event.srcElement.selectedTitle.className)
          }
        >
          <CalciteTabTitle class="Land">Land</CalciteTabTitle>
          <CalciteTabTitle class="ExproList">ExproList</CalciteTabTitle>
        </CalciteTabNav>
        <CalciteTab>
          <LotChart />
        </CalciteTab>
        <CalciteTab>
          <ExpropriationList />
        </CalciteTab>
      </CalciteTabs>
    </>
  );
}
