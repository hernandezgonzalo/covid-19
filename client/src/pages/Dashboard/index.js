import React, { lazy, Suspense } from "react";
import { Grid } from "@material-ui/core";
import News from "./News";
const CountriesList = lazy(() => import("./CountriesList"));
const CountryReports = lazy(() => import("./CountryReports"));

export const Dashboard = props => {
  const countryUrl = props.match.params.countryUrl;

  return (
    <Grid container>
      <Suspense fallback={<div></div>}>
        <CountriesList />
        <CountryReports {...{ countryUrl }} />
        <News />
      </Suspense>
    </Grid>
  );
};
