import * as Actions from "../actions";
import { loadState } from "../localStorage";

const initialCurrentLoan = {
  currentBalance: 10000,
  interestRate: 3,
  monthlyPayment: 100,
};
const initialState = {
  currentLoan: { ...initialCurrentLoan },
  allLoans: [],
};

const newLoan = {
  id: null,
  balance: 0,
  interestRate: 0,
  monthlyMinimumPayment: 0,
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
    case Actions.UPDATE_LOAN:
      return {
        ...state,
        allLoans: state.allLoans.map((loan) => {
          if (loan.id !== action.payload.id) {
            return loan;
          }
          return {
            ...loan,
            ...action.payload,
          };
        }),
      };
    case Actions.ADD_LOAN:
      return {
        ...state,
        allLoans: [...state.allLoans, { ...newLoan, id: action.payload }],
      };
    default:
      return state;
  }
};
