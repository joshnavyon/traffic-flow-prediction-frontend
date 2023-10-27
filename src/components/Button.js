import React from "react";
import "./Button.css";

const Button = ({ onClick, children }) => {
  return (
    <div>
      <button className="button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Button;
