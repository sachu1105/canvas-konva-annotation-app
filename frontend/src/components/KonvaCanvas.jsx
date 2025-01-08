import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
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

const KonvaCanvas = () => {
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

  const addRectangle = () => {
    const id = Date.now(); // Unique ID for the rectangle
    const rectRef = React.createRef(); // Reference for the rectangle
    setObjects((prevObjects) => [
      ...prevObjects,
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
    ]);
  };

  const addCircle = () => {
    const id = Date.now(); // Unique ID for the circle
    const circleRef = React.createRef(); // Reference for the circle
    setObjects((prevObjects) => [
      ...prevObjects,
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
    ]);
  };

  // Add Star
  const addStar = () => {
    const id = Date.now();
    const starRef = React.createRef();
    setObjects((prevObjects) => [
      ...prevObjects,
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
    ]);
  };

  // Add Line
  const addLine = () => {
    const id = Date.now(); // Unique ID
    const lineRef = React.createRef(); // Reference for the line
    setObjects((prevObjects) => [
      ...prevObjects,
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
    ]);
  };

  // Add Arrow
  const addArrow = () => {
    const id = Date.now(); // Unique ID
    const arrowRef = React.createRef(); // Reference for the arrow
    setObjects((prevObjects) => [
      ...prevObjects,
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
    ]);
  };

  const handleOverlayImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageObj = new window.Image();
      imageObj.src = URL.createObjectURL(file);
      imageObj.onload = () => {
        const id = Date.now(); // Unique ID for the overlay image
        const imageRef = React.createRef();
        setObjects((prevObjects) => [
          ...prevObjects,
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
        ]);
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
      setObjects((prevObjects) => {
        const updatedObjects = prevObjects.filter(
          (obj) => obj.id !== selectedObjectId
        );
        return updatedObjects;
      });

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
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
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
        )
      );
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

  setObjects((prevObjects) => [
    ...prevObjects,
    {
      id,
      type: "text",
      ref: textRef,
      attrs: {
        x: 300,
        y: 300,
        text: "Double-click to edit", // Initial text
        fontSize: calculateFontSize("Double-click to edit", maxWidth, baseFontSize), // Set font size
        fontFamily: "Arial", // Optional: Set font family
        fontStyle: textType === "h1" ? "bold" : "normal", // Optional: Bold for h1
        draggable: true,
        fill: "#000000", // Apply selected color
        width: maxWidth, // Set initial width
        wrap: 'word', // Enable word wrapping
      },
    },
  ]);
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
      setObjects((prevObjects) =>
        prevObjects.map((obj) => {
          if (obj.id === textEditing.id && obj.type === "text") {
            return {
              ...obj,
              attrs: { ...obj.attrs, text: textEditing.value }, // Update the text content
            };
          }
          return obj;
        })
      );
      setTextEditing({ id: null, value: "" }); // Reset editing
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
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
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-200">
        <div
          className="relative bg-white shadow-xl rounded "
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
                  // draggable={true}
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
                        x={obj.attrs.x}
                        y={obj.attrs.y}
                        draggable={obj.attrs.draggable}
                        fill={obj.attrs.fill}
                        ref={obj.ref}
                        onClick={() => setSelectedObjectId(obj.id)}
                        onDblClick={() => handleTextDoubleClick(obj.id)}
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
  );
};
export default KonvaCanvas;
