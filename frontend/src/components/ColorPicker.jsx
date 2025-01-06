import React from 'react';

function ColorPicker({ setColor, currentColor }) {
  return (
    <div className="color-picker">
      <input 
        type="color" 
        value={currentColor} 
        onChange={(e) => setColor(e.target.value)} 
      />
    </div>
  );
}

export default ColorPicker;
