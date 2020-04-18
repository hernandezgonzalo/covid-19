import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Heatmap } from "./Heatmap";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import DailyDataContextProvider from "../../../../contexts/DailyDataContext";
import RoomIcon from "@material-ui/icons/Room";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import BarChartIcon from "@material-ui/icons/BarChart";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box p={0} height={1}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "100%"
  },
  labelIcon: {
    minHeight: 0,
    "& svg": { marginRight: 5 }
  }
}));

export default function CountryReportsTabs({ currentView }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.root} style={{ height: "100%" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            icon={<RoomIcon />}
            label="Map"
            {...a11yProps(0)}
            className={classes.labelIcon}
          />
          <Tab
            icon={<ShowChartIcon />}
            label="Cumulative cases"
            {...a11yProps(1)}
            className={classes.labelIcon}
          />
          <Tab
            icon={<BarChartIcon />}
            label="Daily increase"
            {...a11yProps(2)}
            className={classes.labelIcon}
          />
        </Tabs>
      </AppBar>
      <DailyDataContextProvider>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{ height: "calc(100% - 48px)" }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Heatmap {...{ currentView }}></Heatmap>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <LineChart {...{ currentView }} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <BarChart {...{ currentView }} />
          </TabPanel>
        </SwipeableViews>
      </DailyDataContextProvider>
    </div>
  );
}
