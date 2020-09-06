import { createAction } from "@reduxjs/toolkit";
import * as Actions from "../actionTypes";

export const updateLoan = createAction(Actions.UPDATE_LOAN);
export const addLoan = createAction(Actions.ADD_LOAN);
export const removeLoan = createAction(Actions.REMOVE_LOAN);
