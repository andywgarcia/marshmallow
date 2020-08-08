import * as Actions from "../actions";

const initialState = {
  desiredSpending: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_DESIRED_SPENDING:
      return {
        ...state,
        desiredSpending: action.payload,
      };
    default:
      return state;
  }
};
