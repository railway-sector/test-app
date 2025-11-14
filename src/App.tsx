import "./index.css";
import "./App.css";

import MapDisplay from "./components/MapDisplay";
import Header from "./components/Header";
import { CalciteShell } from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/components/calcite-shell";
import React, { createContext, useState, useEffect } from "react";
import LotChart from "./components/LotChart";

type MyDropdownContextType = {
  municipals: any;
  updateMunicipals: any;
  barangays: any;
  updateBarangays: any;
};

const initialState = {
  municipals: undefined,
  updateMunicipals: undefined,
  barangays: undefined,
  updateBarangays: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState, // instead of defining initial value for each, ... means all.
});

function App() {
  const [municipals, setMunicipals] = useState<any>(); // note to use the same name 'municipals' defined above.
  const updateMunicipals = (newMunicipal: any) => {
    setMunicipals(newMunicipal);
  };

  const [barangays, setBarangays] = useState<any>();
  const updateBarangays = (newBarangay: any) => {
    setBarangays(newBarangay);
  };

  return (
    <>
      <CalciteShell>
        {/* Include components where you want to fetch information inside MyContext */}

        <MyContext
          value={{ municipals, updateMunicipals, barangays, updateBarangays }}
        >
          <MapDisplay />
          <Header />
          <LotChart />
        </MyContext>
      </CalciteShell>
    </>
  );
}

export default App;
