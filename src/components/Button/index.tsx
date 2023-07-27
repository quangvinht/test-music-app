import React from "react";

import "./Button.css";

interface Props {
  children: React.ReactNode;
  status?: string;
  styleClass?: string;
  clickEvent?: Function;
}

const Button: React.FC<Props> = ({
  children,
  status,
  styleClass,
  clickEvent,
}) => {
  return (
    <button
      onClick={() => {
        clickEvent && clickEvent();
      }}
      className={`text-white rounded-full ${
        status === "logout" && "bg-cyan-500"
      } ${status === "google" && "bg-green-500"} ${
        status === "delete" && "bg-red-500"
      }  ${status === "facebook" && "bg-blue-500"} ${styleClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
