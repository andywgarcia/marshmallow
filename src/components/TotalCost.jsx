import React from "react";
import { connect } from "react-redux";
import * as selectors from "../redux/selectors";
import { Typography } from "@material-ui/core";

const TotalCost = ({ interestSaved, monthsSooner }) => {
  return (
    <div>
      <Typography variant="h6" color="initial">
        would save you{" "}
        <span style={{ color: "green" }}>
          ${(interestSaved || 0).toFixed(2)}
        </span>{" "}
        in interest
      </Typography>
      <Typography variant="h6" color="initial">
        and be paid off{" "}
        <span style={{ color: "green" }}>{monthsSooner} months sooner</span>
      </Typography>
    </div>
  );
};

const mapStateToProps = (state) => {
  const totalPaidAfterAdditionalPayments = selectors.getTotalPaidWithExtraPayments(
    state
  );
  const additionalPaymentsPlan = selectors.getPaymentPlanWithAdditionalPayments(
    state
  );
  const potentialTotalPaid = selectors.getPotentialTotalPaid(state);
  const potentialPaymentPlan = selectors.getPaymentPlanWithAdditionalDesiredSpending(
    state
  );
  return {
    interestSaved: totalPaidAfterAdditionalPayments - potentialTotalPaid,
    monthsSooner: additionalPaymentsPlan.length - potentialPaymentPlan.length,
  };
};

export default connect(mapStateToProps)(TotalCost);
