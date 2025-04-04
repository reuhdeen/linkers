import React from 'react';
import { Label, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup } from 'reactstrap';
import '../css/applytostaticdropdown.css'; // Ensure this path is correct

const StaticDropdown = ({ name, value, onChange, label, options, idField, nameField, direction }) => {
  return (
    <FormGroup className="inline-form-group">
      <Label for={name} className="mr-2">{label}</Label>
      <UncontrolledDropdown direction={direction}>
        <DropdownToggle caret color="dark" id={name} className="fixed-width-dropdown custom-button left-align-text">
          {value && value[nameField] ? value[nameField] : 'Select an option'}
        </DropdownToggle>
        <DropdownMenu className="custom-dropdown-menu">
          <DropdownItem header>{label}</DropdownItem>
          {options.map(option => (
            <DropdownItem 
              key={option[idField]} 
              onClick={() => onChange(option)}
            >
              {option[nameField]}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </FormGroup>
  );
};

export default StaticDropdown;
