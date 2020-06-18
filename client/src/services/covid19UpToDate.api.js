import axios from "axios";
import { round } from "../lib/calc";

const countriesToAdjust = ["US", "Brazil", "Chile", "Peru"];

const api = axios.create({
  baseURL: `${process.env.REACT_APP_COVID_API_URL}`
});

export const getProvinces = async () => {
  const resProvinces = await api.get("/confirmed");
  let provinces = resProvinces.data;

  // get recovered cases of countries with missing data
  for (let country of countriesToAdjust) {
    const resCountry = await api.get(`/countries/${country}`);
    const index = provinces.findIndex(p => p.countryRegion === country);
    provinces[index].recovered = resCountry.data.recovered.value;
  }

  return provinces;
};

// group data by country (not by province)
export const getCountries = provinces => {
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
      confirmed: acc.confirmed + cur.confirmed,
      recovered: acc.recovered + cur.recovered,
      deaths: acc.deaths + cur.deaths,
      active: acc.active + cur.active,
      iso2: acc.iso2,
      lastUpdate: acc.lastUpdate
    }));
    country.activeRate = round((country.active * 100) / country.confirmed, 1);
    country.recoveryRate = round(
      (country.recovered * 100) / country.confirmed,
      1
    );
    country.fatalityRate = round((country.deaths * 100) / country.confirmed, 1);
    country.url = country.countryRegion.match(/\w+/g).join("");
    countries.push(country);
  });

  countries = adjustMissingData(countries);
  countries = countries.sort((a, b) => b.confirmed - a.confirmed);
  return countries;
};

export const getWorldwide = countries => {
  const all = countries.reduce((acc, cur) => ({
    confirmed: acc.confirmed + cur.confirmed,
    recovered: acc.recovered + cur.recovered,
    deaths: acc.deaths + cur.deaths,
    active: acc.active + cur.active
  }));
  all.countryRegion = `Worldwide (${countries.length} territories)`;
  all.activeRate = round((all.active * 100) / all.confirmed, 1);
  all.recoveryRate = round((all.recovered * 100) / all.confirmed, 1);
  all.fatalityRate = round((all.deaths * 100) / all.confirmed, 1);
  return all;
};

// set missing data
export const adjustMissingData = countries => {
  const countriesFixed = countries.map(country => {
    if (countriesToAdjust.includes(country.countryRegion)) {
      const adjustActive =
        country.confirmed - country.deaths - country.recovered;
      return {
        ...country,
        active: adjustActive,
        activeRate: round((adjustActive * 100) / country.confirmed, 1)
      };
    } else return country;
  });
  return countriesFixed;
};
