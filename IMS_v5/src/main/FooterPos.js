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
      {/* Hold Button */}
      <button className="btn btn-hold btn-footer" onClick={reloadPage}>
        <FaPause className="footer-icon" />
        <span className="footer-text">Hold</span>
      </button>

      {/* Void Button */}
      <button className="btn btn-void btn-footer" onClick={reloadPage}>
        <FaTrashAlt className="footer-icon" />
        <span className="footer-text">Void</span>
      </button>

      {/* Reset Button */}
      <button className="btn btn-reset btn-footer" onClick={reloadPage}>
        <FaRegArrowAltCircleUp className="footer-icon" />
        <span className="footer-text">Reset</span>
      </button>

      {/* Unfinished Orders Button */}
      <button
        className="btn btn-transactions btn-footer"
        onClick={() => setModalOpen(true)}
      >
        <FaShoppingCart className="footer-icon" />
        <span className="footer-text">Unfinished Orders</span>
      </button>
    </div>
  );
};

export default FooterPos;