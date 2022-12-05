import React, { MouseEventHandler } from "react";

interface ButtonProps {
  children: any;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  color?: "success" | "danger";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color,
  disabled,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="button"
      style={{
        backgroundColor: color === "danger" ? "#FA1744" : "#00B086",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </div>
  );
};

export default Button;
