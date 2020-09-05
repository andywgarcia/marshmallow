import React from "react";
import { Button } from "@material-ui/core";
import { addExtraPayment, addExtraSpending } from "../redux/actionCreators";
import { connect } from "react-redux";

const SpendOrSave = (props) => {
  return (
    <div
      style={{
        margin: "16px",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.addExtraPayment(props.desiredSpending)}
      >
        Put towards loans
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => props.addExtraSpending(props.desiredSpending)}
      >
        Spend
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    desiredSpending: state.availableAmounts.desiredSpending,
  };
};

const mapDispatchToProps = {
  addExtraPayment,
  addExtraSpending,
};

export default connect(mapStateToProps, mapDispatchToProps)(SpendOrSave);
