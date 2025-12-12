import React, { useState, useEffect, use } from "react";
import Select from "react-select";
import { lotLayer } from "../layers";
import { MyContext } from "../App";
import GenerateDropdownData from "npm-dropdown-package";

// Use one component
export default function DropdownContext() {
  const { updateMunicipals, updateBarangays } = use(MyContext);
  const [municipal, setMunicipal] = useState<any>();
  const [municipalSelected, setMunicipalSelected] = useState<any>(null);
  const [barangaySelected, setBarangaySelected] = useState(null);
  const [barangayList, setBarangayList] = useState<any>([]);

  useEffect(() => {
    const dropdownData = new GenerateDropdownData(
      [lotLayer],
      ["Municipality", "Barangay"]
    );

    dropdownData.dropDownQuery().then((response: any) => {
      setMunicipal(response);
    });
  }, []);

  const handleMunicipalityChange = (obj: any) => {
    // console.log(obj);
    setMunicipalSelected(obj);
    updateMunicipals(obj.field1);
    updateBarangays(undefined);
    setBarangayList(obj.field2);
    setBarangaySelected(null);
  };

  const handleBarangayChange = (obj: any) => {
    console.log(obj);
    setBarangaySelected(obj);
    updateBarangays(obj.name);
  };

  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "auto" }}>
      <span style={{ color: "white", paddingRight: "5px", margin: "auto" }}>
        Municipality
      </span>
      <Select
        value={municipalSelected}
        options={municipal} // initial items in the dropdown
        onChange={handleMunicipalityChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <span
        style={{
          color: "white",
          paddingLeft: "5px",
          paddingRight: "5px",
          margin: "auto",
        }}
      >
        Barangay
      </span>
      <Select
        value={barangaySelected} // Dictates names appearing on the dropdown
        options={barangayList} // initial items in the dropdown
        onChange={handleBarangayChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}

// Use two components
// export default function DropdownData() {
//   const { updateMunicipals } = use(MyContext);
//   const [selectedMunicipality, setSelectedMunicipality] = useState<any>(null);
//   const [municipal, setMunicipal] = useState<any>([]);

//   useEffect(() => {
//     const dropdownData = new DropDownData({
//       featureLayers: [lotLayer],
//       fieldNames: ["Municipality"],
//     });

//     dropdownData.dropDownQuery().then((response: any) => {
//       setMunicipal(response);
//     });
//   }, []);

//   const handleMunicipalityChange = (obj: any) => {
//     setSelectedMunicipality(obj);
//     updateMunicipals(obj.field1);
//   };

//   return (
//     <>
//       <DropdownListDisplay
//         selectedMunicipality={selectedMunicipality}
//         municipal={municipal}
//         handleMunicipalityChange={handleMunicipalityChange}
//       ></DropdownListDisplay>
//     </>
//   );
// }

// export function DropdownListDisplay({
//   selectedMunicipality,
//   municipal,
//   handleMunicipalityChange,
// }: any) {
//   return (
//     <div style={{ display: "flex", flexDirection: "row", margin: "auto" }}>
//       <Select
//         value={selectedMunicipality}
//         options={municipal} // initial items in the dropdown
//         onChange={handleMunicipalityChange}
//         getOptionLabel={(x: any) => x.field1}
//       />
//     </div>
//   );
// }
