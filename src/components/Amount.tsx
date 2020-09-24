import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { setDesiredSpending } from "../store/actions";
import { TextField, Typography, InputAdornment } from "@material-ui/core";

import { KeyboardDatePicker } from "@material-ui/pickers";

import moment from "moment";
import DecimalInput from "./DecimalInput";
import { RootState } from "../store/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    desiredSpendingAmount: state.availableAmounts.desiredSpending.amount,
    desiredSpendingDate: state.availableAmounts.desiredSpending.date,
  };
};

const mapDispatchToProps = {
  setDesiredSpending,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & {};

const Amount = (props: Props) => {
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
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: DecimalInput,
            inputProps: {
              value: props.desiredSpendingAmount,
              onChange: (e) => {
                props.setDesiredSpending({
                  amount: parseFloat((e.target as HTMLTextAreaElement).value),
                });
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
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
          onChange={(date) => props.setDesiredSpending({ date: moment(date) })}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </div>
    </div>
  );
};

export default connector(Amount);
