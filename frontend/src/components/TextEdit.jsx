import React, { useState } from "react";

const TextEdit = ({ textEditing, handleTextChange, handleTextSubmit }) => {
  return (
    <div>
      {textEditing.id && (
        <div>
          <textarea
            value={textEditing.value}
            onChange={handleTextChange}
            onBlur={handleTextSubmit}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default TextEdit;
