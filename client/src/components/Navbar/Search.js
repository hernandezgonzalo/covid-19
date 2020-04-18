import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { UpToDateDataContext } from "../../contexts/UpToDateDataContext";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogActions, Button, IconButton, Tooltip } from "@material-ui/core";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { countries } = useContext(UpToDateDataContext);
  const history = useHistory();
  const countriesOrdered = [...countries].sort((a, b) =>
    a.countryRegion.localeCompare(b.countryRegion)
  );

  return (
    <div>
      <Tooltip title="Find a country">
        <IconButton
          aria-label="Find a country"
          color="inherit"
          onClick={handleClickOpen}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Find a country</DialogTitle>
        <DialogContent>
          <Autocomplete
            id="combo-box"
            options={countriesOrdered}
            getOptionLabel={option => option.countryRegion}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField autoFocus {...params} label="Type something" />
            )}
            onChange={(e, value) => {
              if (value) history.push(`/${value.url}`);
              setOpen(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
