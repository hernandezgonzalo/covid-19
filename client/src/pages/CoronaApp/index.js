import React from "react";
import { useTheme, Box, CircularProgress, Grid } from "@material-ui/core";
import { useLoadScript } from "@react-google-maps/api";
import lightMode from "./mapStyles/lightmode";
import darkMode from "./mapStyles/darkmode";
import { RenderMap } from "./RenderMap";
import { withProtected } from "../../lib/auth/withProtected";
import { makeStyles } from "@material-ui/core";
import { createBrowserHistory } from "history";
import { useUser } from "../../services/authService";
import Administrator from "./Administrator";

export const useStyles = makeStyles(() => ({
  mapWrapper: {
    height: "calc(100vh - 64px)",
    flexGrow: 1
  }
}));

const libraries = ["visualization", "places"];

export const CoronaApp = withProtected(() => {
  const historyBrowser = createBrowserHistory();
  const theme = useTheme();
  const classes = useStyles();
  const user = useUser();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const isAdmin = user.role === "admin";

  // check if there is a case to show in the browser history
  const caseToShow = historyBrowser.location.state?.caseToShow;

  const mapOptions = {
    styles: theme.palette.type === "dark" ? darkMode : lightMode,
    streetViewControl: false,
    mapTypeControl: false,
    controlSize: 25
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <Grid container>
      {isAdmin && <Administrator />}
      <Grid item className={classes.mapWrapper}>
        <Box
          height={1}
          width={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {isLoaded ? (
            <RenderMap {...{ mapOptions, caseToShow }} />
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Grid>
    </Grid>
  );
});
