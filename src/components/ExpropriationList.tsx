import { use, useEffect, useState } from "react";
import { lotLayer } from "../layers";
import Query from "@arcgis/core/rest/support/Query";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-chip";
import "@esri/calcite-components/dist/components/calcite-avatar";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteList,
  CalciteListItem,
  CalciteChip,
  CalciteAvatar,
} from "@esri/calcite-components-react";
import { MyContext } from "../App";

// General Steps:
// 1. Call 'MyContext'
// 2. Add queries for municipality, barangay, and status (for expropriation)
// 3. Add queryFeatures using the defined quries
// 4. Create useState to store information using queryFeatures
// 5. Transfer the stored information to CalciteListItem

const ExpropriationList = () => {
  const { municipals, barangays } = use(MyContext);

  const municipal = municipals;
  const barangay = barangays;

  // Obtain Status number for 'For Expropriation'

  const [exproItem, setExproItem] = useState<undefined | any>();
  const queryMunicipality = `"Municipality" = '` + municipal + "'";
  const queryBarangay = `"Barangay" = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  // const queryExpro = `${lotStatusField} = 7`;
  const queryExpro = `"StatusLA" = 7`;

  useEffect(() => {
    setExproItem([]);
    var query = lotLayer.createQuery();
    query.outFields = ["*"];
    if (!municipal) {
      query.where = queryExpro;
    } else if (municipal && !barangay) {
      query.where = queryMunicipality + " AND " + queryExpro;
    } else if (barangay) {
      query.where = queryMunicipalBarangay + " AND " + queryExpro;
    }

    query.returnGeometry = true;
    lotLayer.queryFeatures(query).then((result: any) => {
      // eslint-disable-next-line array-callback-return
      result.features.map((feature: any, index: any) => {
        const attributes = feature.attributes;
        const lotid = attributes["LotID"];
        const cp = attributes["CP"];
        const municipal = attributes["Municipality"];
        const landowner = attributes["LandOwner"];
        const objectid = attributes.OBJECTID;
        const id = index;

        setExproItem((prev: any) => [
          ...prev,
          {
            id: id,
            lotid: lotid,
            landowner: landowner,
            municipality: municipal,
            cp: cp,
            objectid: objectid,
          },
        ]);
      });
    });
  }, [municipal, barangay]);

  // The code below demonstrates why we need the code.
  // useEffect(() => {
  //   if (exproItem) {
  //     // If we just use exproItem, we have duplicated listem items (?).
  //     // The code below simply avoids this.
  //     const test = exproItem.filter(
  //       (ele: any, ind: any) =>
  //         ind ===
  //         exproItem.findIndex((elem: any) => elem.objectid === ele.objectid)
  //     );
  //     console.log(test);
  //   }
  // });

  return (
    <>
      <CalciteList
        id="result-list"
        label="exproListLabel"
        displayMode="nested"
        style={{ width: "26vw" }}
      >
        {/* {exproItem && // Extract unique objects from the array
          exproItem
            .filter(
              (ele: any, ind: any) =>
                ind ===
                exproItem.findIndex(
                  (elem: any) => elem.objectid === ele.objectid
                )
            )
            .map((result: any, index: any) => {
              return (
                // need 'key' to upper div and inside CalciteListItem
                <CalciteListItem
                  key={result.id}
                  expanded
                  label={result.lotid}
                  description={result.landowner}
                  value={result.objectid}
                  selected={undefined}
                  // onCalciteListItemSelect={(event: any) =>
                  //   resultClickHandler(event)
                  // }
                >
                  <CalciteChip
                    value={result.cp}
                    slot="content-end"
                    scale="s"
                    id="exproListChip"
                  >
                    <CalciteAvatar
                      full-name={result.municipality}
                      scale="s"
                    ></CalciteAvatar>
                    {result.cp}
                  </CalciteChip>
                </CalciteListItem>
              );
            })} */}
      </CalciteList>
    </>
  );
};

export default ExpropriationList;
