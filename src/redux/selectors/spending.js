import { createSelector } from "reselect";
import moment from "moment";

export const getSpendingHistory = createSelector(
  [
    (state) => state.availableAmounts.date,
    (state) => state.availableAmounts.desiredSpending,
  ],
  (date, desiredSpending) => ({
    [moment(date).format("MM-YYYY")]: desiredSpending,
  })
);
