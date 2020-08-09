import { createSelector } from "reselect";

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
        ? balance
        : currentLoan.monthlyPayment;
    if (growthAmount > currentMonthPayment) {
      return { ...initalPayoffDetails };
    }

    totalInterest += growthAmount;
    payments.push(currentMonthPayment);

    // Capitalize
    balance = parseFloat(balance) + parseFloat(growthAmount);

    // Pay monthly payment
    balance = balance - currentMonthPayment;

    // Only use the extra payment once
    if (!usedDesiredSpending) {
      balance = balance - (desiredSpending || 0);
      usedDesiredSpending = true;
    }

    // Don't let it go longer than 30 years for performance sake
    if (payments.length > 12 * 30) {
      return 12 * 30;
    }
  }
  return { payments, totalInterest };
};

const calculatePayoffDetails = (allLoans) => {
  return allLoans.reduce(
    (acc, curr) => {
      const payoffDetails = getPayoffDetails({
        currentBalance: curr.balance,
        interestRate: curr.interestRate,
        monthlyPayment: curr.monthlyMinimumPayment,
      });
      return {
        ...acc,
        payments:
          acc.payments.length > payoffDetails.payments.length
            ? acc.payments
            : payoffDetails.payments,
        totalInterest: acc.totalInterest + payoffDetails.totalInterest,
      };
    },
    { payments: [], totalInterest: 0 }
  );
};

const getCurrentLoan = (state) => state.loans.currentLoan;
const getDesiredSpending = (state) => state.availableAmounts.desiredSpending;

export const payoffDetails = createSelector([getCurrentLoan], (currentLoan) => {
  return getPayoffDetails(currentLoan, 0);
});

export const payoffSavingsDetails = createSelector(
  [getCurrentLoan, getDesiredSpending],
  getPayoffDetails
);

export const originalPayoffDetails = createSelector(
  [(state) => state.loans.allLoans],
  calculatePayoffDetails
);

export const getLoan = createSelector(
  [
    (state, props) =>
      state.loans.allLoans.find((loan) => loan.id === props.loanId),
  ],
  (loan) => loan
);
