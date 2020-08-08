import * as Actions from "../actions";

const initialCurrentLoan = {
  currentBalance: 10000,
  interestRate: 3,
  monthlyPayment: 100,
};
const initialState = {
  currentLoan: { ...initialCurrentLoan },
  allLoans: [],
};

export default (state = initialState, action) => {
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
      };
    default:
      return state;
  }
};
