import React, { ChangeEventHandler } from "react";

interface NumberInputProps {
  placeholder?: string;
  value?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const NumberInput: React.FC<NumberInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="numberInput-container">
      <input
        max={99999}
        min={0}
        className="numberInput"
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          +e.target.value <= 99999 &&
          +e.target.value >= 0 &&
          onChange &&
          onChange(e)
        }
      />
      <div className="numberInput-placeholder">{"متر مربع"}</div>
    </div>
  );
};

export default NumberInput;
