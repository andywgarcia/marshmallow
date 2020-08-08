import React from "react";
import { connect } from "react-redux";
import * as selectors from "./redux/selectors";

const TotalCost = ({ interestSaved, monthsSooner }) => {
  return (
    <div>
      <h1>Interest Saved ${interestSaved.toFixed(2)}</h1>
      <h1>Payoff Date: {monthsSooner} months sooner</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  const payoffDetails = selectors.payoffDetails(state);
  const payoffSavingsDetails = selectors.payoffSavingsDetails(state);
  return {
    interestSaved:
      payoffDetails.totalInterest - payoffSavingsDetails.totalInterest,
    monthsSooner:
      payoffDetails.payments.length - payoffSavingsDetails.payments.length,
  };
};

export default connect(mapStateToProps)(TotalCost);
