import React from "react";
import { connect } from "react-redux";

const TotalCost = ({ interestSaved }) => {
  return (
    <div>
      <h1>Interest Saved ${interestSaved.toFixed(2)}</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    interestSaved:
      state.payoffDetails.totalInterest -
      state.payoffSavingsDetails.totalInterest,
    totalCost: state.desiredSpending + state.potentialInterestSaved,
  };
};

export default connect(mapStateToProps)(TotalCost);
