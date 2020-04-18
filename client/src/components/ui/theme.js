import { createMuiTheme, colors } from "@material-ui/core";

export const createTheme = (mode = "dark") => {
  const darkNavbar = mode === "dark" ? "#212121" : null;

  return createMuiTheme({
    palette: {
      type: mode,
      primary: { main: "#1976d2" },
      secondary: colors.red,
      activeCases: colors.yellow["A700"],
      deaths: colors.red[500],
      recovered: colors.lightGreen[500],
      navbar: darkNavbar
    },
    typography: {
      fontFamily: ['"Baloo 2"', "-apple-system"].join(",")
    },
    overrides: {
      MuiTab: {
        wrapper: {
          flexDirection: "row"
        }
      }
    }
  });
};
