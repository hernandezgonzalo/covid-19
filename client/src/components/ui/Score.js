import React from "react";
import "flag-icon-css/css/flag-icon.min.css";
import { makeStyles, Box, Typography } from "@material-ui/core";
import TimeAgo from "./TimeAgo";
import { kFormatter } from "../../lib/calc";

const useStyles = makeStyles(theme => ({
  flag: {
    marginRight: "0.25em",
    fontSize: 28,
    borderRadius: 4
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 500,
    lineHeight: "1em",
    paddingTop: "0.4rem",
    paddingBottom: "0.4rem"
  },
  data: {
    width: "100%",
    marginRight: "0.5em",
    "& span": {
      display: "block",
      lineHeight: "1em"
    },
    "& .number": {
      fontSize: "1.5rem"
    },
    [theme.breakpoints.down("xs")]: {
      width: "auto"
    }
  },
  lastUpdate: { fontSize: ".8rem", opacity: ".6", margin: "0 0 auto auto" }
}));

export const ScoreCountryName = ({ name, iso2, lastUpdate }) => {
  const classes = useStyles();
  let flagClass = iso2
    ? `flag-icon flag-icon-${iso2.toLowerCase()} ${classes.flag}`
    : "";

  return (
    <Box display="flex" alignItems="center">
      <span className={flagClass}></span>
      <span className={classes.title}>{name}</span>
      {lastUpdate && (
        <Typography color="textSecondary" className={classes.lastUpdate}>
          <span>Updated </span>
          <TimeAgo date={new Date(Number(lastUpdate))} />
        </Typography>
      )}
    </Box>
  );
};

export const ScoreData = ({ title, data, color, percentage, kFormat }) => {
  const classes = useStyles();

  return (
    <Box className={classes.data}>
      <span>{title}</span>
      <Box className="number" color={color}>
        {!kFormat && new Intl.NumberFormat().format(data)}
        {kFormat && kFormatter(data)}
        {percentage && "%"}
      </Box>
    </Box>
  );
};
