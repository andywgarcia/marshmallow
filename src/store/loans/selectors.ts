import { createSelector } from "reselect";
import { getDebtPayoffSortFunction } from "../userPreferences/selectors";
import moment, { Moment } from "moment";

import { RootState } from "../rootReducer";
import { Loan, LoanPayment, LoansPayment } from "./types";
import { Payment } from "../availableAmounts/types";

const getExtraPaymentAmountInMonth = (
  additionalPayments: Payment[],
  month: Moment
): number => {
  return additionalPayments.reduce((acc, curr) => {
    if (moment(curr.date).isSame(month, "month")) {
      return acc + (curr.amount || 0);
    }
    return acc;
  }, 0);
};

const getMonthlyMinimumPayment = (loans: Loan[], loanId: string): number => {
  return loans.find((loan) => loan.id === loanId).monthlyMinimumPayment;
};

const capitalizeBalance = (
  balance: number,
  rate: number,
  periodsPerYear = 12.0
): number => {
  return balance * (1 + rate / 100 / periodsPerYear);
};

const isLoanActive = (loan: Loan, date: Moment): boolean => {
  if (loan.date) {
    return moment(loan.date).isSameOrBefore(date, "month");
  }
  return true;
};

const getNextPayments = (
  loans: Loan[],
  paymentHistory: LoansPayment[],
  date = moment()
): {
  paymentsThisMonthWithoutAdditionalPayments: LoansPayment;
  spent: number;
} => {
  let spent = 0;
  const paymentsThisMonthWithoutAdditionalPayments = [...loans]
    // This needs to check for if the loan is active (loan A could have started 1 year before loan B, so loan B won't be active until after that first year)
    // .filter((loan) => isLoanActive(loan, date))
    .reverse()
    .reduce((acc, loan) => {
      const balance =
        paymentHistory.length > 0 &&
        paymentHistory[paymentHistory.length - 1][loan.id] !== undefined
          ? paymentHistory[paymentHistory.length - 1][loan.id].balance
          : loan.balance;

      const lastPayment =
        paymentHistory.length > 0 &&
        paymentHistory[paymentHistory.length - 1][loan.id] !== undefined
          ? paymentHistory[paymentHistory.length - 1][loan.id].payment
          : 0;
      const capitalizedBalance = capitalizeBalance(
        balance - lastPayment,
        loan.interestRate
      );
      let payment = 0;
      if (capitalizedBalance > 0) {
        const minPayment = getMonthlyMinimumPayment(loans, loan.id);
        if (capitalizedBalance <= minPayment) {
          payment = capitalizedBalance;
        } else {
          payment = minPayment;
        }
      }
      spent += payment;
      return {
        ...acc,
        [loan.id]: {
          ...loan,
          id: loan.id,
          balance: capitalizedBalance,
          payment: payment,
          interestRate: loan.interestRate,
        },
      };
    }, {});
  return { paymentsThisMonthWithoutAdditionalPayments, spent };
};

const getUpdatedPaymentsThisMonthWithExtraMonthlyPayments = (
  paymentsThisMonthWithoutAdditionalPayments: LoansPayment,
  sortFunction: (a: any, b: any) => number,
  extraPaymentAmount: number
): {
  updatedLoansPayment: LoansPayment;
  leftover: number;
} => {
  // This needs to check for if the loan is active (loan A could have started 1 year before loan B, so loan B won't be active until after that first year)
  const updatedLoanPayments: LoansPayment = Object.values(
    paymentsThisMonthWithoutAdditionalPayments
  )
    .filter(
      (loan: LoanPayment) =>
        Number.parseFloat((loan.balance - loan.payment).toFixed(2)) > 0
    )
    .sort(sortFunction)
    .map(
      (loan: LoanPayment): LoanPayment => {
        const remainingBalance = loan.balance - loan.payment;

        if (Number.parseFloat(remainingBalance.toFixed(2)) > 0) {
          let newPayment;
          if (remainingBalance < extraPaymentAmount) {
            newPayment = {
              ...loan,
              payment: loan.payment + remainingBalance,
              extraPayment: remainingBalance,
            };
            extraPaymentAmount -= remainingBalance;
          } else {
            newPayment = {
              ...loan,
              payment: loan.payment + extraPaymentAmount,
              extraPayment: extraPaymentAmount,
            };
            extraPaymentAmount = 0;
          }
          return newPayment;
        }
        return loan;
      }
    )
    .reduce((acc, payment): LoansPayment => {
      return { ...acc, [payment.id]: payment };
    }, {});

  return {
    updatedLoansPayment: updatedLoanPayments,
    leftover: extraPaymentAmount,
  };
};

const getOldestLoanDate = (loans: Loan[]): Moment => {
  return loans.reduce((acc, curr) => {
    if (curr.date && moment(curr.date).isBefore(acc)) {
      return moment(curr.date);
    }
    return acc;
  }, moment());
};

