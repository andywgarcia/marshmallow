import React from "react";
import { connect } from "react-redux";
import { setDesiredSpending } from "../redux/actionCreators";

const Amount = ({ desiredSpendingAmount, setDesiredSpending }) => {
  return (
    <div>
      <h1>Amount</h1>
      <input
        value={desiredSpendingAmount}
        onChange={({ target: { value } }) => setDesiredSpending(value)}
      ></input>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    desiredSpendingAmount: state.loans.desiredSpending,
  };
};

const mapDispatchToProps = {
  setDesiredSpending,
};
export default connect(mapStateToProps, mapDispatchToProps)(Amount);
