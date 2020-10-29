import React from "react";
import { Button } from "@material-ui/core";
import { setDebtPayoffMethod } from "../store/actions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store/rootReducer";
import { PayoffMethod } from "../store/constants";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const mapStateToProps = (state: RootState) => {
  return {
    debtPayoffMethod: state.userPreferences.payoffMethod,
  };
};

const mapDispatchToProps = {
  setDebtPayoffMethod,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const DebtPayoffMethodDropdown = ({
  debtPayoffMethod,
  setDebtPayoffMethod,
}: PropsFromRedux) => {
  return (
    <FormControl>
      <InputLabel shrink>Debt Payoff Method</InputLabel>
      <Select
        style={{
          margin: "16px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
        value={debtPayoffMethod}
        onChange={({ target: { value } }) =>
          setDebtPayoffMethod(value as PayoffMethod)
        }
      >
        <MenuItem value={PayoffMethod.DEBT_SNOWBALL}>
          {PayoffMethod.DEBT_SNOWBALL}
        </MenuItem>
        <MenuItem value={PayoffMethod.DEBT_AVALANCHE}>
          {PayoffMethod.DEBT_AVALANCHE}
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default connector(DebtPayoffMethodDropdown);
