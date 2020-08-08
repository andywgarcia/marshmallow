import * as Actions from "./actions";

export const setLoanInfo = (loanInfo) => {
  return {
    type: Actions.SET_LOAN_INFO,
    payload: loanInfo,
  };
};

export const setDesiredSpending = (amount) => {
  return {
    type: Actions.SET_DESIRED_SPENDING,
    payload: parseFloat(amount),
  };
};
