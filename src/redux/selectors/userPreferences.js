import { createSelector } from "@reduxjs/toolkit";
import { PAYOFF_METHODS } from "../constants";

function selectSortFunction(payoffMethod) {
  switch (payoffMethod) {
    case PAYOFF_METHODS.DEBT_AVALANCHE:
      return (loan1, loan2) => loan2.interestRate - loan1.interestRate;
    case PAYOFF_METHODS.DEBT_SNOWBALL:
      return (loan1, loan2) => loan2.balance - loan1.balance;
    default:
      return (loan1, loan2) => loan2.interestRate - loan1.interestRate;
  }
}

export const getDebtPayoffSortFunction = createSelector(
  [(state) => state.userPreferences.payoffMehthod],
  selectSortFunction
);
