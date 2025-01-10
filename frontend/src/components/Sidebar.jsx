import React, { useState } from 'react';
import {
  Image,
  Palette,
  Type,
  Ruler,
  History,
  Tag,
  Save,
  Download,
  Plus,
  FileText as Template,
} from "lucide-react";

const ImageEditorSidebar = ({
  handleImageUpload,
  handleRemoveMainImage,
  handleOverlayImageUpload,
  handleColorChange,
  saveCanvas,
  downloadCanvas,
  handleCanvasResize,
  imageUrl,
  selectedObjectId,
  selectedColor = "#000000",
  textType,
  setTextType,
  textSize,
  setTextSize,
  canvasSize,
  recentlySaved = [],
  addCustomPlaceholder,
  customPlaceholders = [], // Provide default empty array
  addPlaceholderToCanvas,
  onSectionChange, // Add this prop
  addText,
  templates, // Add templates prop
  handleTemplateLoad, // Add handleTemplateLoad prop
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('upload');
  const [customPlaceholder, setCustomPlaceholder] = useState("");
  const [selectedPlaceholder, setSelectedPlaceholder] = useState("");

  // Default placeholders
  const defaultPlaceholders = ["{f_name}", "{e_mail}", "{address}", "{l_name}", "{ph_number}", "{id_no}"];
  
  // Combine default and custom placeholders
  const allPlaceholders = [...defaultPlaceholders, ...(Array.isArray(customPlaceholders) ? customPlaceholders : [])];

  const handleAddCustomPlaceholder = () => {
    if (customPlaceholder.trim() !== "" && addCustomPlaceholder) {
      addCustomPlaceholder(customPlaceholder);
      setCustomPlaceholder("");
    }
  };

  const predefinedSizes = {
    A1: { width: 841, height: 1189 },
    A2: { width: 594, height: 841 },
    A3: { width: 420, height: 594 },
    A4: { width: 297, height: 420 },
    A5: { width: 210, height: 297 },
    Certificate: { width: 1123, height: 794 },
    Normal: { width: 800, height: 600 },
  };

  const handlePredefinedSizeChange = (e) => {
    const selectedSize = predefinedSizes[e.target.value];
    if (selectedSize) {
      handleCanvasResize(selectedSize.width, selectedSize.height);
    }
  };

  const handleSectionChange = (id) => {
    setActiveSection(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
  };

  const SectionButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => handleSectionChange(id)} // Use handleSectionChange
      className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
        activeSection === id 
          ? 'bg-amber-100 text-amber-800' 
          : 'hover:bg-amber-50 text-gray-600'
      }`}
    >
      <Icon size={20} />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </button>
  );

  const SimpleColorPicker = () => (
    <div className="space-y-4">
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => handleColorChange({ hex: e.target.value })}
        className="w-full h-12 rounded-lg cursor-pointer"
      />
      <div className="grid grid-cols-8 gap-2">
        {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'].map((color) => (
          <button
            key={color}
            onClick={() => handleColorChange({ hex: color })}
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <aside className={`relative h-screen bg-white transition-all duration-200 shadow-xl ${isCollapsed ? 'w-20' : 'w-80'}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="h-full flex flex-col">
        {/* Navigation */}
        <div className="p-4 border-b border-amber-100">
          <div className="space-y-2">
            <SectionButton id="canvas" icon={Ruler} label="Canvas" />
            <SectionButton id="upload" icon={Image} label="Images" />
            <SectionButton id="text" icon={Type} label="Text" />
            <SectionButton id="color" icon={Palette} label="Color" />
            <SectionButton id="placeholders" icon={Tag} label="Placeholders" />
            <SectionButton id="history" icon={History} label="History" />
            <SectionButton id="template" icon={Template} label="Template" />
          </div>
        </div>

        {/* Content Area */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Upload Section */}
            {activeSection === 'upload' && (
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
                    <span className="mt-2 block text-sm font-medium text-gray-600">Upload Main Image</span>
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
                    <span className="mt-2 block text-sm font-medium text-gray-600">Upload Overlay Image</span>
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

            {/* Text Section */}
            {activeSection === 'text' && (
              <div className="space-y-4">
                <select
                  value={textType || "p"}
                  onChange={(e) => setTextType(e.target.value)}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {["h1", "h2", "h3", "h4", "h5", "h6", "p"].map((type) => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={textSize || 16}
                  min="8"
                  max="100"
                  onChange={(e) => setTextSize(parseInt(e.target.value))}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                 <button
                  onClick={addText}
                  className="w-full py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Type className="inline mr-2" /> Add Text
                </button>
              </div>
            )}

            {/* Color Section */}
            {activeSection === 'color' && selectedObjectId !== null && (
              <SimpleColorPicker />
            )}

            {/* Placeholders Section */}
            {activeSection === 'placeholders' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={customPlaceholder}
                  onChange={(e) => setCustomPlaceholder(e.target.value)}
                  placeholder="Enter custom placeholder"
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />

                <button
                  onClick={handleAddCustomPlaceholder}
                  className="w-full py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Add Custom Placeholder
                </button>

                <select
                  value={selectedPlaceholder}
                  onChange={(e) => setSelectedPlaceholder(e.target.value)}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a Placeholder</option>
                  {allPlaceholders.map((placeholder, index) => (
                    <option key={index} value={placeholder}>{placeholder}</option>
                  ))}
                </select>

                <button
                  onClick={() => addPlaceholderToCanvas(selectedPlaceholder)}
                  className="w-full py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Add to Canvas
                </button>
              </div>
            )}

            {/* Canvas Section */}
            {activeSection === 'canvas' && (
              <div className="space-y-4">
                <select
                  onChange={handlePredefinedSizeChange}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Canvas Size</option>
                  {Object.keys(predefinedSizes).map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleCanvasResize(canvasSize.width + 50, canvasSize.height)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Plus className="inline" /> Width
                  </button>
                
                    <button onClick={() => handleCanvasResize(canvasSize.width, canvasSize.height + 50)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Plus size={16} className="inline mr-1" /> Height
                  </button>
                  
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={saveCanvas}
                    className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="inline mr-2" /> Save
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="inline mr-2" /> Download
                  </button>
                </div>
              </div>
            )}

            {/* History Section */}
            {activeSection === 'history' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Recent Saves</h3>
                <div className="grid grid-cols-2 gap-2">
                  {recentlySaved && recentlySaved.length > 0 ? (
                    recentlySaved.map((save, index) => (
                      <img
                        key={index}
                        src={save}
                        alt={`Save ${index}`}
                        className="w-full h-24 object-cover rounded-lg border border-amber-200"
                      />
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
            {activeSection === 'template' && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4">Templates</h2>
                <div className="space-y-4 overflow-y-auto">
                  {templates && templates.length > 0 ? (
                    templates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4 shadow-sm">
                        <img src={template.preview} alt={template.name} className="w-full h-32 object-cover mb-2" />
                        <h3 className="text-md font-medium">{template.name}</h3>
                        <button onClick={() => handleTemplateLoad(template)} className="mt-2 py-1 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                          Load
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No templates available</p>
                  )}
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