import React, { useState, useEffect, useContext } from "react";
import { useGoogleMap } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { MapContext } from "../../../../contexts/MapContext";

export const FindAPlace = () => {
  const [marker, setMarker] = useState();
  const [autocomplete, setAutocomplete] = useState(null);
  const { setMapPlace } = useContext(MapContext);
  const map = useGoogleMap();

  useEffect(() => {
    if (marker?.position) {
      const geo = marker.position;
      map.setCenter({ lat: geo.lat(), lng: geo.lng() });
      map.setZoom(16);
    }
  }, [marker, map]);

  const onLoad = autocomplete => setAutocomplete(autocomplete);

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();

    if (place?.geometry) {
      if (marker) marker.setMap(null);
      const newMarker = new window.google.maps.Marker({
        map,
        position: place.geometry.location
      });
      setMarker(newMarker);

      // set the context state to be used when adding a new user
      for (let address of place.address_components) {
        if (address.types.includes("country"))
          setMapPlace(mapPlace => ({
            ...mapPlace,
            country: address.long_name
          }));
        if (address.types.includes("locality"))
          setMapPlace(mapPlace => ({
            ...mapPlace,
            city: address.long_name
          }));
      }
      setMapPlace(mapPlace => ({
        ...mapPlace,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      }));
    }
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        placeholder="Find a place"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
          position: "absolute",
          left: "50%",
          marginLeft: "-120px",
          marginTop: "20px",
          fontFamily: ['"Baloo 2"', "-apple-system"].join(",")
        }}
      />
    </Autocomplete>
  );
};
