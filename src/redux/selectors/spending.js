import { createSelector } from "reselect";
import moment from "moment";

export const getSpendingHistory = createSelector(
  [
    (state) => state.availableAmounts.date,
    (state) => state.availableAmounts.desiredSpendingAmount,
  ],
  (date, desiredSpendingAmount) => ({
    [moment(date).format("MM-YYYY")]: desiredSpendingAmount,
  })
);
