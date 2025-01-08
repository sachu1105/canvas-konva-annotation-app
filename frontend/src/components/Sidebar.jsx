import { ChromePicker } from "react-color";
import {
  FaFont,
  FaTrashAlt,
  FaSave,
  FaDownload,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const ImageEditorSidebar = ({
  handleImageUpload,
  handleRemoveMainImage,
  handleOverlayImageUpload,
  handleColorChange,
  addText,
  handleShapeChange,
  handleShapeAdd,
  deleteAnnotation,
  saveCanvas,
  downloadCanvas,
  handleCanvasResize,
  imageUrl,
  selectedObjectId,
  selectedColor,
  textType,
  setTextType,
  textSize,
  setTextSize,
  selectedShape,
  canvasSize,
  recentlySaved,
}) => {
  return (
    <aside className="w-80 bg-white p-6 shadow-lg overflow-y-auto h-screen">
      <div className="space-y-6">
        {/* File Upload Section */}
        <section>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </label>
          {imageUrl && (
            <button
              onClick={handleRemoveMainImage}
              className="mt-2 w-full py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear Canvas
            </button>
          )}
        </section>

        {/* Overlay Image Upload */}
        <section>
          <label
            htmlFor="upload-overlay-image"
            className="block w-full py-2 px-4 text-sm font-medium text-center text-violet-700 bg-violet-50 rounded-md cursor-pointer hover:bg-violet-100"
          >
            Upload Overlay Image
            <input
              id="upload-overlay-image"
              type="file"
              accept="image/*"
              onChange={handleOverlayImageUpload}
              className="hidden"
            />
          </label>
        </section>

        {/* Color Picker */}
        {selectedObjectId !== null && selectedColor && (
          <section>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
            <ChromePicker
              color={selectedColor}
              onChangeComplete={handleColorChange}
              disableAlpha
              styles={{ default: { picker: { width: "100%" } } }}
            />
          </section>
        )}

        {/* Text Tools */}
        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Text</h3>
          <div className="space-y-2">
            <select
              value={textType || "p"}
              onChange={(e) => setTextType(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            >
              {["h1", "h2", "h3", "h4", "h5", "h6", "p"].map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={textSize || 16} // Default to 16 if `textSize` is not set
              min="8"
              max="100"
              onChange={(e) => setTextSize(parseInt(e.target.value))} // Update state with the new font size
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            />
            <button
              onClick={addText}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <FaFont className="inline mr-2" /> Add Text
            </button>
          </div>
        </section>

        {/* Shape Tools */}
        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Shapes</h3>
          <div className="space-y-2">
            <select
              value={selectedShape}
              onChange={handleShapeChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            >
              <option value="">Select a Shape</option>
              {["rectangle", "circle", "star", "line", "arrow"].map((shape) => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
            </select>
            <button
              onClick={handleShapeAdd}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Add Shape
            </button>
          </div>
        </section>

        {/* Delete Object */}
        {selectedObjectId !== null && (
          <button
            onClick={deleteAnnotation}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTrashAlt className="inline mr-2" /> Delete Selected Object
          </button>
        )}

        {/* Canvas Actions */}
        <section className="space-y-2">
          <button
            onClick={saveCanvas}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaSave className="inline mr-2" /> Save Canvas
          </button>
          <button
            onClick={downloadCanvas}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaDownload className="inline mr-2" /> Download Canvas
          </button>
        </section>

        {/* Resize Canvas */}
        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Resize Canvas
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                handleCanvasResize(canvasSize.width + 50, canvasSize.height)
              }
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <FaPlus />
            </button>
            <button
              onClick={() =>
                handleCanvasResize(canvasSize.width - 50, canvasSize.height)
              }
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <FaMinus />
            </button>
          </div>
        </section>

        {/* Recently Saved */}
        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Recently Saved
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {recentlySaved && recentlySaved.length > 0 ? (
              recentlySaved.map((save, index) => (
                <img
                  key={index}
                  src={save}
                  alt={`Save ${index}`}
                  className="w-full h-20 object-cover rounded-md"
                />
              ))
            ) : (
              <p className="col-span-3 text-sm text-gray-500">
                No recent saves
              </p>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default ImageEditorSidebar;
