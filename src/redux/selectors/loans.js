import { createSelector } from "reselect";
import { getDebtPayoffSortFunction } from "./userPreferences";
import moment from "moment";

const getExtraPaymentAmountInMonth = (additionalPayments, month) => {
  return additionalPayments.reduce((acc, curr) => {
    if (moment(curr.date).isSame(month, "month")) {
      return acc + (parseFloat(curr.amount) || 0);
    }
    return acc;
  }, 0);
};

const getMonthlyMinimumPayment = (loans, loanId) => {
  return loans.find((loan) => loan.id === loanId).monthlyMinimumPayment;
};

const capitalizeBalance = (balance, rate, periodsPerYear = 12.0) => {
  return balance * (1 + rate / 100 / periodsPerYear);
};

const getNextPayments = (loans, paymentHistory) => {
  let spent = 0;
  const paymentsThisMonthWithoutAdditionalPayments = [...loans]
    .reverse()
    .reduce((acc, loan) => {
      // This needs to check for if the loan is active (loan A could have started 1 year before loan B, so loan B won't be active until after that first year)
      const balance =
        paymentHistory.length > 0
          ? paymentHistory[paymentHistory.length - 1][loan.id].balance
          : loan.balance;
      const lastPayment =
        paymentHistory.length > 0
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
          id: loan.id,
          balance: capitalizedBalance,
          payment: payment,
          interestRate: loan.interestRate,
        },
      };
    }, {});
  return [paymentsThisMonthWithoutAdditionalPayments, spent];
};

const getUpdatedPaymentsThisMonthWithExtraMonthlyPayments = (
  paymentsThisMonthWithoutAdditionalPayments,
  sortFunction,
  extraPaymentAmount
) => {
  // This needs to check for if the loan is active (loan A could have started 1 year before loan B, so loan B won't be active until after that first year)
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
    })
    .reduce((acc, payment) => {
      return { ...acc, [payment.id]: payment };
    }, {});

  return [updatedLoanPayments, extraPaymentAmount];
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
debtSortFunction: () => 0 //default to no sorting, maybe this should just be the debt repayment method?
additionalPayments: 
[
  {
    id: guid,
    date: "date-time",
    amount: 0
  }
]


output
[
    {
        <loan1-id>: {
            balance: 0, // after growth, before payment
            paymentAmount: 0
        }
    }
]

*/
const generatePaymentPlan = (
  loans,
  totalMonthlyPayment,
  debtSortFunction = () => 0,
  additionalPayments = []
) => {
  console.log(loans);
  const MAX_MONTHS = 12 * 30;
  let currentMonth = 0;
  let currentDate = moment(); // TODO: This needs to start with the oldest loan
  let payments = [];
  const sortedLoans = [...loans].sort(debtSortFunction);

  let balance = sortedLoans.reduce(
    (acc, curr) => capitalizeBalance(curr.balance, curr.interestRate) + acc,
    0
  );

  while (balance.toFixed(2) > 0) {
    const [
      paymentsThisMonthWithoutAdditionalPayments,
      thisMonthsMinimumPaymentTotal,
    ] = getNextPayments(loans, payments);

    const extraAmountThisMonth =
      totalMonthlyPayment -
      thisMonthsMinimumPaymentTotal +
      getExtraPaymentAmountInMonth(
        additionalPayments,
        moment(currentDate).add(currentMonth, "M")
      ); // This value assumes that the monthly payments will "roll over" when a loan finishes

    const [
      paymentsThisMonthWithAdditionalPayments,
    ] = getUpdatedPaymentsThisMonthWithExtraMonthlyPayments(
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
    (state, props) =>
      state.loans.allLoans.find((loan) => loan.id === props.loanId),
  ],
  (loan) => loan
);

export const getTotalMonthlyMinPayment = createSelector(
  [(state) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.monthlyMinimumPayment;
    }, 0)
);

export const getTotalMonthlyPayment = createSelector(
  [
    (state) => state.loans.allLoans,
    (state) => state.availableAmounts.monthlyPayment,
  ],
  (loans, manualAmount) =>
    Math.max(
      loans.reduce((acc, curr) => {
        return acc + curr.monthlyMinimumPayment;
      }, 0),
      manualAmount || 0
    )
);

export const getPaymentPlan = createSelector(
  [
    (state) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAdditionalPayments = createSelector(
  [
    (state) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state) => state.availableAmounts.extraPayments || [],
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAdditionalDesiredSpending = createSelector(
  [
    (state) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state) => [
      state.availableAmounts.desiredSpending,
      ...(state.availableAmounts.extraPayments || []),
    ],
  ],
  generatePaymentPlan
);

export const getPaymentPlanWithAllPotentialAddtionalPayments = createSelector(
  [
    (state) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    (state) => [
      ...(state.availableAmounts.extraPayments || []),
      ...(state.availableAmounts.extraSpending || []),
    ],
  ],
  generatePaymentPlan
);

export const getTotalPrincipal = createSelector(
  [(state) => state.loans.allLoans],
  (loans) =>
    loans.reduce((acc, curr) => {
      return acc + curr.balance;
    }, 0)
);

export const getMonthsAwayFromPayoff = createSelector(
  [getPaymentPlan],
  (paymentPlan) => paymentPlan.length
);

const getTotalPaidForPaymentPlan = (paymentPlan) =>
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
