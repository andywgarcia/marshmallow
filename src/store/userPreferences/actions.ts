import { createAction } from "@reduxjs/toolkit";
import * as Actions from "../actionTypes";
import { PayoffMethod } from "../constants";

export const setDebtPayoffMethod = createAction<PayoffMethod>(
  Actions.SET_DEBT_PAYOFF_METHOD
);
