import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { Tooltip, useTheme } from "@material-ui/core";

const ToggleTheme = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Tooltip title="Toggle light/dark theme">
      <IconButton
        aria-label="Toggle light/dark theme"
        onClick={toggleTheme}
        color="inherit"
      >
        {theme.palette.type === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleTheme;
