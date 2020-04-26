export const scrollCountryReports = () => {
  const top = document.getElementById("country-reports").offsetTop;
  window.scroll({
    top: top - 60,
    left: 0,
    behavior: "smooth"
  });
};
