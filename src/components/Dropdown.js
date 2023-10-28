import React, { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({ options, onChange, title }) => {
  const [option, setOption] = useState("");

  const handleOptionChange = (event) => {
    setOption(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="dropdown">
      <label for={title}><strong>{title}:</strong></label>
      <br/>

      <select id={title} value={option} onChange={handleOptionChange}>
        <option value="" disabled>
          ---
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
