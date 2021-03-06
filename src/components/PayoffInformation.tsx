import React from "react";
import { connect, ConnectedProps } from "react-redux";
import * as selectors from "../store/selectors";
import { setAvailableLoanPaymentAmount } from "../store/actions";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";
import DecimalInput from "./DecimalInput";

const mapStateToProps = (state) => {
  return {
    monthsAwayFromPayoff: selectors.getMonthsAwayFromPayoff(state),
    totalInterest: selectors.getTotalInterestPaid(state),
    principal: selectors.getTotalPrincipal(state),
    monthlyMinPayment: selectors.getTotalMonthlyMinPayment(state),
    monthlyPayment: state.availableAmounts.monthlyPayment,
  };
};

const mapDispatchToProps = { setAvailableLoanPaymentAmount };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const PayoffInformation = (props: PropsFromRedux) => {
  return (
    <div>
      <Typography variant="h4" color="initial">
        Total Loan Overview
      </Typography>
      <div>
        <TextField
          id="payoff-total-amount-paid"
          label="Total Amount Paid"
          variant="filled"
          disabled
          margin="normal"
          value={(props.totalInterest + props.principal).toFixed(2)}
        />
      </div>
      <div>
        <TextField
          id="payoff-total-principal"
          label="Total Principal"
          variant="filled"
          disabled
          margin="normal"
          value={props.principal.toFixed(2)}
        />
      </div>
      <div>
        <TextField
          id="payoff-interest-paid"
          label="Interest Paid"
          variant="filled"
          disabled
          margin="normal"
          value={props.totalInterest.toFixed(2)}
        />
      </div>
      <div>
        <TextField
          id="payoff-date"
          label="Payoff Date"
          variant="filled"
          disabled
          margin="normal"
          value={moment()
            .add(props.monthsAwayFromPayoff, "months")
            .format("MMMM YYYY")}
        />
      </div>
      <div>
        <TextField
          id="payoff-months-away"
          label="Months Away from Payoff"
          variant="filled"
          disabled
          margin="normal"
          value={props.monthsAwayFromPayoff}
        />
      </div>
      <div>
        <TextField
          id="total-monthly-payment"
          label="Monthly Payment"
          variant="filled"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Reset Monthly Payment"
                  onClick={() => {
                    props.setAvailableLoanPaymentAmount(
                      parseFloat(props.monthlyMinPayment || 0)
                    );
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputComponent: DecimalInput,
            inputProps: {
              value: props.monthlyPayment,
              onChange: (e) => {
                props.setAvailableLoanPaymentAmount(
                  parseFloat((e.target as HTMLTextAreaElement).value)
                );
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
          error={props.monthlyPayment < props.monthlyMinPayment}
          helperText={
            props.monthlyPayment < props.monthlyMinPayment
              ? `The monthly payment amount must be at least $${parseFloat(
                  props.monthlyMinPayment || 0
                ).toFixed(2)}`
              : null
          }
        />
      </div>
    </div>
  );
};

PayoffInformation.defaultProps = {
  monthsAwayFromPayoff: 0,
  totalInterest: 0,
  principal: 0,
};

export default connector(PayoffInformation);
