import React, { createContext, useState, useEffect } from "react";
import {
  getProvinces,
  getCountries,
  getWorldwide
} from "../services/covid19UpToDate.api";

export const UpToDateDataContext = createContext();

const UpToDateDataContextProvider = props => {
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [worldwide, setWorldwide] = useState({});

  useEffect(() => {
    getProvinces().then(provinces => {
      setProvinces(provinces);
      const countries = getCountries(provinces);
      setCountries(countries);
      const worldwide = getWorldwide(countries);
      setWorldwide(worldwide);
    });
  }, []);

  return (
    <UpToDateDataContext.Provider value={{ provinces, countries, worldwide }}>
      {props.children}
    </UpToDateDataContext.Provider>
  );
};

export default UpToDateDataContextProvider;
