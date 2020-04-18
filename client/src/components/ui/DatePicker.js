import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

export default function DatePicker({ label, date, handleSetDate }) {
  const [selectedDate, setSelectedDate] = React.useState(date);

  const handleDateChange = date => {
    setSelectedDate(date);
    handleSetDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        minDate={new Date("2020-01-22")}
        maxDate={new Date().setDate(new Date().getDate() - 1)}
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        label={label}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
