import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  infected: {
    backgroundColor: theme.palette.secondary.main,
    "&:focus": {
      backgroundColor: theme.palette.secondary.main
    }
  },
  clean: {
    backgroundColor: theme.palette.primary.main,
    "&:focus": {
      backgroundColor: theme.palette.primary.main
    }
  },
  button: {
    color: "white",
    cursor: "pointer",
    "&:hover": { color: "rgba(255,255,255,0.8)" }
  }
}));
