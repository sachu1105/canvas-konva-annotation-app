import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Trash2,
  Save,
  Palette,
  MoveUp,
  MoveDown,
} from "lucide-react";
import Select from "react-select";

const ToolbarButton = ({ onClick, active, disabled, icon: Icon, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
      active ? "bg-gray-200" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    title={label}
  >
    <Icon className="w-5 h-5" />
  </button>
);

const Navbar = ({
  addText,
  handleShapeChange,
  handleShapeAdd,
  selectedColor,
  handleColorChange,
  selectedObjectId,
  objects,
  handleTextFormatting,
  isBold,
  isItalic,
  isUnderline,
  textAlign,
  selectedFontFamily,
  handleFontFamilyChange,
  selectedFontSize,
  handleFontSizeChange,
  saveCanvas,
  undo,
  redo,
  deleteAnnotation,
  historyIndex,
  history,
  moveObjectUp,
  moveObjectDown,
}) => {
  return (
    <div className="flex justify-between items-center w-full p-4 bg-white shadow-lg z-10">
      <div className="flex gap-2 ml-4">
        <button
          onClick={addText}
          className="py-2 px-4 border text-sm border-gray-500 text-grey-800 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Add Text
        </button>
        <select
          onChange={handleShapeChange}
          onClick={handleShapeAdd}
          className="py-2 px-2 text-sm border border-gray-500 text-grey-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <option value="">Select Shape</option>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="star">Star</option>
          <option value="line">Line</option>
          <option value="arrow">Arrow</option>
        </select>

        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-500" />
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange?.({ hex: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            title="Choose Color"
          />
        </div>
      </div>

      {selectedObjectId !== null &&
        objects.find((obj) => obj.id === selectedObjectId)?.type === "text" && (
          <div className="flex gap-2 mr-8 ml-4">
            <button
              onClick={() => handleTextFormatting("bold")}
              className={`py-2 px-4 border ${
                isBold ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <Bold className="inline" />
            </button>
            <button
              onClick={() => handleTextFormatting("italic")}
              className={`py-2 px-4 border ${
                isItalic ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <Italic className="inline" />
            </button>
            <button
              onClick={() => handleTextFormatting("underline")}
              className={`py-2 px-4 border ${
                isUnderline ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <Underline className="inline" />
            </button>
            <button
              onClick={() => handleTextFormatting("align-left")}
              className={`py-2 px-4 border ${
                textAlign === "left" ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <AlignLeft className="inline" />
            </button>
            <button
              onClick={() => handleTextFormatting("align-center")}
              className={`py-2 px-4 border ${
                textAlign === "center" ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <AlignCenter className="inline" />
            </button>
            <button
              onClick={() => handleTextFormatting("align-right")}
              className={`py-2 px-4 border ${
                textAlign === "right" ? "bg-gray-300" : "bg-gray-100"
              } text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
            >
              <AlignRight className="inline" />
            </button>
            <Select
              value={{
                value: selectedFontFamily,
                label: selectedFontFamily,
              }}
              onChange={handleFontFamilyChange}
              options={[
                { value: "Arial", label: "Arial" },
                { value: "Courier New", label: "Courier New" },
                { value: "Georgia", label: "Georgia" },
                { value: "Times New Roman", label: "Times New Roman" },
                { value: "Verdana", label: "Verdana" },
              ]}
              className="w-40"
            />
            <input
              type="number"
              value={selectedFontSize}
              onChange={handleFontSizeChange}
              className="w-20 p-2 border border-gray-300 rounded-lg"
              min="8"
              max="100"
            />
          </div>
        )}

      <div className="flex gap-2 ml-auto">
        <ToolbarButton onClick={saveCanvas} icon={Save} label="Save" />
        <ToolbarButton
          onClick={undo}
          disabled={!undo || historyIndex <= 0}
          icon={Undo}
          label="Undo"
        />
        <ToolbarButton
          onClick={redo}
          disabled={!redo || historyIndex >= history.length - 1}
          icon={Redo}
          label="Redo"
        />
        <ToolbarButton
          onClick={deleteAnnotation}
          disabled={!deleteAnnotation}
          icon={Trash2}
          label="Delete"
        />
        {selectedObjectId && (
          <>
            <ToolbarButton
              onClick={moveObjectUp}
              icon={MoveUp}
              label="Move Forward"
              disabled={!selectedObjectId}
            />
            <ToolbarButton
              onClick={moveObjectDown}
              icon={MoveDown}
              label="Move Backward"
              disabled={!selectedObjectId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;