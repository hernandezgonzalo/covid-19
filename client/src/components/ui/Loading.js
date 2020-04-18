import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const Loading = () => {
  return (
    <Box
      height={1}
      width={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
