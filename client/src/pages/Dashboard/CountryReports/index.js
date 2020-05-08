import React, { useContext } from "react";
import { UpToDateDataContext } from "../../../contexts/UpToDateDataContext";
import ScoreBoard from "./ScoreBoard";
import { Grid, Box, makeStyles, Paper } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import _ from "lodash";
import CountryReportsTabs from "./CountryReportsTabs";

const useStyles = makeStyles(theme => ({
  boxWrapper: {
    [theme.breakpoints.down("md")]: { paddingRight: "8px" },
    [theme.breakpoints.down("sm")]: { padding: "0 8px" }
  },
  componentsWrapper: { height: "calc(100vh - 80px)" },
  reportsWrapper: { height: "calc(100% - 104px)" }
}));

const CountryReports = props => {
  const { countries, worldwide } = useContext(UpToDateDataContext);
  const classes = useStyles();
  let currentView = null;

  // get current country or worldwide statistics
  if (countries)
    if (props.countryUrl) {
      currentView =
        countries.find(country => country.url === props.countryUrl) ||
        worldwide;
    } else currentView = worldwide;

  if (_.isEmpty(currentView))
    return (
      <Grid item xs={12} md={9} lg={7}>
        <Box pt={1} className={classes.boxWrapper}>
          <Box className={classes.componentsWrapper}>
            <Skeleton variant="rect" height={95.781} />
            <Box className={classes.reportsWrapper} mt={1}>
              <Skeleton variant="rect" height={"100%"} />
            </Box>
          </Box>
        </Box>
      </Grid>
    );

  return (
    <Grid id="country-reports" item xs={12} md={9} lg={7}>
      <Box pt={1} className={classes.boxWrapper}>
        <Box className={classes.componentsWrapper}>
          <ScoreBoard {...{ currentView }} />
          <Box
            component={Paper}
            square
            className={classes.reportsWrapper}
            mt={1}
          >
            <CountryReportsTabs {...{ currentView }} />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default CountryReports;
