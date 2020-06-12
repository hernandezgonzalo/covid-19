import React, { createContext, useState, useEffect } from "react";
import {
  getProvinces,
  getCountries,
  getWorldwide
} from "../services/covid19Daily.api";
import { formatDate } from "../lib/dates";
import _ from "lodash";

// calculate default dates range
const calcYesterday = (subDays = 1) => {
  const yesterday = new Date().setDate(new Date().getDate() - subDays);
  return formatDate(new Date(yesterday), "MDY");
};
const calcOneMonthAgo = (subDays = 1) => {
  const oneMonthAgo = new Date().setDate(new Date().getDate() - 30 - subDays);
  return formatDate(new Date(oneMonthAgo), "MDY");
};

export const DailyDataContext = createContext();

const DailyDataContextProvider = ({ children }) => {
  const [dates, setDates] = useState([calcOneMonthAgo(), calcYesterday()]); // MM-DD-YYYY
  const [countries, setCountries] = useState([]);
  const [worldwide, setWorldwide] = useState({});
  const [isDatesLoading, setIsDatesLoading] = useState(false);

  const isCountries = !_.isEmpty(countries);

  useEffect(() => {
    let isSubscribed = true;
    setIsDatesLoading(true);

    getProvinces(dates)
      .then(provinces => {
        const countries = provinces.map((p, day) =>
          getCountries(p, dates, day)
        );
        if (isSubscribed) setCountries(countries);
        const worldwide = countries.map(c => getWorldwide(c));
        if (isSubscribed) setWorldwide(worldwide);
      })
      .catch(e => {
        if (!isCountries && isSubscribed)
          setDates([calcOneMonthAgo(2), calcYesterday(2)]);
      })
      .finally(() => isSubscribed && setIsDatesLoading(false));

    return () => (isSubscribed = false);
  }, [dates, isCountries]);

  return (
    <DailyDataContext.Provider
      value={{ dates, setDates, countries, worldwide, isDatesLoading }}
    >
      {children}
    </DailyDataContext.Provider>
  );
};

export default DailyDataContextProvider;
