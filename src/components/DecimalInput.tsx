import React from "react";
import CurrencyInput from "./react-currency-input";

function DecimalInput(props) {
  const { inputRef, onChange, max, ...other } = props;

  const generateChangeEvent = (floatValue: number) => {
    let value = floatValue;
    if (max !== undefined && floatValue > max) {
      value = max;
    }
    onChange({
      target: {
        name: props.name,
        value: value,
      },
    });
  };

  return (
    <CurrencyInput
      onChangeEvent={(_event, _maskedValue, floatValue: number) => {
        generateChangeEvent(floatValue);
      }}
      selectAllOnFocus
      inputMode="numeric"
      pattern={"\\d*"}
      {...other}
    />
  );
}

DecimalInput.defaultProps = {
  max: undefined,
};

export default DecimalInput;
