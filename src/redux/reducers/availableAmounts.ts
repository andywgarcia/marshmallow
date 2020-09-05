import * as Actions from "../actions";
import moment, { Moment } from "moment";
import { v4 as uuidv4 } from "uuid";

export interface Payment {
  id: string;
  date: Moment;
  amount: number;
}

export interface State {
  desiredSpending: Payment;
  monthlyPayment: number;
  extraPayments: Payment[];
  extraSpending: Payment[];
}

const initialState: State = {
  desiredSpending: {
    id: uuidv4(),
    date: moment(),
    amount: 0,
  },
  monthlyPayment: 0,
  extraPayments: [],
  extraSpending: [],
};

export default (state: State = initialState, action) => {
  switch (action.type) {
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
    case Actions.ADD_EXTRA_PAYMENT:
      return {
        ...state,
        desiredSpending: {
          date: moment(),
          amount: 0,
        },
        extraPayments: [
          ...(state.extraPayments || []),
          { ...action.payload, id: uuidv4() },
        ],
      };
    case Actions.ADD_EXTRA_SPENDING:
      return {
        ...state,
        desiredSpending: {
          date: moment,
          amount: 0,
        },
        extraSpending: [
          ...(state.extraSpending || []),
          { ...action.payload, id: uuidv4() },
        ],
      };
    default:
      return state;
  }
};