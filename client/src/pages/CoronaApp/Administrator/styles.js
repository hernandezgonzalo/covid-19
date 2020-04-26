import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  tableWrapper: {
    height: "calc(100vh - 64px)",
    overflow: "scroll",
    [theme.breakpoints.down("xs")]: {
      height: "auto"
    }
  },
  image: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));
