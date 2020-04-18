export const datesBetween = dates => {
  const start = new Date(dates[0]), // MM-DD-YYYY
    end = new Date(dates[1]),
    year = start.getFullYear(),
    month = start.getMonth();
  let day = start.getDate(),
    datesArray = [start];

  while (datesArray[datesArray.length - 1] < end) {
    datesArray.push(new Date(year, month, ++day));
  }

  const output = datesArray.map(
    date => `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
  );

  return output; // MM-DD-YYYY
};

export const formatDate = (dateStr, formatType) => {
  const date = new Date(dateStr);
  const dd = String(date.getDate());
  const mm = String(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  if (formatType === "MDY") return `${mm}-${dd}-${yyyy}`;
  else return `${dd}-${mm}-${yyyy}`;
};
