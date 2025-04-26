import React from "react";
import { FaSignOutAlt, FaPrint, FaDigitalTachograph } from "react-icons/fa";
import "../css/headerbar.css";
import FullscreenButton from "../api/fullScreenButton";
import { Link } from "react-router-dom";


const HeaderBarPos = ({ onLogout }) => {
  return (
    <div className="header-bar">
      <img
        src={`/product_images/logo.png`}
        className="header-logo"
        alt="logo"
      />
      <div className="header-right">
      <Link to="/dashboard" className="btn btn-primary d-flex align-items-center">
  <FaDigitalTachograph className="logout-icon me-2" />
  Dashboard
</Link>


        <FullscreenButton />
        <FaPrint
          title="Print Recent Receipt"
          className="nav-menu-icon"
          size={16}
          style={{ cursor: "pointer" }}
        />
        <FaSignOutAlt
          title="Logout"
          className="nav-menu-icon"
          size={16}
          onClick={onLogout}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default HeaderBarPos;
