import * as Actions from "../actions";

const initialState = {
  desiredSpending: 0,
  forLoanPayments: 0,
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
    default:
      return state;
  }
};
