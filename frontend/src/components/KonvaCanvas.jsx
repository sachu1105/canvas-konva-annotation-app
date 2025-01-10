import React, { useState, useRef, useEffect } from "react";
import ImageEditorSidebar from "./Sidebar";
import {
  Stage,
  Layer,
  Image,
  Rect,
  Circle,
  Text,
  Transformer,
  Arrow,
  Star,
  Line,
} from "react-konva";
import { Undo, Redo, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"; // Add text formatting icons
import Select from 'react-select'; // Add react-select for font family dropdown

const KonvaCanvas = ({ addCustomPlaceholder, customPlaceholders, templates, handleTemplateLoad, selectedTemplate }) => {
  const [imageUrl, setImageUrl] = useState(null); // Stores the uploaded image URL
  const [image, setImage] = useState(null); // Stores the Image object
  const [objects, setObjects] = useState([]); // Stores the list of added objects (shapes, text)
  const [selectedObjectId, setSelectedObjectId] = useState(null); // Tracks the currently selected object
  const [textEditing, setTextEditing] = useState({ id: null, value: "" }); // Tracks text being edited
  const [textType, setTextType] = useState("p"); // Default to <p>
  const [textSize, setTextSize] = useState(20); // Default font size
  const [texts, setTexts] = useState([]); // Store the texts
  const [recentlySaved, setRecentlySaved] = useState([]); // Tracks saved canvases
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); //canvas size
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000"); // Initial color
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedFontFamily, setSelectedFontFamily] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  // Refs for stage (canvas container) and transformer
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // Effect to load an image whenever a new image URL is set
  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setImage(img);
      };
    } else {
      setImage(null); // Ensure the image is cleared from state
    }
  }, [imageUrl]);

  // Remove the main image
  const handleRemoveMainImage = () => {
    setImageUrl(null);
    localStorage.removeItem("imageUrl"); // Clears the image URL from localStorage
  };

  // Handle file upload and set the image URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Effect to attach the transformer to the selected object
  useEffect(() => {
    if (transformerRef.current && selectedObjectId !== null) {
      const selectedNode = objects.find((obj) => obj.id === selectedObjectId)
        ?.ref.current;
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedObjectId, objects]);


  //History Undo and redo
  const addToHistory = (newObjects) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newObjects);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setObjects(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setObjects(history[historyIndex + 1]);
    }
  };

  //shapes logics 
  const addRectangle = () => {
    const id = Date.now(); // Unique ID for the rectangle
    const rectRef = React.createRef(); // Reference for the rectangle
    const newObjects = [
      ...objects,
      {
        id,
        type: "rect",
        ref: rectRef,
        attrs: {
          x: 50,
          y: 50,
          width: 100,
          height: 80,
          fill: selectedColor, // Apply selected color
          draggable: true, // Enable drag functionality
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  const addCircle = () => {
    const id = Date.now(); // Unique ID for the circle
    const circleRef = React.createRef(); // Reference for the circle
    const newObjects = [
      ...objects,
      {
        id,
        type: "circle",
        ref: circleRef,
        attrs: {
          x: 200,
          y: 200,
          radius: 50,
          fill: selectedColor, // Apply selected color
          draggable: true,
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  // Add Star
  const addStar = () => {
    const id = Date.now();
    const starRef = React.createRef();
    const newObjects = [
      ...objects,
      {
        id,
        type: "star",
        ref: starRef,
        attrs: {
          x: 300,
          y: 200,
          numPoints: 5,
          innerRadius: 30,
          outerRadius: 60,
          fill: selectedColor, // Apply selected color
          draggable: true,
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  // Add Line
  const addLine = () => {
    const id = Date.now(); // Unique ID
    const lineRef = React.createRef(); // Reference for the line
    const newObjects = [
      ...objects,
      {
        id,
        type: "line",
        ref: lineRef,
        attrs: {
          points: [50, 50, 200, 200], // Define the start and end points
          stroke: "black", // Line color
          strokeWidth: 3, // Line thickness
          draggable: true, // Allow dragging
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  // Add Arrow
  const addArrow = () => {
    const id = Date.now(); // Unique ID
    const arrowRef = React.createRef(); // Reference for the arrow
    const newObjects = [
      ...objects,
      {
        id,
        type: "arrow",
        ref: arrowRef,
        attrs: {
          points: [100, 100, 300, 100], // Define the start and end points
          stroke: "blue", // Arrow color
          strokeWidth: 3, // Arrow thickness
          pointerLength: 10, // Length of arrow pointer
          pointerWidth: 10, // Width of arrow pointer
          draggable: true, // Allow dragging
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  const handleOverlayImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageObj = new window.Image();
      imageObj.src = URL.createObjectURL(file);
      imageObj.onload = () => {
        const id = Date.now(); // Unique ID for the overlay image
        const imageRef = React.createRef();
        const newObjects = [
          ...objects,
          {
            id,
            type: "image",
            ref: imageRef,
            attrs: {
              x: 100,
              y: 100,
              width: 200, // Initial width of the overlay image
              height: 200, // Initial height of the overlay image
              image: imageObj,
              draggable: true, // Allow dragging
            },
          },
        ];
        setObjects(newObjects);
        addToHistory(newObjects);
      };
    }
  };

  //shapes drop down
  const handleShapeChange = (e) => {
    setSelectedShape(e.target.value);
  };
  const handleShapeAdd = () => {
    if (selectedShape === "rectangle") {
      addRectangle();
    } else if (selectedShape === "circle") {
      addCircle();
    } else if (selectedShape === "text") {
      addText();
    } else if (selectedShape === "star") {
      addStar();
    } else if (selectedShape === "line") {
      addLine();
    } else if (selectedShape === "arrow") {
      addArrow();
    }
  };

  // Function to delete the selected object
  const deleteAnnotation = () => {
    if (selectedObjectId !== null) {
      // Delete the selected object from the state
      const updatedObjects = objects.filter(
        (obj) => obj.id !== selectedObjectId
      );
      setObjects(updatedObjects);
      addToHistory(updatedObjects);

      // Reset the selected object ID (this clears the Transformer)
      setSelectedObjectId(null);
    } else {
      alert("Please select an object to delete");
    }
  };

  const saveCanvas = () => {
    const stage = stageRef.current.toDataURL();
    setRecentlySaved((prev) => [...prev, stage]);
  };

  // Handle object selection
  const handleObjectClick = (id) => {
    setSelectedObjectId(id); // Set the selected object's ID
    setTextEditing({ id: null, value: "" }); // Reset text editing
    addToHistory(objects);
  };

  const downloadCanvas = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = uri;
    link.click();
  };

  // Resize canvas
  const handleCanvasResize = (newWidth, newHeight) => {
    setCanvasSize({ width: newWidth, height: newHeight });
  };

  // Function to handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update the selected color

    if (selectedObjectId !== null) {
      const updatedObjects = objects.map((obj) =>
        obj.id === selectedObjectId
          ? {
              ...obj,
              attrs: {
                ...obj.attrs,
                fill: color.hex, // Update color for shapes
                stroke: color.hex, // If needed, update stroke color
              },
            }
          : obj
      );
      setObjects(updatedObjects);
      addToHistory(updatedObjects);
    }
  };

  //text logic start from here ------------>
  // Function to add a text object to the canvas
  const addText = () => {
    const id = Date.now(); // Unique ID for the text
    const textRef = React.createRef(); // Reference for the text

    const calculateFontSize = (text, maxWidth, baseFontSize) => {
      const context = document.createElement("canvas").getContext("2d");
      let fontSize = baseFontSize; // Start with the base font size
      context.font = `${fontSize}px Arial`;
      while (context.measureText(text).width > maxWidth && fontSize > 0) {
        fontSize -= 1;
        context.font = `${fontSize}px Arial`;
      }
      return fontSize;
    };

    const maxWidth = 300; // Set your desired maximum width here

    // Font sizes for different text types
    const textSizes = {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      h6: 16,
      p: 14,
    };

    const baseFontSize = textSizes[textType] || 16; // Default to 16px if textType is not set

    const newObjects = [
      ...objects,
      {
        id,
        type: "text",
        ref: textRef,
        attrs: {
          x: 300,
          y: 300,
          text: "Double-click to edit", // Initial text
          fontSize: calculateFontSize(
            "Double-click to edit",
            maxWidth,
            baseFontSize
          ), // Set font size
          fontFamily: "Arial", // Optional: Set font family
          fontStyle: textType === "h1" ? "bold" : "normal", // Optional: Bold for h1
          draggable: true,
          fill: "#000000", // Apply selected color
          width: maxWidth, // Set initial width
          wrap: "word", // Enable word wrapping
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  // Update text after editing
  const handleTextChange = (e) => {
    setTextEditing((prev) => ({ ...prev, value: e.target.value })); // Update value while editing
  };

  // Save the edited text and update the object
  const handleTextSubmit = () => {
    // Update the text in the list of texts
    const updatedTexts = texts.map((text) =>
      text.id === textEditing.id ? { ...text, value: textEditing.value } : text
    );
    setTexts(updatedTexts);
    setTextEditing(null); // Reset editing state
  };

  // Deselect object when clicking outside
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedObjectId(null); // Deselect if clicking outside shapes
      setTextEditing({ id: null, value: "" }); // Stop editing text
    }
  };

  // Handle double-clicking on a text object to edit
  const handleTextDoubleClick = (id) => {
    const selectedText = objects.find(
      (obj) => obj.id === id && obj.type === "text"
    );
    if (selectedText) {
      setTextEditing({
        id,
        value: selectedText.attrs.text,
        x: selectedText.attrs.x,
        y: selectedText.attrs.y,
        fontSize: selectedText.attrs.fontSize,
        fontFamily: selectedText.attrs.fontFamily,
        color: selectedText.attrs.fill,
      }); // Set the current text and position for editing
    }
  };

  const saveEditedText = () => {
    if (textEditing.id) {
      const updatedObjects = objects.map((obj) => {
        if (obj.id === textEditing.id && obj.type === "text") {
          return {
            ...obj,
            attrs: { ...obj.attrs, text: textEditing.value }, // Update the text content
          };
        }
        return obj;
      });
      setObjects(updatedObjects);
      addToHistory(updatedObjects);
      setTextEditing({ id: null, value: "" }); // Reset editing
    }
  };

  // Function to add a placeholder text to the canvas
  const addPlaceholderToCanvas = (placeholder) => {
    if (placeholder) {
      const id = Date.now(); // Unique ID for the text
      const textRef = React.createRef(); // Reference for the text

      const newObjects = [
        ...objects,
        {
          id,
          type: "text",
          ref: textRef,
          attrs: {
            x: 100,
            y: 100,
            text: placeholder, // Set the placeholder text
            fontSize: 20, // Default font size
            fontFamily: "Arial", // Optional: Set font family
            draggable: true,
            fill: "#000000", // Default color
          },
        },
      ];
      setObjects(newObjects);
      addToHistory(newObjects);
    }
  };

  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, attrs: { ...obj.attrs, x, y } } : obj
      )
    );
  };

  const handleDragEnd = (id, e) => {
    const { x, y } = e.target.position();
    const updatedObjects = objects.map((obj) =>
      obj.id === id ? { ...obj, attrs: { ...obj.attrs, x, y } } : obj
    );
    setObjects(updatedObjects);
    addToHistory(updatedObjects);
  };

  const handleTemplateClick = (template) => {
    // Logic to apply the template to the canvas
    // For example, setting the background image or adding predefined objects
  };

  // Function to handle text formatting changes
  const handleTextFormatting = (format) => {
    if (selectedObjectId !== null) {
      const updatedObjects = objects.map((obj) => {
        if (obj.id === selectedObjectId && obj.type === "text") {
          let newAttrs = { ...obj.attrs };
          if (format === "bold") {
            newAttrs.fontStyle = isBold ? "normal" : "bold";
            setIsBold(!isBold);
          } else if (format === "italic") {
            newAttrs.fontStyle = isItalic ? "normal" : "italic";
            setIsItalic(!isItalic);
          } else if (format === "underline") {
            newAttrs.textDecoration = isUnderline ? "" : "underline";
            setIsUnderline(!isUnderline);
          } else if (format === "align-left") {
            newAttrs.align = "left";
            setTextAlign("left");
          } else if (format === "align-center") {
            newAttrs.align = "center";
            setTextAlign("center");
          } else if (format === "align-right") {
            newAttrs.align = "right";
            setTextAlign("right");
          }
          return { ...obj, attrs: newAttrs };
        }
        return obj;
      });
      setObjects(updatedObjects);
      addToHistory(updatedObjects);
    }
  };

  // Function to handle font family change
  const handleFontFamilyChange = (selectedOption) => {
    setSelectedFontFamily(selectedOption.value);
    if (selectedObjectId !== null) {
      const updatedObjects = objects.map((obj) =>
        obj.id === selectedObjectId && obj.type === "text"
          ? { ...obj, attrs: { ...obj.attrs, fontFamily: selectedOption.value } }
          : obj
      );
      setObjects(updatedObjects);
      addToHistory(updatedObjects);
    }
  };

  // Function to handle font size change
  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSelectedFontSize(newSize);
    if (selectedObjectId !== null) {
      const updatedObjects = objects.map((obj) =>
        obj.id === selectedObjectId && obj.type === "text"
          ? { ...obj, attrs: { ...obj.attrs, fontSize: newSize } }
          : obj
      );
      setObjects(updatedObjects);
      addToHistory(updatedObjects);
    }
  };

  const loadTemplate = (template) => {
    if (!template || !template.elements) return;
    const newObjects = template.elements.map((element) => {
      const id = Date.now() + Math.random(); // Unique ID for each element
      const ref = React.createRef();
      if (element.type === 'text') {
        return {
          id,
          type: 'text',
          ref,
          attrs: {
            ...element,
            draggable: true,
          },
        };
      }
      return null;
    }).filter(Boolean);

    const img = new window.Image();
    img.src = template.preview;
    img.onload = () => {
      setImage(img); // Set the template image as the background
      setObjects(newObjects); // Add text elements on top of the background
      addToHistory(newObjects);
    };
  };

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ImageEditorSidebar
        handleImageUpload={handleImageUpload}
        handleRemoveMainImage={handleRemoveMainImage}
        handleOverlayImageUpload={handleOverlayImageUpload}
        handleColorChange={handleColorChange}
        addText={addText}
        handleTextChange={handleTextChange}
        handleTextSubmit={handleTextSubmit}
        handleShapeChange={handleShapeChange}
        handleShapeAdd={handleShapeAdd}
        deleteAnnotation={deleteAnnotation}
        saveCanvas={saveCanvas}
        downloadCanvas={downloadCanvas}
        handleCanvasResize={handleCanvasResize}
        imageUrl={imageUrl}
        selectedColor={selectedColor}
        textType={textType}
        setTextType={setTextType}
        textSize={textSize}
        setTextSize={setTextSize}
        selectedShape={selectedShape}
        canvasSize={canvasSize}
        recentlySaved={recentlySaved}
        addCustomPlaceholder={addCustomPlaceholder}
        customPlaceholders={customPlaceholders}
        addPlaceholderToCanvas={addPlaceholderToCanvas}
        undo={undo}
        redo={redo}
        handleTemplateClick={handleTemplateClick}
        templates={templates} // Pass templates as a prop
        handleTemplateLoad={loadTemplate} // Pass loadTemplate as a prop
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-200 overflow-hidden">
        <div className="flex justify-between items-center w-full p-4 bg-white shadow-md z-10">
          {/* Add Text and Shape dropdowns to the top navbar */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={addText}
              className="py-2 px-4 border text-sm border-amber-500 text-grey-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
            Add Text
            </button>
            <select
              onChange={handleShapeChange}
              onClick={handleShapeAdd}
              className="py-2 px-2 text-sm  border  border-amber-500 text-grey-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <option value="">Select Shape</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="star">Star</option>
              <option value="line">Line</option>
              <option value="arrow">Arrow</option>
            </select>
            
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange({ hex: e.target.value })}
              className="w-12 h-12  cursor-pointer "
            />
          </div>

          {/* Text formatting options */}
          {selectedObjectId !== null && objects.find((obj) => obj.id === selectedObjectId)?.type === "text" && (
            <div className="flex gap-2 mr-8 ml-4">
              <button
                onClick={() => handleTextFormatting("bold")}
                className={`py-2 px-4 border ${isBold ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <Bold className="inline" />
              </button>
              <button
                onClick={() => handleTextFormatting("italic")}
                className={`py-2 px-4 border ${isItalic ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <Italic className="inline" />
              </button>
              <button
                onClick={() => handleTextFormatting("underline")}
                className={`py-2 px-4 border ${isUnderline ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <Underline className="inline" />
              </button>
              <button
                onClick={() => handleTextFormatting("align-left")}
                className={`py-2 px-4 border ${textAlign === "left" ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <AlignLeft className="inline" />
              </button>
              <button
                onClick={() => handleTextFormatting("align-center")}
                className={`py-2 px-4 border ${textAlign === "center" ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <AlignCenter className="inline" />
              </button>
              <button
                onClick={() => handleTextFormatting("align-right")}
                className={`py-2 px-4 border ${textAlign === "right" ? "bg-gray-300" : "bg-gray-100"} text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer`}
              >
                <AlignRight className="inline" />
              </button>
              <Select
                value={{ value: selectedFontFamily, label: selectedFontFamily }}
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

          {/* Move undo, redo, and delete buttons to the top right corner */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Undo className="inline" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Redo className="inline" />
            </button>
            <button
              onClick={deleteAnnotation}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="inline" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <div
            className="relative bg-white shadow-xl rounded"
            style={{ width: canvasSize.width, height: canvasSize.height }}
          >
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              ref={stageRef}
              onClick={handleStageClick}
            >
              <Layer>
                {/* Render uploaded image */}
                {image && (
                  <Image
                    image={image}
                    x={0}
                    y={0}
                    width={canvasSize.width}
                    height={canvasSize.height}
                  />
                )}

                {/* Render added objects */}
                {objects.map((obj) => {
                  switch (obj.type) {
                    case "rect":
                      return (
                        <Rect
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          stroke={obj.id === selectedObjectId ? "black" : ""}
                          strokeWidth={1}
                          onClick={() => handleObjectClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );
                    case "circle":
                      return (
                        <Circle
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          stroke={obj.id === selectedObjectId ? "black" : ""}
                          strokeWidth={1}
                          onClick={() => handleObjectClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );

                    case "line":
                      return (
                        <Line
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          stroke={
                            obj.id === selectedObjectId
                              ? "black"
                              : obj.attrs.stroke
                          }
                          strokeWidth={obj.attrs.strokeWidth}
                          onClick={() => handleObjectClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );
                    case "arrow":
                      return (
                        <Arrow
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          stroke={
                            obj.id === selectedObjectId
                              ? "black"
                              : obj.attrs.stroke
                          }
                          strokeWidth={obj.attrs.strokeWidth}
                          pointerLength={obj.attrs.pointerLength}
                          pointerWidth={obj.attrs.pointerWidth}
                          onClick={() => handleObjectClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );
                    case "star":
                      return (
                        <Star
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          stroke={obj.id === selectedObjectId ? "black" : ""}
                          strokeWidth={1}
                          onClick={() => handleObjectClick(obj.id)}
                        />
                      );
                    case "image":
                      return (
                        <Image
                          key={obj.id}
                          {...obj.attrs}
                          ref={obj.ref}
                          draggable
                          stroke={obj.id === selectedObjectId ? "black" : ""}
                          strokeWidth={1}
                          onClick={() => handleObjectClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );
                    case "text":
                      return (
                        <Text
                          key={obj.id}
                          text={obj.attrs.text}
                          fontSize={obj.attrs.fontSize}
                          fontFamily={obj.attrs.fontFamily}
                          fontStyle={obj.attrs.fontStyle}
                          textDecoration={obj.attrs.textDecoration}
                          align={obj.attrs.align}
                          x={obj.attrs.x}
                          y={obj.attrs.y}
                          draggable={obj.attrs.draggable}
                          fill={obj.attrs.fill}
                          ref={obj.ref}
                          onClick={() => setSelectedObjectId(obj.id)}
                          onDblClick={() => handleTextDoubleClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                        />
                      );

                    default:
                      return null;
                  }
                })}

                {/* Transformer */}
                {selectedObjectId !== null && (
                  <Transformer
                    ref={transformerRef}
                    node={
                      objects.find((obj) => obj.id === selectedObjectId)?.ref
                        .current
                    }
                  />
                )}
              </Layer>
            </Stage>

            {textEditing.id && (
              <textarea
                style={{
                  position: "absolute",
                  top: textEditing.y, // Position textarea at text's Y coordinate
                  left: textEditing.x, // Position textarea at text's X coordinate
                  zIndex: 10,
                  resize: "none",
                  outline: "none",
                  border: "1px solid #ccc",
                  fontSize: textEditing.fontSize,
                  fontFamily: textEditing.fontFamily,
                  color: textEditing.color,
                  background: "transparent", // Transparent background for the textarea
                }}
                value={textEditing.value}
                onChange={handleTextChange}
                onBlur={saveEditedText} // Save text on blur
                autoFocus
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default KonvaCanvas;