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
  console.log(selectors);
  const payoffDetails = selectors.originalPayoffDetails(state);
  const reducedLoans = state.loans.allLoans.reduce(
    (acc, curr) => {
      return {
        ...acc,
        totalPrincipal: acc.totalPrincipal + curr.balance,
        totalMonthlyPayment:
          acc.totalMonthlyPayment + curr.monthlyMinimumPayment,
      };
    },
    { totalPrincipal: 0, totalMonthlyPayment: 0 }
  );
  return {
    monthsAwayFromPayoff: Math.max(
      ...payoffDetails.payments.map(
        (loanPayments) => loanPayments.payments.length
      )
    ),
    totalInterest: payoffDetails.totalInterest,
    principal: reducedLoans.totalPrincipal,
    monthlyPayment: reducedLoans.totalMonthlyPayment,
  };
};

export default connect(mapStateToProps)(PayoffInformation);
