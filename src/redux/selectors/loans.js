import { createSelector } from "reselect";
import { getDebtPayoffSortFunction } from "./userPreferences";

const initalPayoffDetails = {
  payments: [],
  totalInterest: 0,
};

const getPayoffDetails = (currentLoan, desiredSpending) => {
  // Assumes monthly capitalization
  if (
    parseInt(currentLoan.currentBalance || 0) === 0 ||
    parseInt(currentLoan.interestRate || 0) === 0 ||
    parseInt(currentLoan.monthlyPayment || 0) === 0
  ) {
    return { ...initalPayoffDetails };
  }
  let balance = parseFloat(currentLoan.currentBalance);
  const monthlyRate = currentLoan.interestRate / 12.0 / 100.0;
  let totalInterest = 0.0;
  let payments = [];
  let usedDesiredSpending = false;
  while (balance.toFixed(2) > 0) {
    const growthAmount = balance * monthlyRate;
    const currentMonthPayment =
      balance - currentLoan.monthlyPayment < 0
        ? balance + growthAmount
        : currentLoan.monthlyPayment;
    let actualMonthlyPaymentSpent = currentMonthPayment;
    if (growthAmount > currentMonthPayment) {
      return { ...initalPayoffDetails };
    }

    totalInterest += growthAmount;

    // Capitalize
    balance = balance + growthAmount;

    // Pay monthly payment
    balance = balance - currentMonthPayment;

    // Only use the extra payment once
    if (!usedDesiredSpending) {
      balance = balance - (desiredSpending || 0);
      actualMonthlyPaymentSpent = actualMonthlyPaymentSpent + desiredSpending;
      usedDesiredSpending = true;
    }
    payments.push(actualMonthlyPaymentSpent);

    // Don't let it go longer than 30 years for performance sake
    if (payments.length > 12 * 30) {
      return 12 * 30;
    }
  }
  return { payments, totalInterest };
};

const calculatePayoffDetails = (
  allLoans,
  debtSortFunction,
  desiredSpending = 0
) => {
  return [...allLoans].sort(debtSortFunction).reduce(
    (acc, curr, index) => {
      const payoffDetails = getPayoffDetails(
        {
          currentBalance: curr.balance,
          interestRate: curr.interestRate,
          monthlyPayment: curr.monthlyMinimumPayment,
        },
        index === 0 ? desiredSpending : 0
      );
      return {
        ...acc,
        payments: [
          ...acc.payments,
          {
            loanId: curr.id,
            payments: payoffDetails.payments,
          },
        ],
        totalInterest: acc.totalInterest + payoffDetails.totalInterest,
      };
    },
    { payments: [], totalInterest: 0 }
  );
};

export const payoffSavingsDetails = createSelector(
  [
    (state) => state.loans.allLoans,
    getDebtPayoffSortFunction,
    (state) => state.availableAmounts.desiredSpending,
  ],
  calculatePayoffDetails
);

export const originalPayoffDetails = createSelector(
  [(state) => state.loans.allLoans, getDebtPayoffSortFunction],
  calculatePayoffDetails
);

export const getLoan = createSelector(
  [
    (state, props) =>
      state.loans.allLoans.find((loan) => loan.id === props.loanId),
  ],
  (loan) => loan
);
