import { PayoffMethod } from "../constants";
import { State } from "./types";
import { SET_DEBT_PAYOFF_METHOD } from "../actionTypes";

const initialState: State = {
  payoffMethod: PayoffMethod.DEBT_SNOWBALL,
};

export default (state: State = initialState, action) => {
  switch (action.type) {
    case SET_DEBT_PAYOFF_METHOD:
      return { ...state, payoffMethod: action.payload };
    default:
      return state;
  }
};
