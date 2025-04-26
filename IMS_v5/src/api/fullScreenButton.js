import React from "react";
import { FaExpandAlt } from "react-icons/fa";
const FullscreenButton = () => {
  const handleFullscreen = () => {
    const elem = document.documentElement; // You can change this to any element
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      elem.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  return (
    <button
      onClick={handleFullscreen}
      className="nav-menu-icon"
      title="Fullscreen Mode"
    >
      <FaExpandAlt />
    </button>
  );
};

export default FullscreenButton;
