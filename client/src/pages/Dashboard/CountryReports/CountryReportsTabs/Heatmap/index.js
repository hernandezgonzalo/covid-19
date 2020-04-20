import React, { useContext } from "react";
import { useTheme, Box, CircularProgress } from "@material-ui/core";
import { UpToDateDataContext } from "../../../../../contexts/UpToDateDataContext";
import _ from "lodash";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import lightMode from "./lightmode";
import darkMode from "./darkmode";

const libraries = ["visualization"];

export const Heatmap = ({ currentView }) => {
  const { provinces } = useContext(UpToDateDataContext);
  const theme = useTheme();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  let viewProvinces = provinces.filter(
    province => province.countryRegion === currentView.countryRegion
  );
  if (_.isEmpty(viewProvinces)) viewProvinces = provinces;
  const worldView = viewProvinces === provinces;

  const mapOptions = {
    zoom: worldView ? 2 : 4,
    center: worldView
      ? { lat: 20, lng: 2 }
      : { lat: viewProvinces[0].lat, lng: viewProvinces[0].long },
    styles: theme.palette.type === "dark" ? darkMode : lightMode,
    streetViewControl: false,
    mapTypeControl: false,
    controlSize: 25
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <Box
      height={1}
      width={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {isLoaded ? <RenderMap {...{ mapOptions }} /> : <CircularProgress />}
    </Box>
  );
};

const RenderMap = ({ mapOptions }) => {
  const { provinces } = useContext(UpToDateDataContext);

  const onLoad = React.useCallback(
    function onLoad(map) {
      const heatmapData = provinces.map(prov => {
        if (prov.lat || prov.long)
          return {
            location: new window.google.maps.LatLng(prov.lat, prov.long),
            weight: prov.confirmed
          };
        else return false;
      });
      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        options: { dissipating: false, radius: 5 }
      });
      heatmap.setMap(map);
    },
    [provinces]
  );

  return (
    <GoogleMap
      id="google-maps"
      mapContainerStyle={{
        height: "100%",
        width: "100%"
      }}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={() => delete window.google.maps.version}
    ></GoogleMap>
  );
};
