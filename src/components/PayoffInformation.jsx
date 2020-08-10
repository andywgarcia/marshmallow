import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
import { TextField, Typography } from "@material-ui/core";
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
          disabled
          margin="normal"
          value={props.monthlyPayment}
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
    monthlyPayment: selectors.getTotalMonthlyPayment(state),
  };
};

export default connect(mapStateToProps)(PayoffInformation);
