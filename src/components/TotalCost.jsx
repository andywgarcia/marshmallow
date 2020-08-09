import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";

const TotalCost = ({ interestSaved, monthsSooner }) => {
  return (
    <div>
      <h1>Interest Saved ${interestSaved.toFixed(2)}</h1>
      <h1>Paid off {monthsSooner} months sooner</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  const payoffDetails = selectors.originalPayoffDetails(state);
  const payoffSavingsDetails = selectors.payoffSavingsDetails(state);
  console.log("payoffDetails", payoffDetails);
  console.log("payoffSavingsDetails", payoffSavingsDetails);
  const originalMonthsPayoff = Math.max(
    ...payoffDetails.payments.map(
      (loanPayments) => loanPayments.payments.length
    )
  );
  const savedMonthsPayoff = Math.max(
    ...payoffSavingsDetails.payments.map(
      (loanPayments) => loanPayments.payments.length
    )
  );
  return {
    interestSaved:
      payoffDetails.totalInterest - payoffSavingsDetails.totalInterest,
    monthsSooner: originalMonthsPayoff - savedMonthsPayoff,
  };
};

export default connect(mapStateToProps)(TotalCost);
