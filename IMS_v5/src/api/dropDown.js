import React, { useState, useEffect } from "react";
import { fetchData } from "./fetchData";
import { decodeBase64 } from "./decodeBase64";
import {
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
} from "reactstrap";
import "../css/loading.css";

// Regular Select Dropdown Component
const Dropdown = ({ endpoint, name, value, onChange, label, idField, nameField }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const data = await fetchData(token, endpoint);
        setOptions(data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [endpoint]);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="form-control">
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option[idField]} value={option[idField]}>
            {decodeBase64(option[nameField])}
          </option>
        ))}
      </select>
    </div>
  );
};

// Custom Dropdown with Loading State
const CustomDropdown = ({ endpoint, name, value, onChange, label, idField, nameField, direction }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const data = await fetchData(token, endpoint);
        setOptions(data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint]);

  const selectedOption = options.find((option) => option[idField] === value);

  return (
    <FormGroup className="form-group-inline">
      <UncontrolledDropdown direction={direction} className={loading ? "hide-caret" : ""}>
        <DropdownToggle
          caret
          color="dark"
          id={name}
          className="fixed-width-dropdown custom-button left-align-text"
        >
          {loading ? <span className="loading-text">Loading...</span> : selectedOption ? decodeBase64(selectedOption[nameField]) : label}
        </DropdownToggle>
        <DropdownMenu className="custom-dropdown-menu">
          <DropdownItem header>{label}</DropdownItem>
          {options.map((option) => (
            <DropdownItem
              key={option[idField]}
              onClick={() => onChange({ target: { name, value: option[idField] } })}
            >
              {decodeBase64(option[nameField])}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </FormGroup>
  );
};

export { Dropdown, CustomDropdown };
