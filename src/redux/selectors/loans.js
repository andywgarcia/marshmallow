import { createSelector } from "reselect";
import { getDebtPayoffSortFunction } from "./userPreferences";
import { get, isNull } from "lodash";

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

/*
input
[
    {
        id: "guid",
        balance: 0,
        interestRate: 0,
        monthlyMinimumPayment: 0
    }
],
totalMonthlyPayment: 0 | null --> If null, use sum of all monthly minimum payments. If less than sum of all monthly minimum payments, use sum of all monthly minimum payments
debtSortFunction: () => 0 //default to no sorting

output
[
    {
        <loan1-id>: {
            balance: 0, // but after growth
            paymentAmount: 0
        }
    }
]


*/

const generatePaymentPlan = (
  loans,
  totalMonthlyPayment,
  debtSortFunction = () => 0
) => {
  const totalMonthlyMinimumPayments = loans.reduce(
    (acc, curr) => curr.monthlyMinimumPayment + acc,
    0
  );

  if (
    totalMonthlyPayment === null ||
    totalMonthlyPayment < totalMonthlyMinimumPayments
  ) {
    totalMonthlyPayment = totalMonthlyMinimumPayments;
  }

  const MAX_MONTHS = 12 * 30;
  let currentMonth = 0;
  let payments = [];
  const sortedLoans = [...loans].sort(debtSortFunction);

  let balance = sortedLoans.reduce(
    (acc, curr) => curr.balance * (1 + curr.interestRate / 100 / 12.0) + acc,
    0
  );
  const getMonthlyMinimumPayment = (loanId) => {
    return loans.find((loan) => loan.id === loanId).monthlyMinimumPayment;
  };

  while (balance.toFixed(2) > 0) {
    let currentMonthAllowedPaymentAmount = totalMonthlyPayment;
    const paymentsThisMonthWithoutAdditionalPayments = [...sortedLoans]
      .reverse()
      .reduce((acc, loan) => {
        const balance =
          payments.length > 0
            ? payments[payments.length - 1][loan.id].balance
            : loan.balance;
        const lastPayment =
          payments.length > 0
            ? payments[payments.length - 1][loan.id].payment
            : 0;
        const capitalizedBalance =
          (balance - lastPayment) * (1 + loan.interestRate / 100 / 12.0);
        let payment = 0;
        if (capitalizedBalance > 0) {
          if (capitalizedBalance <= getMonthlyMinimumPayment(loan.id)) {
            payment = capitalizedBalance;
          } else {
            payment = getMonthlyMinimumPayment(loan.id);
          }
        }
        currentMonthAllowedPaymentAmount =
          currentMonthAllowedPaymentAmount - payment;
        return {
          ...acc,
          [loan.id]: {
            id: loan.id,
            balance: capitalizedBalance,
            payment: payment,
            interestRate: loan.interestRate,
          },
        };
      }, {});

    const getPaymentsThisMonthWithExtraPayments = (
      paymentsThisMonthWithoutAdditionalPayments,
      sortFunction,
      extraPaymentAmount
    ) => {
      const updatedLoanPayments = Object.values(
        paymentsThisMonthWithoutAdditionalPayments
      )
        .filter((loan) => (loan.balance - loan.payment).toFixed(2) > 0)
        .sort(sortFunction)
        .map((loan) => {
          const remainingBalance = loan.balance - loan.payment;

          if (remainingBalance.toFixed(2) > 0) {
            let newPayment;
            if (remainingBalance < extraPaymentAmount) {
              newPayment = {
                ...loan,
                payment: loan.payment + remainingBalance,
                extraPayment: remainingBalance,
              };
              extraPaymentAmount = extraPaymentAmount - remainingBalance;
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
        })
        .reduce((acc, payment) => {
          return { ...acc, [payment.id]: payment };
        }, {});

      return [updatedLoanPayments, extraPaymentAmount];
    };

    const [newPayment, leftover] = getPaymentsThisMonthWithExtraPayments(
      paymentsThisMonthWithoutAdditionalPayments,
      debtSortFunction,
      currentMonthAllowedPaymentAmount
    );

    currentMonthAllowedPaymentAmount = leftover;
    const payment = {
      ...paymentsThisMonthWithoutAdditionalPayments,
      ...newPayment,
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
  return payments;
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

export const getPaymentPlan = createSelector(
  [(state) => state.loans.allLoans, () => null, getDebtPayoffSortFunction],
  generatePaymentPlan
);

export const getTotalPrincipal = createSelector(
  [(state) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.balance;
    }, 0)
);

export const getTotalMonthlyPayment = createSelector(
  [(state) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.monthlyMinimumPayment;
    }, 0)
);

export const getMonthsAwayFromPayoff = createSelector(
  [getPaymentPlan],
  (paymentPlan) => paymentPlan.length
);
export const getTotalInterestPaid = createSelector(
  [getPaymentPlan],
  (paymentPlan) =>
    paymentPlan.reduce((acc, curr) => {
      return (
        acc +
        Object.values(curr).reduce((monthsPayment, currentLoanPayment) => {
          return monthsPayment + currentLoanPayment.payment;
        }, 0)
      );
    }, 0)
);
