import { createSelector } from "@reduxjs/toolkit";
import { PayoffMethod } from "../constants";
import { RootState } from "../rootReducer";

export function selectSortFunction(payoffMethod = PayoffMethod.DEBT_AVALANCHE) {
  switch (payoffMethod) {
    case PayoffMethod.DEBT_SNOWBALL:
      return (loan1, loan2) => loan1.balance - loan2.balance;
    case PayoffMethod.DEBT_AVALANCHE:
    default:
      return (loan1, loan2) => loan2.interestRate - loan1.interestRate;
  }
}

export const getDebtPayoffSortFunction = createSelector(
  [(state: RootState) => state.userPreferences.payoffMethod],
  selectSortFunction
);
