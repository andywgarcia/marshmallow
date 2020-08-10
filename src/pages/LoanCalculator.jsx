import React from "react";
import Amount from "../components/Amount";
import PayoffInformation from "../components/PayoffInformation";
import TotalCost from "../components/TotalCost";
import { Divider } from "@material-ui/core";

const LoanCalculator = () => {
  return (
    <div>
      <PayoffInformation />
      <Divider />
      <Amount />
      <Divider />
      <TotalCost />
    </div>
  );
};

export default LoanCalculator;
