import React from "react";
import { ScoreData, ScoreCountryName } from "../../../../components/ui/Score";
import { Paper, Box } from "@material-ui/core";

const ScoreBoard = ({ currentView }) => {
  return (
    <Box component={Paper} variant="outlined" square px={1.5} py={0.5}>
      <Box>
        <ScoreCountryName
          name={currentView.countryRegion}
          iso2={currentView.iso2}
          lastUpdate={currentView.lastUpdate}
        />
      </Box>
      <Box display="flex">
        <ScoreData title="Cases" data={currentView.confirmed} />
        <ScoreData
          title="Active"
          data={currentView.active}
          color="activeCases"
        />
        <ScoreData
          title="Active Rate"
          data={currentView.activeRate}
          color="activeCases"
          percentage
        />
        <ScoreData title="Deaths" data={currentView.deaths} color="deaths" />
        <ScoreData
          title="Fatality"
          data={currentView.fatalityRate}
          color="deaths"
          percentage
        />
        <ScoreData
          title="Recovered"
          data={currentView.recovered}
          color="recovered"
        />
        <ScoreData
          title="Recovery"
          data={currentView.recoveryRate}
          color="recovered"
          percentage
        />
      </Box>
    </Box>
  );
};

export default ScoreBoard;
