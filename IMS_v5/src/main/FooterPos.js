import React from "react";
import { FaShoppingCart, FaPause, FaTrashAlt, FaRegArrowAltCircleUp } from "react-icons/fa";
import "../css/headerbar.css";
const FooterPos = ({ onLogout, isScannerActive, setIsScannerActive }) => {
  const toggleScanner = () => setIsScannerActive(!isScannerActive);

  return (
    <div className="footer-pos">
      <button className="btn btn-toggle-scanner" onClick={toggleScanner}>
        {isScannerActive ? "🔴 Scanner ON" : "⚪ Scanner OFF"}
      </button>

      <button className="btn btn-hold">
        <FaPause className="logout-icon" />
        Hold
      </button>
      <button className="btn btn-void">
        <FaTrashAlt className="logout-icon" />
        Void
      </button>
      <button className="btn btn-reset">
        <FaRegArrowAltCircleUp className="logout-icon" />
        Reset
      </button>
      <button className="btn btn-transactions">
        <FaShoppingCart className="logout-icon" />
        Unfinished Orders
      </button>
    </div>
  );
};


export default FooterPos;
