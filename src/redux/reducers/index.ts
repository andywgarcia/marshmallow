import { combineReducers } from "redux";
import loanReducer from "./loans";
import availableAmountsReducer from "./availableAmounts";
import userPreferencesReducer from "./userPreferences";

export const rootReducer = combineReducers({
  loans: loanReducer,
  availableAmounts: availableAmountsReducer,
  userPreferences: userPreferencesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
