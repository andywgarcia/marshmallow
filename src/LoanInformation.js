import React, { useState } from "react";
import { connect } from "react-redux";
import { setLoanInfo } from "./redux/actionCreators";

function LoanInformation(props) {
  const [balance, setBalance] = useState(props.currentBalance);
  const [interest, setInterest] = useState(props.interestRate);
  const [monthlyPayment, setMonthlyPayment] = useState(props.monthlyPayment);
  return (
    <div>
      <h1>Loan Information</h1>
      <div>
        <span>Current Balance</span>
        <input
          value={balance}
          onChange={({ target: { value } }) => setBalance(value)}
          onBlur={() => props.setLoanInfo({ currentBalance: balance })}
        ></input>
      </div>
      <div>
        <span>Interest Rate</span>
        <input
          value={interest}
          onChange={({ target: { value } }) => setInterest(value)}
          onBlur={() => props.setLoanInfo({ interestRate: interest })}
        ></input>
      </div>
      <div>
        <span>Monthly Payment</span>
        <input
          value={monthlyPayment}
          onChange={({ target: { value } }) => setMonthlyPayment(value)}
          onBlur={() => props.setLoanInfo({ monthlyPayment: monthlyPayment })}
        ></input>
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
