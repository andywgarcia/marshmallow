import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
import { Typography } from "@material-ui/core";

const TotalCost = ({ interestSaved, monthsSooner }) => {
  return (
    <div>
      <Typography variant="h6" color="initial">
        would save you{" "}
        <span style={{ color: "green" }}>${interestSaved.toFixed(2)}</span> in
        interest
      </Typography>
      <Typography variant="h6" color="initial">
        and be paid off{" "}
        <span style={{ color: "green" }}>{monthsSooner} months sooner</span>
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => {
  const originalTotalPaid = selectors.getOriginalTotalPaid(state);
  const potentialTotalPaid = selectors.getPotentialTotalPaid(state);
  const originalPaymentPlan = selectors.getPaymentPlan(state);
  const potentialPaymentPlan = selectors.getPaymentPlanWithAdditionalSpending(
    state
  );
  return {
    interestSaved: originalTotalPaid - potentialTotalPaid,
    monthsSooner: originalPaymentPlan.length - potentialPaymentPlan.length,
  };
};

export default connect(mapStateToProps)(TotalCost);
