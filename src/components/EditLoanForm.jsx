import React from "react";
import { connect } from "react-redux";
import { updateLoan } from "../redux/actionCreators";
import { TextField, InputAdornment } from "@material-ui/core";
import { getLoan } from "../redux/selectors";

function AddLoanForm(props) {
  return (
    <div>
      <h1>Loan Information</h1>
      <div>
        <TextField
          id="loan-current-balance-input"
          label="Current Balance"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={props.balance}
          onChange={({ target: { value } }) =>
            props.updateLoan({
              id: props.loanId,
              balance: parseFloat(value || 0),
            })
          }
        />
      </div>
      <div>
        <TextField
          id="loan-interest-rate-input"
          label="Interest Rate %"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          value={props.interestRate}
          onChange={({ target: { value } }) =>
            props.updateLoan({
              id: props.loanId,
              interestRate: parseFloat(value || 0),
            })
          }
        />
      </div>
      <div>
        <TextField
          id="loan-monthly-min-payment-input"
          label="Monthly Minimum Payment"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={props.monthlyMinimumPayment}
          onChange={({ target: { value } }) =>
            props.updateLoan({
              id: props.loanId,
              monthlyMinimumPayment: parseFloat(value || 0),
            })
          }
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const loan = getLoan(state, ownProps);
  return {
    id: loan.id,
    balance: loan.balance,
    interestRate: loan.interestRate,
    monthlyMinimumPayment: loan.monthlyMinimumPayment,
  };
};

const mapDispatchToProps = {
  updateLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanForm);
