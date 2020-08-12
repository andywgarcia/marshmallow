import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
import { setAvailableLoanPaymentAmount } from "../redux/actionCreators";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";

const PayoffInformation = (props) => {
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
          value={props.monthlyPayment}
          onChange={({ target: { value } }) => {
            props.setAvailableLoanPaymentAmount(value);
          }}
          onBlur={() => {
            props.setAvailableLoanPaymentAmount(
              parseFloat(props.monthlyPayment || 0)
            );
          }}
          error={props.monthlyPayment < props.monthlyMinPayment}
          helperText={
            props.monthlyPayment < props.monthlyMinPayment
              ? `The monthly payment amount must be at least $${parseFloat(
                  props.monthlyMinPayment || 0
                ).toFixed(2)}`
              : ""
          }
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
                  // onMouseDown={handleMouseDownPassword}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
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

const mapStateToProps = (state) => {
  return {
    monthsAwayFromPayoff: selectors.getMonthsAwayFromPayoff(state),
    totalInterest: selectors.getTotalInterestPaid(state),
    principal: selectors.getTotalPrincipal(state),
    monthlyMinPayment: selectors.getTotalMonthlyMinPayment(state),
    monthlyPayment: state.availableAmounts.forLoanPayments,
  };
};

export default connect(mapStateToProps, { setAvailableLoanPaymentAmount })(
  PayoffInformation
);
