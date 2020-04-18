export const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

export const kFormatter = num =>
  Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
