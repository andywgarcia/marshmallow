import React from "react";
import { connect } from "react-redux";
import { setDesiredSpending } from "../redux/actionCreators";
import { TextField } from "@material-ui/core";

const Amount = ({ desiredSpendingAmount, setDesiredSpending }) => {
  return (
    <div>
      {" "}
      <h1>Available Amounts</h1>
      <div>
        <TextField
          id="amount-input"
          label="Amount"
          margin="normal"
          variant="outlined"
          value={desiredSpendingAmount}
          onChange={({ target: { value } }) => setDesiredSpending(value)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    desiredSpendingAmount: state.availableAmounts.desiredSpending,
  };
};

const mapDispatchToProps = {
  setDesiredSpending,
};
export default connect(mapStateToProps, mapDispatchToProps)(Amount);
