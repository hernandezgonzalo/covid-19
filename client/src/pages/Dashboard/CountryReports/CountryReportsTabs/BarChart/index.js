import React, { useContext, useEffect, createRef } from "react";
import { Bar, defaults } from "react-chartjs-2";
import { DailyDataContext } from "../../../../../contexts/DailyDataContext";
import _ from "lodash";
import { formatDate } from "../../../../../lib/dates";
import { useTheme, Grid, LinearProgress } from "@material-ui/core";
import DatePicker from "../../../../../components/ui/DatePicker";
import Loading from "../../../../../components/ui/Loading";
import { parse } from "date-fns";

export const BarChart = ({ currentView }) => {
  const chartRef = createRef();
  const datePickersRef = createRef();
  const { dates, setDates, countries, worldwide, isDatesLoading } = useContext(
    DailyDataContext
  );

  const theme = useTheme();
  defaults.global.defaultFontFamily = theme.typography.fontFamily;
  defaults.global.defaultFontColor = "#999";

  useEffect(() => {
    if (chartRef.current && datePickersRef.current)
      chartRef.current.chartInstance.canvas.parentNode.style.height = `calc(100% - ${
        datePickersRef.current.offsetHeight + 5
      }px)`;
  });

  if (_.isEmpty(countries) || _.isEmpty(worldwide)) return <Loading />;

  let viewCountry = countries
    .map(day =>
      day.filter(country => country.countryRegion === currentView.countryRegion)
    )
    .flat();
  if (_.isEmpty(viewCountry[0])) viewCountry = worldwide;

  // calculate daily data
  let dailyData = [];
  for (let i = 1; i < viewCountry.length; i++)
    dailyData.push({
      countryRegion: viewCountry[i].countryRegion,
      confirmed: viewCountry[i].confirmed - viewCountry[i - 1].confirmed,
      deaths: viewCountry[i].deaths - viewCountry[i - 1].deaths,
      recovered: viewCountry[i].recovered - viewCountry[i - 1].recovered,
      date: viewCountry[i].date
    });
  viewCountry = [...dailyData];

  const handleSetStart = date => setDates([formatDate(date, "MDY"), dates[1]]);
  const handleSetEnd = date => setDates([dates[0], formatDate(date, "MDY")]);

  return (
    <>
      <div style={{ height: 5 }}>{isDatesLoading && <LinearProgress />}</div>
      <Grid container justify="space-evenly" ref={datePickersRef}>
        <Grid item>
          <DatePicker
            key="from"
            label="From"
            date={dates[0]}
            handleSetDate={handleSetStart}
          />
        </Grid>
        <Grid item>
          <DatePicker
            key="to"
            label="To"
            date={dates[1]}
            handleSetDate={handleSetEnd}
          />
        </Grid>
      </Grid>
      <Bar
        data={chartData(viewCountry, theme)}
        options={{
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 5,
              right: 10,
              top: 10,
              bottom: 5
            }
          },
          legend: {
            labels: { boxWidth: 12 }
          }
        }}
        ref={chartRef}
      />
    </>
  );
};

const chartData = (viewCountry, theme) => {
  const datesArray = viewCountry.map(country => country.date);
  const formattedDates = datesArray.map(date =>
    formatDate(parse(date, "MM-dd-yyyy", new Date()))
  );
  const cases = viewCountry.map(day => (day.confirmed < 0 ? 0 : day.confirmed));
  const deaths = viewCountry.map(day => (day.deaths < 0 ? 0 : day.deaths));
  const recovered = viewCountry.map(day =>
    day.recovered < 0 ? 0 : day.recovered
  );

  return {
    labels: formattedDates,
    datasets: [
      {
        label: "Cases",
        data: cases,
        ...defaultDataset(theme.palette.text.primary)
      },
      {
        label: "Deaths",
        data: deaths,
        ...defaultDataset(theme.palette.deaths)
      },
      {
        label: "Recovered",
        data: recovered,
        ...defaultDataset(theme.palette.recovered)
      }
    ]
  };
};

const defaultDataset = color => ({
  backgroundColor: color
});
