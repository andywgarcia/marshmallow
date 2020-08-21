import * as Actions from "../actions";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  desiredSpendingAmount: 0,
  date: moment.now(),
  desiredSpending: {
    id: uuidv4(),
    date: moment.now(),
    amount: 0,
  },
  monthlyPayment: 0,
  extraPayments: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_DESIRED_SPENDING_AMOUNT:
      return {
        ...state,
        desiredSpendingAmount: action.payload,
      };
    case Actions.SET_DESIRED_SPENDING:
      return {
        ...state,
        desiredSpending: {
          ...state.desiredSpending,
          ...action.payload,
        },
      };
    case Actions.SET_AVAILABLE_LOAN_PAYMENT_AMOUNT:
      return {
        ...state,
        monthlyPayment: action.payload,
      };
    case Actions.SET_DESIRED_SPENDING_DATE:
      return {
        ...state,
        date: action.payload,
      };
    case Actions.ADD_EXTRA_PAYMENT:
      return {
        ...state,
        extraPayments: [
          ...(state.extraPayments || []),
          { ...action.payload, id: uuidv4() },
        ],
      };
    default:
      return state;
  }
};
