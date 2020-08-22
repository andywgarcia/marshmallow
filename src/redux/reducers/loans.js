import * as Actions from "../actions";
import moment from "moment";

const initialState = {
  allLoans: [],
};

const newLoan = {
  id: null,
  balance: 0,
  interestRate: 0,
  monthlyMinimumPayment: 0,
  date: moment(),
};

export default (state = initialState, action) => {
  switch (action.type) {
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
    case Actions.REMOVE_LOAN:
      return {
        ...state,
        allLoans: state.allLoans.filter(({ id }) => id !== action.payload),
      };
    default:
      return state;
  }
};
