import React, { ChangeEventHandler } from "react";

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      className="textInput"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextInput;
