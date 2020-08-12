import React, { useState } from "react";
import { connect } from "react-redux";
import { setDesiredSpending } from "../redux/actionCreators";
import { TextField, Typography } from "@material-ui/core";

import { KeyboardDatePicker } from "@material-ui/pickers";

import moment from "moment";

const Amount = ({ desiredSpendingAmount, setDesiredSpending }) => {
  const [date, setDate] = useState(moment());
  return (
    <div>
      <Typography variant="h6" color="initial">
        A one-time extra payment of{" "}
      </Typography>
      <div>
        <TextField
          id="amount-input"
          label="One Time Extra Payment"
          margin="normal"
          variant="outlined"
          value={desiredSpendingAmount}
          onChange={({ target: { value } }) => setDesiredSpending(value)}
        />
        <Typography variant="h6" color="initial">
          on
        </Typography>
        <KeyboardDatePicker
          disableToolbar
          format="MMMM Do, YYYY"
          margin="normal"
          id="amount-input"
          label="Date"
          inputVariant="outlined"
          value={date}
          onChange={setDate}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    desiredSpendingAmount: state.availableAmounts.desiredSpending,
  };
};

const mapDispatchToProps = {
  setDesiredSpending,
};
export default connect(mapStateToProps, mapDispatchToProps)(Amount);
