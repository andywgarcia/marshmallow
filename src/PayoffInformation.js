import React from "react";
import { connect } from "react-redux";
const PayoffInformation = (props) => {
  console.log(props);
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

const mapStateToProps = (state) => ({
  payments: state.payoffDetails.payments,
  totalInterest: parseFloat(state.payoffDetails.totalInterest),
  principal: parseFloat(state.currentLoan.currentBalance),
});

export default connect(mapStateToProps)(PayoffInformation);
