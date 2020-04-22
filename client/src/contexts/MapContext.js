import React, { createContext, useState } from "react";

export const MapContext = createContext();

const MapContextProvider = props => {
  const [mapPlace, setMapPlace] = useState({
    city: "",
    country: "",
    latitude: 0,
    longitude: 0
  });

  return (
    <MapContext.Provider value={{ mapPlace, setMapPlace }}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapContextProvider;
