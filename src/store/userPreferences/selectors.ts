import { createSelector } from "@reduxjs/toolkit";
import { PAYOFF_METHODS } from "../constants";
import { RootState } from "../rootReducer";

export function selectSortFunction(
  payoffMethod = PAYOFF_METHODS.DEBT_AVALANCHE
) {
  console.log("Payoff method: ", payoffMethod);
  switch (payoffMethod) {
    case PAYOFF_METHODS.DEBT_SNOWBALL:
      return (loan1, loan2) => loan1.balance - loan2.balance;
    case PAYOFF_METHODS.DEBT_AVALANCHE:
    default:
      return (loan1, loan2) => loan2.interestRate - loan1.interestRate;
  }
}

export const getDebtPayoffSortFunction = createSelector(
  [(state: RootState) => state.userPreferences.payoffMethod],
  selectSortFunction
);
