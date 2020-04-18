import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  mapWrapper: {
    height: "calc(100vh - 64px)",
    [theme.breakpoints.down("sm")]: {
      height: "100%"
    }
  },
  map: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  }
}));
