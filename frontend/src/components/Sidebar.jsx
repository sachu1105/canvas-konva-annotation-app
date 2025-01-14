import React, { useState, useEffect } from "react";
import {
  Image,
  Ruler,
  History,
  Tag,
  Save,
  Download,
  Plus,
  FileText as Template,
  Trash2, // Add Trash2 icon for delete functionality
  Layers, // Add Layers icon for layers functionality
  ArrowDown as MoveDown,  // Changed to use ArrowDown instead of MoveDown
  ArrowUp as MoveUp,     // Changed to use ArrowUp instead of MoveUp
} from "lucide-react";

const ImageEditorSidebar = ({
  handleImageUpload,
  handleRemoveMainImage,
  handleOverlayImageUpload,
  saveCanvas,
  downloadCanvas,
  handleCanvasResize,
  imageUrl,
  canvasSize,
  recentlySaved = [],
  addCustomPlaceholder,
  customPlaceholders = [], // Provide default empty array
  addPlaceholderToCanvas,
  onSectionChange, // Add this prop
  templates, // Add templates prop
  handleTemplateLoad, // Add handleTemplateLoad prop
  handleZoomReset,
  deleteSavedCanvas, // Add deleteSavedCanvas prop
  previewSavedCanvas, // Add previewSavedCanvas prop
  objects = [], // Add default empty array
  selectedObjectId, // Add selectedObjectId prop
  setSelectedObjectId, // Add setSelectedObjectId prop
  moveObjectUp, // Add moveObjectUp prop
  moveObjectDown, // Add moveObjectDown prop
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("upload");
  const [customPlaceholder, setCustomPlaceholder] = useState("");
  const [selectedPlaceholder, setSelectedPlaceholder] = useState("");

  // Default placeholders
  const defaultPlaceholders = [
    "{f_name}",
    "{e_mail}",
    "{address}",
    "{l_name}",
    "{ph_number}",
    "{id_no}",
  ];

  // Combine default and custom placeholders
  const allPlaceholders = [
    ...defaultPlaceholders,
    ...(Array.isArray(customPlaceholders) ? customPlaceholders : []),
  ];

  const handleAddCustomPlaceholder = () => {
    if (customPlaceholder.trim() !== "" && addCustomPlaceholder) {
      addCustomPlaceholder(customPlaceholder);
      setCustomPlaceholder("");
    }
  };

  const predefinedSizes = {
    A4Landscape: { width: 297 *2, height: 210*2 },
    A4Portrait: { width: 210 *2, height: 297 *2 },
    LetterLandscape: { width: 279, height: 216 },
    LetterPortrait: { width: 216, height: 279 },
    LegalLandscape: { width: 356, height: 216 },
    LegalPortrait: { width: 216, height: 356 },
  };

  const handlePredefinedSizeChange = (e) => {
    const selectedSize = predefinedSizes[e.target.value];
    if (selectedSize) {
      handleCanvasResize(selectedSize.width, selectedSize.height);
      handleZoomReset(); // Reset zoom to default level
    }
  };

  const handleSectionChange = (id) => {
    setActiveSection(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
  };

  //hover on effect on sidebar
  const SectionButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full p-3 flex items-center rounded-lg transition-all duration-200
        hover:scale-105  hover:-translate-y-0.2
        ${
          activeSection === id
            ? "bg-amber-100 text-amber-900"
            : "text-gray-600 hover:text-amber-500"
        }`}
    >
      <Icon className="h-5 w-5" />
      <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>
        {label}
      </span>
    </button>
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "1":
          handleSectionChange("canvas");
          break;
        case "2":
          handleSectionChange("template");
          break;
        case "3":
          handleSectionChange("upload");
          break;
        case "4":
          handleSectionChange("placeholders");
          break;
        case "5":
          handleSectionChange("history");
          break;
        case "6":
          handleSectionChange("layers");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  

  return (
    <aside
      className={`relative h-screen bg-white transition-all duration-200 shadow-xl ${
        isCollapsed ? "w-20" : "w-80"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="h-full flex flex-col">
        {/* Navigation */}
        <div className="p-4 border-b border-amber-100">
          <div className="space-y-2">
            <SectionButton id="canvas" icon={Ruler} label="Canvas" />
            <SectionButton id="template" icon={Template} label="Template" />
            <SectionButton id="upload" icon={Image} label="Images" />
            <SectionButton id="layers" icon={Layers} label="Layers" /> {/* Add Layers button */}
            <SectionButton id="placeholders" icon={Tag} label="Placeholders" />
            <SectionButton id="history" icon={History} label="History" />
          </div>
        </div>

        {/* Content Area */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Upload Section */}
            {activeSection === "upload" && (
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-amber-200 rounded-lg hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className="block text-center cursor-pointer"
                  >
                    <Image className="mx-auto h-8 w-8 text-amber-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Upload Main Image
                    </span>
                  </label>
                </div>

                <div className="p-4 border-2 border-dashed border-amber-200 rounded-lg hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOverlayImageUpload}
                    className="hidden"
                    id="overlay-image-upload"
                  />
                  <label
                    htmlFor="overlay-image-upload"
                    className="block text-center cursor-pointer"
                  >
                    <Image className="mx-auto h-8 w-8 text-amber-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Upload Overlay Image
                    </span>
                  </label>
                </div>

                {imageUrl && (
                  <button
                    onClick={handleRemoveMainImage}
                    className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear Canvas
                  </button>
                )}
              </div>
            )}

            {/* Placeholders Section */}
            {activeSection === "placeholders" && (
              <div className="space-y-4">
                {/* Input Field */}
                <input
                  type="text"
                  value={customPlaceholder}
                  onChange={(e) => setCustomPlaceholder(e.target.value)}
                  placeholder="Enter custom placeholder"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 shadow-sm"
                />

                {/* Add Custom Placeholder Button */}
                <button
                  onClick={handleAddCustomPlaceholder}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-transform transform hover:scale-105"
                  aria-label="Add a custom placeholder"
                >
                  <Plus size={20} /> Add Custom Placeholder
                </button>

                {/* Placeholders List */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Available Placeholders</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allPlaceholders.map((placeholder, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          addPlaceholderToCanvas(placeholder);
                          setSelectedPlaceholder("");
                        }}
                        className="p-2 text-sm bg-orange-50 border border-orange-200 text-orange-700 rounded-lg 
                                 hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Tag size={14} />
                        {placeholder}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Canvas Section */}
            {activeSection === "canvas" && (
              <div className="space-y-4">
                <select
                  onChange={handlePredefinedSizeChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Select Canvas Size</option>
                  {Object.keys(predefinedSizes).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      handleCanvasResize(
                        canvasSize.width + 50,
                        canvasSize.height
                      )
                    }
                    className="p-2 border border-gray-500 text-gray-800 rounded-lg hover:bg-gray-100"
                  >
                    <Plus size={16} className="inline" /> Width
                  </button>

                  <button
                    onClick={() =>
                      handleCanvasResize(
                        canvasSize.width,
                        canvasSize.height + 50
                      )
                    }
                    className="p-2 border border-gray-500 text-gray-800 rounded-lg hover:bg-gray-100"
                  >
                    <Plus size={16} className="inline mr-1" /> Height
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={saveCanvas}
                    className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Save className="inline mr-2" /> Save
                  </button>

                  <button
                    onClick={downloadCanvas}
                    className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Download className="inline mr-2" /> Download
                  </button>
                </div>
              </div>
            )}

            {/* History Section */}
            {activeSection === "history" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Recent Saves</h3>
                <div className="grid grid-cols-2 gap-2">
                  {recentlySaved && recentlySaved.length > 0 ? (
                    recentlySaved.map((save, index) => (
                      <div key={index} className="relative">
                        <img
                          src={save.preview} // Now using the preview from save object
                          alt={`Save ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-amber-200 cursor-pointer"
                          onClick={() => previewSavedCanvas(save)} // Pass the entire save object
                        />
                        <button
                          onClick={() => deleteSavedCanvas(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-gray-500 text-center py-4">
                      No recent saves
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Template Section */}
            {activeSection === "template" && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4">Templates</h2>
                <div className="space-y-4 overflow-y-auto">
                  {templates && templates.length > 0 ? (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-32 object-cover mb-2"
                        />
                        <h3 className="text-md font-medium">{template.name}</h3>
                        <button
                          onClick={() => handleTemplateLoad(template)}
                          className="mt-2 py-1 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No templates available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Layers Section */}
            {activeSection === "layers" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Layers</h3>
                <div className="space-y-2">
                  {objects.slice().reverse().map((obj, index) => (
                    <div
                      key={obj.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        obj.id === selectedObjectId ? 'bg-amber-100' : 'bg-gray-50'
                      } hover:bg-amber-50 cursor-pointer`}
                      onClick={() => setSelectedObjectId(obj.id)}
                    >
                      <span className="text-sm">
                        {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} {objects.length - index}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveObjectUp(obj.id);
                          }}
                          className="p-1 hover:bg-amber-200 rounded"
                          disabled={index === 0}
                        >
                          <MoveUp size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveObjectDown(obj.id);
                          }}
                          className="p-1 hover:bg-amber-200 rounded"
                          disabled={index === objects.length - 1}
                        >
                          <MoveDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ImageEditorSidebar;
