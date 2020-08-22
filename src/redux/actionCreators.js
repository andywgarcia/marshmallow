import * as Actions from "./actions";
import { createAction } from "@reduxjs/toolkit";

export const setLoanInfo = createAction(Actions.SET_LOAN_INFO);

export const updateLoan = createAction(Actions.UPDATE_LOAN);
export const setDesiredSpending = createAction(Actions.SET_DESIRED_SPENDING);

export const addExtraPayment = createAction(Actions.ADD_EXTRA_PAYMENT);

export const addLoan = createAction(Actions.ADD_LOAN);
export const setAvailableLoanPaymentAmount = createAction(
  Actions.SET_AVAILABLE_LOAN_PAYMENT_AMOUNT
);

export const setDesiredLoanSpendingDate = createAction(
  Actions.SET_DESIRED_SPENDING_DATE
);

export const addExtraSpending = createAction(Actions.ADD_EXTRA_SPENDING);
