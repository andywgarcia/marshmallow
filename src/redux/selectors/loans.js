import { createSelector } from "reselect";
import { getDebtPayoffSortFunction } from "./userPreferences";
import { getSpendingHistory } from "./spending";
import moment from "moment";

const getExtraPaymentAmountInMonth = (additionalPayments, month) => {
  console.log(additionalPayments);
  additionalPayments.reduce((acc, curr) => {
    if (moment(curr.date).isSame(month, "month")) {
      return acc + curr.amount;
    }
  }, 0);
  return 0;
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
  additionalPayments = [] // I switched additional payments to an array, which it needs to be, but now I need to update the input side of things
) => {
  const MAX_MONTHS = 12 * 30;
  let currentMonth = 0;
  let currentDate = moment.now();
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

    const getPaymentsThisMonthWithExtraMonthlyPayments = (
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

    const [newPayment, leftover] = getPaymentsThisMonthWithExtraMonthlyPayments(
      paymentsThisMonthWithoutAdditionalPayments,
      debtSortFunction,
      currentMonthAllowedPaymentAmount +
        getExtraPaymentAmountInMonth(
          additionalPayments,
          moment(currentDate).add(currentMonth, "M")
        )
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
    (state) => state.availableAmounts.forLoanPayments,
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

export const getPaymentPlanWithAdditionalSpending = createSelector(
  [
    (state) => state.loans.allLoans,
    getTotalMonthlyPayment,
    getDebtPayoffSortFunction,
    getSpendingHistory,
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

export const getPotentialTotalPaid = createSelector(
  [getPaymentPlanWithAdditionalSpending],
  getTotalPaidForPaymentPlan
);
