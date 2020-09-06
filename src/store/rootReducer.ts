import { combineReducers } from "redux";
import loanReducer from "./loans/reducer";
import availableAmountsReducer from "./availableAmounts/reducer";
import userPreferencesReducer from "./userPreferences/reducer";

export const rootReducer = combineReducers({
  loans: loanReducer,
  availableAmounts: availableAmountsReducer,
  userPreferences: userPreferencesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
