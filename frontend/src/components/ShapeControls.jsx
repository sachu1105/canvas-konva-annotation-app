import React from 'react';

function ShapeControls({ setShapes }) {
  const addRectangle = () => {
    setShapes(prevShapes => [...prevShapes, { type: 'rectangle', x: 50, y: 50, width: 100, height: 100 }]);
  };

  const addCircle = () => {
    setShapes(prevShapes => [...prevShapes, { type: 'circle', x: 150, y: 150, radius: 50 }]);
  };

  const addText = () => {
    setShapes(prevShapes => [...prevShapes, { type: 'text', x: 200, y: 200, text: 'Hello' }]);
  };

  return (
    <div className="shape-controls">
      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addText}>Add Text</button>
    </div>
  );
}

export default ShapeControls;
