import React from "react";
import {
  TableRow,
  TableCell,
  makeStyles,
  Box,
  withTheme
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ScoreCountryName, ScoreData } from "../../../components/ui/Score";
import { scrollCountryReports } from "../../../lib/layout";

const useStyles = makeStyles(theme => ({
  tableRow: {
    padding: "6px 12px",
    "&:hover": {
      cursor: "pointer",
      transition: "all 0.5s ease-out",
      backgroundColor: theme.palette.action.hover
    }
  }
}));

const UpdatedListItem = ({ country }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <TableRow className={classes.tableRow}>
      <TableCell
        component="th"
        scope="row"
        onClick={() => {
          history.push(country.url);
          scrollCountryReports();
        }}
        className={classes.tableRow}
      >
        <ScoreCountryName name={country.countryRegion} iso2={country.iso2} />
        <Box display="flex">
          <ScoreData title="Cases" data={country.confirmed} kFormat />
          <ScoreData
            title="Deaths"
            data={country.deaths}
            color="deaths"
            kFormat
          />
          <ScoreData
            title="Recover."
            data={country.recovered}
            color="recovered"
            kFormat
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default withTheme(UpdatedListItem);
