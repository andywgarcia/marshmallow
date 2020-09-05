import { createSelector } from "reselect";
import moment from "moment";
import { RootState } from "../reducers";

export const getSpendingHistory = createSelector(
  [
    (state: any) => state.availableAmounts.date,
    (state: any) => state.availableAmounts.desiredSpendingAmount,
  ],
  (date, desiredSpendingAmount) => ({
    [moment(date).format("MM-YYYY")]: desiredSpendingAmount,
  })
);
