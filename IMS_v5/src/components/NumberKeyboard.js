import React from 'react';
import { FaBackspace, FaCheck } from 'react-icons/fa'; // Import icons
import '../css/NumberKeyboard.css'; // Assume this CSS file is updated for the new styles

const NumberKeyboard = ({ onKeyPress }) => {
  const handleKeyPress = (value) => {
    onKeyPress(value);
  };

  return (
    <div className="number-keyboard">
      {/* Numbers 1-9 */}
      {Array.from({ length: 9 }, (_, i) => (
        <button
          key={i + 1}
          className="number-key"
          onClick={() => handleKeyPress((i + 1).toString())}
        >
          {i + 1}
        </button>
      ))}

      {/* Clear, Zero, and Enter Keys */}
      <button className="number-key clear-key" onClick={() => handleKeyPress('C')}>
        <FaBackspace />
      </button>
      <button className="number-key zero-key" onClick={() => handleKeyPress('0')}>
        0
      </button>
      <button className="number-key enter-key" onClick={() => handleKeyPress('Enter')}>
        <FaCheck />
      </button>
    </div>
  );
};

export default NumberKeyboard;