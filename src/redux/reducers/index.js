import { combineReducers } from "redux";
import loanReducer from "./loans";
import availableAmountsReducer from "./availableAmounts";
import userPreferencesReducer from "./userPreferences";

export default combineReducers({
  loans: loanReducer,
  availableAmounts: availableAmountsReducer,
  userPreferences: userPreferencesReducer,
});
