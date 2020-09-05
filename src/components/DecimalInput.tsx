import React, { useCallback } from "react";

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

const DecimalInput = ({
  max = Number.MAX_SAFE_INTEGER,
  pattern = "\\d*",
  onValueChange,
  value,
  ...remainingProps
}) => {
  const intValue = Math.trunc(
    Number.parseFloat(((value || 0) * 100).toFixed(2))
  );
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    throw new Error(`invalid value property ${intValue}`);
  }
  const handleKeyDown = useCallback(
    (e) => {
      const { key, keyCode } = e;
      if (
        (intValue === 0 && !VALID_FIRST.test(key)) ||
        (intValue !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }
      const valueString = intValue.toString();
      let nextValue;
      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString = value === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue =
          nextValueString === "" ? 0 : Number.parseInt(nextValueString, 10);
      }
      if (Number.parseFloat((nextValue / 100).toFixed(2)) > max) {
        return;
      }
      onValueChange(nextValue / 100);
    },
    [max, onValueChange, value, intValue]
  );
  const handleChange = useCallback(() => {
    // DUMMY TO AVOID REACT WARNING
  }, []);
  const valueDisplay = (intValue / 100).toFixed(2);
  const { inputRef = "", ...passedProps } = remainingProps;
  return (
    <input
      {...passedProps}
      inputMode="numeric"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={valueDisplay}
      ref={inputRef}
      pattern={pattern}
    />
  );
};

export default DecimalInput;
