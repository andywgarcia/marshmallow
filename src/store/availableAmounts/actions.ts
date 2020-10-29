import { createAction } from "@reduxjs/toolkit";
import * as Actions from "../actionTypes";
import { Moment } from "moment";

interface DesiredSpendingPayload {
  date?: Moment;
  amount?: number;
}

export const setDesiredSpending = createAction<DesiredSpendingPayload>(
  Actions.SET_DESIRED_SPENDING
);

export const addExtraPayment = createAction(Actions.ADD_EXTRA_PAYMENT);

export const setAvailableLoanPaymentAmount = createAction<number>(
  Actions.SET_AVAILABLE_LOAN_PAYMENT_AMOUNT
);

export const addExtraSpending = createAction(Actions.ADD_EXTRA_SPENDING);
