import React, { useEffect, useState, useContext } from "react";
import {
  GoogleMap,
  Marker,
  MarkerClusterer,
  InfoWindow
} from "@react-google-maps/api";
import { getCases } from "../../../services/appService";
import { useStyles } from "./styles";
import { CircularProgress, Grid } from "@material-ui/core";
import SelectedInfo from "./SelectedInfo";
import UserControlPanel from "./UserControlPanel";
import CenterMap from "./custom/CenterMap";
import { useUser } from "../../../services/authService";
import { NotifierContext } from "../../../contexts/NotifierContext";
import _ from "lodash";
import { youAreHere } from "./custom/youAreHere";
import { FindAPlace } from "./custom/FindAPlace";

export const RenderMap = ({ mapOptions, caseToShow }) => {
  const [cases, setCases] = useState();
  const [selected, setSelected] = useState({});
  const [initialCenter, setInitialCenter] = useState();
  const [initialZoom, setInitialZoom] = useState();
  const { notifications } = useContext(NotifierContext);
  const user = useUser();
  const classes = useStyles();

  const isAdmin = user.role === "admin";

  useEffect(() => {
    getCases().then(({ cases }) => {
      setCases(cases);
      const isThereSelected = cases.filter(c => c.id === selected.id);
      if (_.isEmpty(isThereSelected)) setSelected({});
    });
    // eslint-disable-next-line
  }, [notifications]);

  // set initial map center and zoom
  useEffect(() => {
    const geo = caseToShow
      ? caseToShow.user.location.coordinates
      : user.location.coordinates;
    setInitialCenter({ lat: geo[1], lng: geo[0] });
    if (caseToShow) {
      setInitialZoom(initialZoom => (initialZoom === 15 ? 16 : 15));
      if (cases) {
        const findSelected = cases?.filter(c => c.id === caseToShow._id);
        setSelected(findSelected[0]);
      }
    } else {
      if (isAdmin) setInitialZoom(6);
      else setInitialZoom(14);
    }
    // eslint-disable-next-line
  }, [caseToShow]);

  const handleOnSelect = c => setSelected(c);

  if (!cases) return <CircularProgress />;

  return (
    <Grid container className={classes.mapWrapper}>
      <GoogleMap
        id="google-maps"
        mapContainerClassName={classes.map}
        options={mapOptions}
        center={initialCenter}
        zoom={initialZoom}
        onLoad={map => !isAdmin && youAreHere(map, user)}
        onUnmount={() => delete window.google.maps.version}
      >
        <FindAPlace />
        <CenterMap />
        {!isAdmin && <UserControlPanel {...{ cases, setSelected, selected }} />}
        <MarkerClusterer>
          {clusterer =>
            cases.map((c, index) => (
              <div key={index}>
                <Marker
                  key={c.id}
                  position={{
                    lat: c.location.coordinates[1],
                    lng: c.location.coordinates[0]
                  }}
                  clusterer={clusterer}
                  icon="images/marker.png"
                  onClick={() => handleOnSelect(c)}
                />
              </div>
            ))
          }
        </MarkerClusterer>
        {selected.location && (
          <InfoWindow
            position={{
              lat: selected.location.coordinates[1],
              lng: selected.location.coordinates[0]
            }}
            options={{ pixelOffset: new window.google.maps.Size(0, -50) }}
            clickable={true}
            onCloseClick={() => setSelected({})}
          >
            <SelectedInfo {...{ selected }} />
          </InfoWindow>
        )}
      </GoogleMap>
    </Grid>
  );
};
