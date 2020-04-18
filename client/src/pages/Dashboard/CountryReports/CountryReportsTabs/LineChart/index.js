import React, { useContext, useEffect, createRef } from "react";
import { Line, defaults } from "react-chartjs-2";
import { DailyDataContext } from "../../../../../contexts/DailyDataContext";
import _ from "lodash";
import { formatDate } from "../../../../../lib/dates";
import { useTheme, Grid } from "@material-ui/core";
import DatePicker from "../../../../../components/ui/DatePicker";
import Loading from "../../../../../components/ui/Loading";

export const LineChart = ({ currentView }) => {
  const chartRef = createRef();
  const datePickersRef = createRef();
  const { dates, setDates, countries, worldwide } = useContext(
    DailyDataContext
  );

  const theme = useTheme();
  defaults.global.defaultFontFamily = theme.typography.fontFamily;
  defaults.global.defaultFontColor = "#999";

  useEffect(() => {
    if (chartRef.current && datePickersRef.current)
      chartRef.current.chartInstance.canvas.parentNode.style.height = `calc(100% - ${datePickersRef.current.offsetHeight}px)`;
  });

  if (_.isEmpty(countries) || _.isEmpty(worldwide)) return <Loading />;

  let viewCountry = countries
    .map(day =>
      day.filter(country => country.countryRegion === currentView.countryRegion)
    )
    .flat();
  if (_.isEmpty(viewCountry[0])) viewCountry = worldwide;

  const handleSetStart = date => setDates([formatDate(date, "MDY"), dates[1]]);
  const handleSetEnd = date => setDates([dates[0], formatDate(date, "MDY")]);

  return (
    <>
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
      <Line
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
  const formattedDates = datesArray.map(date => formatDate(date));
  const cases = viewCountry.map(day => day.confirmed);
  const deaths = viewCountry.map(day => day.deaths);
  const recovered = viewCountry.map(day => day.recovered);

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
  fill: true,
  lineTension: 0.1,
  borderColor: color,
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderColor: color,
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: color,
  pointHoverBorderColor: "rgba(220,220,220,1)",
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10
});
