import axios from "axios";
import { datesBetween } from "../lib/dates";
import dataConfig from "../data.config.json";

const countriesToRename = dataConfig.countriesToRename;

const api = axios.create({
  baseURL: `${process.env.REACT_APP_COVID_API_URL}/daily`
});

export const getProvinces = async dates => {
  const datesArray = datesBetween(dates);

  let apiCalls = [];
  datesArray.forEach(date => apiCalls.push(api.get(date)));
  const resDaily = await Promise.all(apiCalls);
  const dailyData = resDaily.map(day => day.data);
  return dailyData;
};

// group data by country (not by province)
export const getCountries = (provinces, dates, day) => {
  const datesArray = datesBetween(dates);

  const countryNames = [];
  provinces.forEach(data => {
    if (!countryNames.includes(data.countryRegion))
      countryNames.push(data.countryRegion);
  });

  let countries = [];
  countryNames.forEach(name => {
    const groupCountry = provinces.filter(data => data.countryRegion === name);
    const country = groupCountry.reduce((acc, cur) => ({
      countryRegion: acc.countryRegion,
      confirmed: Number(acc.confirmed) + Number(cur.confirmed),
      recovered: Number(acc.recovered) + Number(cur.recovered),
      deaths: Number(acc.deaths) + Number(cur.deaths)
    }));
    country.date = datesArray[day];
    country.url = country.countryRegion.match(/\w+/g).join("");
    countries.push(country);
  });

  // rename country with different names
  countries = countries.map(country => {
    for (let mixNames of countriesToRename) {
      if (mixNames[1].includes(country.countryRegion))
        if (country.confirmed > 0)
          return {
            ...country,
            countryRegion: mixNames[0],
            url: mixNames[0].match(/\w+/g).join("")
          };
    }
    return country;
  });

  countries = countries.sort((a, b) => b.confirmed - a.confirmed);
  return countries;
};

export const getWorldwide = countries => {
  const all = countries.reduce((acc, cur) => ({
    confirmed: Number(acc.confirmed) + Number(cur.confirmed),
    recovered: Number(acc.recovered) + Number(cur.recovered),
    deaths: Number(acc.deaths) + Number(cur.deaths),
    date: acc.date
  }));
  all.countryRegion = "Worldwide";
  return all;
};
