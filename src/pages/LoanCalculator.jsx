import React from "react";
import Amount from "../components/Amount";
import TotalCost from "../components/TotalCost";
import SpendOrSave from "../components/SpendOrSave";

const LoanCalculator = () => {
  return (
    <div>
      <Amount />
      <TotalCost />
      <SpendOrSave />
    </div>
  );
};

export default LoanCalculator;
