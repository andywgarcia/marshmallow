import { PAYOFF_METHODS } from "../constants";
import { State } from "./types";

const initialState: State = {
  payoffMethod: PAYOFF_METHODS.DEBT_AVALANCHE,
};

export default (state: State = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
