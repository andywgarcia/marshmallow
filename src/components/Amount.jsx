import React from "react";
import { connect } from "react-redux";
import { setDesiredSpending } from "../redux/actionCreators";
import { TextField, Typography } from "@material-ui/core";

import { KeyboardDatePicker } from "@material-ui/pickers";

import moment from "moment";

const Amount = (props) => {
  const cleanNumber = (num) => {
    return parseFloat((parseFloat(num || 0) || 0).toFixed(2));
  };
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
          value={props.desiredSpendingAmount}
          onChange={({ target: { value } }) => {
            props.setDesiredSpending({ amount: value });
          }}
          onBlur={() => {
            props.setDesiredSpending({
              amount: cleanNumber(props.desiredSpendingAmount),
            });
          }}
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
          value={props.desiredSpendingDate || moment()}
          onChange={(date) => props.setDesiredSpending({ date: date })}
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
    desiredSpendingAmount: state.availableAmounts.desiredSpending.amount,
    desiredSpendingDate: state.availableAmounts.desiredSpending.date,
  };
};

const mapDispatchToProps = {
  setDesiredSpending,
};
export default connect(mapStateToProps, mapDispatchToProps)(Amount);
