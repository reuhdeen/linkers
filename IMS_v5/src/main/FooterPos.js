import React from "react";
import {
  FaShoppingCart,
  FaPause,
  FaTrashAlt,
  FaRegArrowAltCircleUp,
} from "react-icons/fa";
import "../css/headerbar.css";

const FooterPos = ({
  onLogout,
  isScannerActive,
  setIsScannerActive,
  setModalOpen,
}) => {
  const toggleScanner = () => setIsScannerActive(!isScannerActive);

  // For reloading the page
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="footer-pos">
      {/* <button className="btn btn-toggle-scanner" onClick={toggleScanner}>
        {isScannerActive ? "🔴 Scanner ON" : "⚪ Scanner OFF"}
      </button> */}

      <button className="btn btn-hold" onClick={reloadPage}>
        <FaPause className="logout-icon" />
        Hold
      </button>
      <button className="btn btn-void" onClick={reloadPage}>
        <FaTrashAlt className="logout-icon" />
        Void
      </button>
      <button className="btn btn-reset" onClick={reloadPage}>
        <FaRegArrowAltCircleUp className="logout-icon" />
        Reset
      </button>
      <button
        className="btn btn-transactions"
        onClick={() => setModalOpen(true)}
      >
        <FaShoppingCart className="logout-icon" />
        Unfinished Orders
      </button>
    </div>
  );
};

export default FooterPos;