const generatePaymentPlan = (
  loans: Loan[],
  totalMonthlyPayment: number,
  debtSortFunction = (a: Loan, b: Loan) => 0,
  additionalPayments: Payment[] = []
): LoansPayment[] => {
  const MAX_MONTHS = 12 * 30;
  let currentMonth = 0;
  let startingDate = getOldestLoanDate(loans);
  let payments: LoansPayment[] = [];
  const sortedLoans = [...loans].sort(debtSortFunction);

  let balance = sortedLoans.reduce(
    (acc, curr) => capitalizeBalance(curr.balance, curr.interestRate) + acc,
    0
  );

  while (Number.parseFloat(balance.toFixed(2)) > 0) {
    const {
      paymentsThisMonthWithoutAdditionalPayments,
      spent: thisMonthsMinimumPaymentTotal,
    } = getNextPayments(
      loans,
      payments,
      moment(startingDate).add(currentMonth, "M")
    );

    const extraAmountThisMonth =
      totalMonthlyPayment -
      thisMonthsMinimumPaymentTotal +
      getExtraPaymentAmountInMonth(
        additionalPayments,
        moment(startingDate).add(currentMonth, "M")
      ); // This value assumes that the monthly payments will "roll over" when a loan finishes

    const {
      updatedLoansPayment: paymentsThisMonthWithAdditionalPayments,
    } = getUpdatedPaymentsThisMonthWithExtraMonthlyPayments(
      paymentsThisMonthWithoutAdditionalPayments,
      debtSortFunction,
      extraAmountThisMonth
    );

    const payment = {
      ...paymentsThisMonthWithoutAdditionalPayments,
      ...paymentsThisMonthWithAdditionalPayments,
    };

    payments.push(payment);
    balance = Object.keys(payment).reduce((acc, loanId) => {
      return acc + payment[loanId].balance - payment[loanId].payment;
    }, 0);
    currentMonth++;
    if (currentMonth > MAX_MONTHS) {
      break;
    }
  }
  return payments; // Adding in the loan dates means that the length of the payments aren't "from now", but instead, from the oldest date
};

export const getLoan = createSelector(
  [
    (state: RootState, props) =>
      state.loans.allLoans.find((loan) => loan.id === props.loanId),
  ],
  (loan) => loan
);

export const getTotalMonthlyMinPayment = createSelector(
  [(state: RootState) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.monthlyMinimumPayment; // total monthly minimum payment needs to be only active when the loan is active. Looks like this will have to be calculated in the function
    }, 0)
);

export const getTotalMonthlyPayment = createSelector(
  [
    (state: RootState) => state.loans.allLoans,
    (state: RootState) => state.availableAmounts.monthlyPayment, // total monthly minimum payment needs to be only active when the loan is active. Looks like this will have to be calculated in the function
  ],
  (loans, manualAmount) =>
    Math.max(
      loans.reduce((acc, curr) => {
        return acc + curr.monthlyMinimumPayment; // total monthly minimum payment needs to be only active when the loan is active. Looks like this will have to be calculated in the function
      }, 0),
      manualAmount || 0
    )
);

export const getPaymentPlan = createSelector(
  [
    (state: RootState) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAdditionalPayments = createSelector(
  [
    (state: RootState) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state: RootState) => state.availableAmounts.extraPayments || [],
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAdditionalDesiredSpending = createSelector(
  [
    (state: RootState) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state: RootState) => [
      state.availableAmounts.desiredSpending,
      ...(state.availableAmounts.extraPayments || []),
    ],
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAllPotentialAddtionalPayments = createSelector(
  [
    (state: RootState) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state: RootState) => [
      ...(state.availableAmounts.extraPayments || []),
      ...(state.availableAmounts.extraSpending || []),
    ],
  ],
  generatePaymentPlan
);

export const getTotalPrincipal = createSelector(
  [(state: any) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.balance;
    }, 0)
);

export const getMonthsAwayFromPayoff = createSelector(
  [getPaymentPlan],
  (paymentPlan) => paymentPlan.length
);

const getTotalPaidForPaymentPlan = (paymentPlan: LoansPayment[]): number =>
  paymentPlan.reduce((acc, curr) => {
    return (
      acc +
      Object.values(curr).reduce((monthsPayment, currentLoanPayment) => {
        return monthsPayment + currentLoanPayment.payment;
      }, 0)
    );
  }, 0);

export const getOriginalTotalPaid = createSelector(
  [getPaymentPlan],
  getTotalPaidForPaymentPlan
);
export const getTotalInterestPaid = createSelector(
  [getOriginalTotalPaid, getTotalPrincipal],
  (totalPaid, totalPrincipal) => totalPaid - totalPrincipal
);

export const getTotalPaidWithExtraPayments = createSelector(
  [getPaymentPlanWithAdditionalPayments],
  getTotalPaidForPaymentPlan
);

export const getTotalPaidWithDesiredSpending = createSelector(
  [getPaymentPlanWithAdditionalDesiredSpending],
  getTotalPaidForPaymentPlan
);

export const getPotentialTotalPaid = createSelector(
  [getPaymentPlanWithAllPotentialAddtionalPayments],
  getTotalPaidForPaymentPlan
);
