import React from "react";
import { connect } from "react-redux";

const TotalCost = ({ potentialInterestSaved }) => {
  return (
    <div>
      <h1>Interest Saved ${potentialInterestSaved}</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    potentialInterestSaved: state.potentialInterestSaved,
    totalCost: state.desiredSpending + state.potentialInterestSaved,
  };
};

export default connect(mapStateToProps)(TotalCost);
