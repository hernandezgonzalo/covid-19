import React, { useState } from "react";
import UpToDateDataContextProvider from "./contexts/UpToDateDataContext";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Route, Switch } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { createTheme } from "./components/ui/theme";
import SignUp from "./pages/auth/SignUp";
import { withAuthentication } from "./lib/auth/withAuthentication";
import { CoronaApp } from "./pages/CoronaApp";
import NotifierContextProvider from "./contexts/NotifierContext";
import Test from "./pages/CoronaApp/Test";
import { ConfirmProvider } from "material-ui-confirm";

const App = withAuthentication(() => {
  // Toggle between themes
  const [theme, setTheme] = useState(createTheme());
  const toggleTheme = () => {
    const newTheme = theme.palette.type === "dark" ? "light" : "dark";
    setTheme(createTheme(newTheme));
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider>
          <NotifierContextProvider>
            <UpToDateDataContextProvider>
              <Navbar {...{ toggleTheme }} />
              <Switch>
                <Route exact path="/app" component={CoronaApp} />
                <Route exact path="/app/test" component={Test} />
                <Route exact path="/:countryUrl?" component={Dashboard} />
                <Route exact path="/auth/signup" component={SignUp} />
              </Switch>
            </UpToDateDataContextProvider>
          </NotifierContextProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </div>
  );
});

export default App;
