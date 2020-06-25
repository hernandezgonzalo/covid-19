import React from "react";
import { makeStyles, Avatar, Typography, Box } from "@material-ui/core";
import TimeAgo from "../../../components/ui/TimeAgo";
import { retrieveImgUrl } from "../../../lib/profile";

export const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.grey["A400"],
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  image: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

const SelectedInfo = ({ selected }) => {
  const classes = useStyles();

  const userImage = retrieveImgUrl(selected.user, 128);

  return (
    <div className={classes.root}>
      <Avatar
        alt={selected.user.fullName}
        src={userImage}
        className={classes.image}
      />
      <Box>
        <Typography variant="h6" component="h2">
          {selected.user.fullName}
        </Typography>
        <Typography variant="body2">
          <span>Notified </span>
          <TimeAgo date={new Date(selected.date)} />
        </Typography>
      </Box>
    </div>
  );
};

export default SelectedInfo;
