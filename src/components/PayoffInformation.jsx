import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
const PayoffInformation = (props) => {
  return (
    <div>
      <div>
        <span>
          Total Amount Paid: $
          {(props.totalInterest + props.principal).toFixed(2)}
        </span>
      </div>
      <div>
        <span>Interest Paid: ${props.totalInterest.toFixed(2)}</span>
      </div>
      <div>
        <span>Months Away from Payoff: {props.payments.length || 0}</span>
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
