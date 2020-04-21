import React, { useState, useEffect } from "react";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function DateAndTimePicker({ editProps }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date(editProps.value || Date.now())
  );

  // eslint-disable-next-line
  useEffect(() => editProps.onChange(selectedDate), [selectedDate]);

  const handleChangeDate = date => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        variant="inline"
        value={selectedDate}
        onChange={handleChangeDate}
        disableFuture
        ampm={false}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DateAndTimePicker;
