import { PAYOFF_METHODS } from "../constants";

const initialState = {
  payoffMethod: PAYOFF_METHODS.DEBT_SNOWBALL,
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};