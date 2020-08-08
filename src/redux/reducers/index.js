import * as Actions from "../actions";

const initalPayoffDetails = {
  payments: [],
  totalInterest: 0,
};

const initialState = {
  desiredSpending: 0,
  currentLoan: { currentBalance: 10000, interestRate: 3, monthlyPayment: 100 },
  payoffDetails: { ...initalPayoffDetails },
  payoffSavingsDetails: { ...initalPayoffDetails },
};

function getPayoffDetails(
  { currentBalance, interestRate, monthlyPayment },
  extraPayment = 0
) {
  // Assumes monthly capitalization
  if (
    parseInt(currentBalance) === 0 ||
    parseInt(interestRate) === 0 ||
    parseInt(monthlyPayment) === 0
  ) {
    return { ...initalPayoffDetails };
  }
  let balance = parseFloat(currentBalance);
  const monthlyRate = interestRate / 12.0 / 100.0;
  let totalInterest = 0.0;
  let payments = [];
  while (balance.toFixed(2) > 0) {
    const growthAmount = balance * monthlyRate;
    const currentMonthPayment =
      balance - monthlyPayment < 0 ? balance : monthlyPayment;
    if (growthAmount > currentMonthPayment) {
      return { ...initalPayoffDetails };
    }

    totalInterest += growthAmount;
    payments.push(currentMonthPayment);

    // Capitalize
    balance = parseFloat(balance) + parseFloat(growthAmount);

    // Pay monthly payment
    balance = balance - currentMonthPayment - extraPayment;

    // Only use the extra payment once
    extraPayment = 0;

    // Don't let it go longer than 30 years for performance sake
    if (payments.length > 12 * 30) {
      return 12 * 30;
    }
  }
  return { payments, totalInterest };
}

function rootReducer(state = initialState, action) {
  console.log(state, action);
  switch (action.type) {
    case Actions.SET_LOAN_INFO:
      const newCurrentLoan = {
        currentBalance: parseFloat(
          action.payload.currentBalance || state.currentLoan.currentBalance
        ).toFixed(2),
        interestRate: parseFloat(
          action.payload.interestRate || state.currentLoan.interestRate
        ).toFixed(2),
        monthlyPayment: parseFloat(
          action.payload.monthlyPayment || state.currentLoan.monthlyPayment
        ).toFixed(2),
      };

      return {
        ...state,
        currentLoan: newCurrentLoan,
        payoffDetails: getPayoffDetails(newCurrentLoan),
        payoffSavingsDetails: getPayoffDetails(newCurrentLoan),
      };
    case Actions.SET_DESIRED_SPENDING:
      return {
        ...state,
        desiredSpending: action.payload,
        payoffDetails: getPayoffDetails(state.currentLoan),
        payoffSavingsDetails: getPayoffDetails(
          state.currentLoan,
          action.payload
        ),
      };
    default:
      return state;
  }
}

export default rootReducer;
