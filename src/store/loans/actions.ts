import { createAction } from "@reduxjs/toolkit";
import * as Actions from "../actionTypes";
import { Loan } from "./types";

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const updateLoan = createAction<AtLeast<Loan, "id">>(
  Actions.UPDATE_LOAN
);
export const addLoan = createAction<Loan>(Actions.ADD_LOAN);
export const removeLoan = createAction<string>(Actions.REMOVE_LOAN);
