import React from "react";
import Header from "../components/Header";

import "./DefaultLayout.css";
interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="container m-10">{children}</div>
    </div>
  );
};

export default DefaultLayout;
