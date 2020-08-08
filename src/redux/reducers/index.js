import { combineReducers } from "redux";
import loanReducer from "./loans";
import availableAmountsReducer from "./availableAmounts";

export default combineReducers({
  loans: loanReducer,
  availableAmounts: availableAmountsReducer,
});
