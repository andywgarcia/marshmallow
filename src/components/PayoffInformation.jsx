import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
import { TextField } from "@material-ui/core";
const PayoffInformation = (props) => {
  return (
    <div>
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
  const payoffDetails = selectors.payoffDetails(state);
  return {
    payments: payoffDetails.payments,
    totalInterest: parseFloat(payoffDetails.totalInterest),
    principal: parseFloat(state.loans.currentLoan.currentBalance),
  };
};

export default connect(mapStateToProps)(PayoffInformation);
