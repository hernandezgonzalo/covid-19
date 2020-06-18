import React, { useContext } from "react";
import { UpToDateDataContext } from "../../../contexts/UpToDateDataContext";
import {
  Table,
  makeStyles,
  TableContainer,
  Paper,
  TableBody,
  Grid,
  Box,
  Typography
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ListItem from "./ListItem";
import _ from "lodash";
import { motion } from "framer-motion";

const useStyles = makeStyles(theme => ({
  listWrapper: {
    height: "calc(100vh - 80px)",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
      overflowX: "unset"
    }
  }
}));

const UpdatedList = () => {
  const { countries } = useContext(UpToDateDataContext);
  const classes = useStyles();

  const countriesToShow = 50;

  if (_.isEmpty(countries))
    return (
      <Grid item xs={12} md={3} lg={2}>
        <Box m={1} textAlign="center">
          <Skeleton variant="rect" className={classes.listWrapper} />
        </Box>
      </Grid>
    );

  return (
    <Grid item xs={12} md={3} lg={2}>
      <Box m={1}>
        <TableContainer
          component={Paper}
          variant="outlined"
          square
          className={classes.listWrapper}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table size="small" aria-label="countries list">
              <TableBody>
                {countries.slice(0, countriesToShow).map(country => (
                  <ListItem key={country.countryRegion} {...{ country }} />
                ))}
              </TableBody>
            </Table>
            <Typography variant="body2" align="center" color="textSecondary">
              Showing {countriesToShow} of {countries.length} territories
            </Typography>
          </motion.div>
        </TableContainer>
      </Box>
    </Grid>
  );
};

export default UpdatedList;
