import React, { useState } from "react";
import { connect } from "react-redux";
import { setLoanInfo } from "../redux/actionCreators";
import TextField from "@material-ui/core/TextField";

function LoanInformation(props) {
  const [balance, setBalance] = useState(props.currentBalance);
  const [interest, setInterest] = useState(props.interestRate);
  const [monthlyPayment, setMonthlyPayment] = useState(props.monthlyPayment);
  return (
    <div>
      <h1>Loan Information</h1>
      <div>
        <TextField
          id="loan-current-balance-input"
          label="Current Balance"
          variant="filled"
          value={balance}
          onChange={({ target: { value } }) => setBalance(value)}
          onBlur={() => props.setLoanInfo({ currentBalance: balance })}
        />
      </div>
      <div>
        <TextField
          id="loan-interest-rate-input"
          label="Interest Rate %"
          variant="filled"
          value={interest}
          onChange={({ target: { value } }) => setInterest(value)}
          onBlur={() => props.setLoanInfo({ interestRate: interest })}
        />
      </div>
      <div>
        <TextField
          id="loan-monthly-payment-input"
          label="Monthly Payment"
          variant="filled"
          value={monthlyPayment}
          onChange={({ target: { value } }) => setMonthlyPayment(value)}
          onBlur={() => props.setLoanInfo({ monthlyPayment: monthlyPayment })}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state.loans.currentLoan,
});

const mapDispatchToProps = {
  setLoanInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanInformation);
