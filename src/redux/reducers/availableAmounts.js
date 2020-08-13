import * as Actions from "../actions";
import moment from "moment";

const initialState = {
  desiredSpending: 0,
  forLoanPayments: 0,
  date: moment.now(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_DESIRED_SPENDING:
      return {
        ...state,
        desiredSpending: action.payload,
      };
    case Actions.SET_AVAILABLE_LOAN_PAYMENT_AMOUNT:
      return {
        ...state,
        forLoanPayments: action.payload,
      };
    case Actions.SET_DESIRED_SPENDING_DATE:
      return {
        ...state,
        date: action.payload,
      };
    default:
      return state;
  }
};
