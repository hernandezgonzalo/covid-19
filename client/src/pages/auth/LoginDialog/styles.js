import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 280
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.text.icon
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  localLogin: {
    margin: theme.spacing(3, 0, 1)
  },
  facebookLogin: {
    margin: theme.spacing(1, 0, 2),
    color: "#4267b2"
  }
}));
