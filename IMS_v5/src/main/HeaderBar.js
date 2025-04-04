import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "../css/headerbar.css";
const HeaderBar = ({ onLogout }) => {
  return (
    <div className="header-bar">
      <h2 className="header-title"></h2>
      <button className="logout-button" onClick={onLogout}>
        <FaSignOutAlt className="logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default HeaderBar;
