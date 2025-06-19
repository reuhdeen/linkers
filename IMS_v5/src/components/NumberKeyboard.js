import React from 'react';
import '../css/NumberKeyboard.css'; // Create a CSS file for styling

const NumberKeyboard = ({ onKeyPress }) => {
  const handleKeyPress = (value) => {
    onKeyPress(value);
  };

  return (
    <div className="number-keyboard">
      {Array.from({ length: 10 }, (_, i) => (
        <button
          key={i}
          className="number-key"
          onClick={() => handleKeyPress(i.toString())}
        >
          {i}
        </button>
      ))}
      <button className="number-key" onClick={() => handleKeyPress('C')}>
        C
      </button>
      <button className="number-key" onClick={() => handleKeyPress('0')}>
        0
      </button>
      <button className="number-key" onClick={() => handleKeyPress('Enter')}>
        Enter
      </button>
    </div>
  );
};

export default NumberKeyboard;
