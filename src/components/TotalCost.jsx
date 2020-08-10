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
  const payoffDetails = selectors.originalPayoffDetails(state);
  const payoffSavingsDetails = selectors.payoffSavingsDetails(state);
  console.log(selectors.getPaymentPlan(state));
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
