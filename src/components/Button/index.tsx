import React from "react";

import "./Button.css";

interface Props {
  children: React.ReactNode;
  status?: string;
  disabled?: boolean;
  styleClass?: string;
  clickEvent?: Function;
}

const Button: React.FC<Props> = ({
  children,
  status,
  styleClass,
  clickEvent,
  disabled,
}) => {
  return (
    <button
      onClick={() => {
        clickEvent && clickEvent();
      }}
      disabled={disabled}
      className={`text-white rounded-full ${
        status === "logout" && "bg-cyan-500"
      } ${status === "google" && "bg-green-500"} ${
        status === "delete" && "bg-red-500"
      }  ${status === "facebook" && "bg-blue-500"} ${styleClass} ${
        disabled && "bg-gray-500"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
