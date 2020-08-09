import React, { useState } from "react";
import { connect } from "react-redux";
import { updateLoan } from "../redux/actionCreators";
import { TextField, InputAdornment } from "@material-ui/core";
import { getLoan } from "../redux/selectors";

function AddLoanForm(props) {
  const [balance, setBalance] = useState(props.balance);
  const [interest, setInterest] = useState(props.interestRate);
  const [monthlyMinPayment, setMonthlyMinPayment] = useState(
    props.monthlyMinimumPayment
  );
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
          value={balance}
          onChange={({ target: { value } }) => setBalance(value)}
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              balance: parseFloat(balance || 0),
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
          value={interest}
          onChange={({ target: { value } }) => setInterest(value)}
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              interestRate: parseFloat(interest || 0),
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
          value={monthlyMinPayment}
          onChange={({ target: { value } }) => setMonthlyMinPayment(value)}
          onBlur={() =>
            props.updateLoan({
              id: props.loanId,
              monthlyMinimumPayment: parseFloat(monthlyMinPayment || 0),
            })
          }
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return getLoan(state, ownProps);
};

const mapDispatchToProps = {
  updateLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLoanForm);
