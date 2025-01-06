import React from "react";

const SavedCanvas = ({ recentlySaved }) => {
  return (
    <div>
      <h3>Saved Canvases</h3>
      <div>
        {recentlySaved.map((canvas, index) => (
          <img key={index} src={canvas} alt={`Canvas ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default SavedCanvas;
