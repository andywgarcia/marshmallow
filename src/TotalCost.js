import React from "react";
import { connect } from "react-redux";

const TotalCost = ({ interestSaved, monthsSooner }) => {
  return (
    <div>
      <h1>Interest Saved ${interestSaved.toFixed(2)}</h1>
      <h1>Payoff Date: {monthsSooner} months sooner</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    interestSaved:
      state.payoffDetails.totalInterest -
      state.payoffSavingsDetails.totalInterest,
    monthsSooner:
      state.payoffDetails.payments.length -
      state.payoffSavingsDetails.payments.length,
  };
};

export default connect(mapStateToProps)(TotalCost);
