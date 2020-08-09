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
          value={props.payments.length || 0}
        />
      </div>
    </div>
  );
};

PayoffInformation.defaultProps = {
  payments: [],
  totalInterest: 0,
  principal: 0,
};

const mapStateToProps = (state) => {
  const payoffDetails = selectors.originalPayoffDetails(state);
  console.log("payoffDetails", payoffDetails);
  return {
    payments: payoffDetails.payments,
    totalInterest: payoffDetails.totalInterest,
    principal: state.loans.allLoans.reduce(
      (acc, curr) => acc + curr.balance,
      0
    ),
  };
};

export default connect(mapStateToProps)(PayoffInformation);
