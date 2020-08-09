import * as Actions from "./actions";
import { createAction } from "@reduxjs/toolkit";

export const setLoanInfo = createAction(Actions.SET_LOAN_INFO);

export const updateLoan = createAction(Actions.UPDATE_LOAN);

export const setDesiredSpending = (amount) => {
  return {
    type: Actions.SET_DESIRED_SPENDING,
    payload: parseFloat(amount || 0),
  };
};

export const addLoan = createAction(Actions.ADD_LOAN);
