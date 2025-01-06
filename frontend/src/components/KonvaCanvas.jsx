import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color"; // Import the color picker
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
import {
  FaFont,
  FaTrashAlt,
  FaSave,
  FaDownload,
  FaPlus,
  FaMinus,
} from "react-icons/fa"; // Import icons from react-icons

const KonvaCanvas = () => {
  const [imageUrl, setImageUrl] = useState(null); // Stores the uploaded image URL
  const [image, setImage] = useState(null); // Stores the Image object
  const [objects, setObjects] = useState([]); // Stores the list of added objects (shapes, text)
  const [selectedObjectId, setSelectedObjectId] = useState(null); // Tracks the currently selected object
  const [textEditing, setTextEditing] = useState({ id: null, value: "" }); // Tracks text being edited
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
    }
  }, [imageUrl]);

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

  // Function to add a text object to the canvas
  const addText = () => {
    const id = Date.now(); // Unique ID for the text
    const textRef = React.createRef(); // Reference for the text
    setObjects((prevObjects) => [
      ...prevObjects,
      {
        id,
        type: "text",
        ref: textRef,
        attrs: {
          x: 300,
          y: 300,
          text: "Double-click to edit",
          fontSize: 20,
          draggable: true,
          fill: selectedColor, // Apply selected color
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
      // Delete the selected object
      setObjects((prevObjects) =>
        prevObjects.filter((obj) => obj.id !== selectedObjectId)
      );

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

  // Handle double-clicking on text to enable editing
  const handleTextDblClick = (id, text) => {
    setTextEditing({ id, value: text });
    setSelectedObjectId(id); // Ensure the text remains selected
  };

  // Handle text input change during editing
  const handleTextChange = (e) => {
    setTextEditing({ ...textEditing, value: e.target.value });
  };

  // Save the edited text and update the object
  const handleTextSubmit = () => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === textEditing.id
          ? { ...obj, attrs: { ...obj.attrs, text: textEditing.value } }
          : obj
      )
    );
    setTextEditing({ id: null, value: "" }); // End text editing
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-4 flex flex-col justify-between">
        {/* File upload input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border border-blue-300 rounded bg-white shadow-md"
        />

        {/* Overlay Image Upload */}
        <div className="mb-4">
          <label
            htmlFor="upload-overlay-image"
            className="p-2 border border-gray-300 rounded cursor-pointer"
          >
            Upload Overlay Image
          </label>
          <input
            id="upload-overlay-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleOverlayImageUpload}
          />
        </div>

        {/* Color Picker - Only show when an element is selected */}
        {selectedObjectId !== null && (
          <div className="mb-4">
            <ChromePicker
              color={selectedColor}
              onChangeComplete={handleColorChange}
            />
          </div>
        )}

        {/* Text Editing */}
        {textEditing.id && (
          <div className="mb-4 flex items-center">
            <input
              type="text"
              value={textEditing.value}
              onChange={handleTextChange}
              className="p-2 border border-gray-300 rounded w-64"
            />
            <button
              onClick={handleTextSubmit}
              className="ml-2 bg-blue-500 text-white p-2 rounded"
            >
              Save
            </button>
          </div>
        )}

        {/* Tools Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Tools</h2>

          {/* Add text Button  */}
          <button
            onClick={addText}
            className="w-full mb-2 bg-gradient-to-r from-black to-violet-800 text-white p-2 rounded"
          >
            <FaFont className="mr-2" /> Text
          </button>

          {/* Shape Selection Dropdown */}
          <div className="mb-4">
            <select
              id="shape-select"
              value={selectedShape}
              onChange={handleShapeChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">-- Select a Shape --</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="star">Star</option>
              <option value="line">Line</option>
              <option value="arrow">Arrow</option>
            </select>
          </div>

          {/* Add Shape Button */}
          <button
            onClick={handleShapeAdd}
            className="w-full mb-2 bg-gradient-to-r from-black to-violet-800 text-white p-2 rounded"
          >
            Add Shape
          </button>

          <button
            onClick={deleteAnnotation}
            className="w-full mb-2 border border-red-500 text-red-500 hover:border-red-300 p-2 rounded"
          >
            <FaTrashAlt className="mr-2" /> Delete Selected Object
          </button>

          <button
            onClick={saveCanvas}
            className="w-full mb-2 bg-green-500 text-white p-2 rounded"
          >
            <FaSave className="mr-2" /> Save Canvas
          </button>

          <button
            onClick={downloadCanvas}
            className="w-full bg-indigo-500 text-white p-2 rounded"
          >
            <FaDownload className="mr-2" /> Download Canvas
          </button>
        </div>

        {/* Resize Canvas */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Resize Canvas</h2>
          <div className="flex space-x-4">
            <button
              onClick={() =>
                handleCanvasResize(canvasSize.width + 50, canvasSize.height)
              }
              className="bg-blue-500 text-white p-2 rounded"
            >
              <FaPlus />
            </button>
            <button
              onClick={() =>
                handleCanvasResize(canvasSize.width - 50, canvasSize.height)
              }
              className="bg-red-500 text-white p-2 rounded"
            >
              <FaMinus />
            </button>
          </div>
        </div>

        {/* Recently Saved Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recently Saved</h2>
          <ul className="space-y-2">
            {recentlySaved.map((save, index) => (
              <li
                key={index}
                className="bg-white shadow rounded overflow-hidden"
              >
                <img
                  src={save}
                  alt={`Save ${index}`}
                  className="w-full h-24 object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

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
                  case "text":
                    return (
                      <Text
                        key={obj.id}
                        {...obj.attrs}
                        ref={obj.ref}
                        onClick={() => handleObjectClick(obj.id)}
                        onDblClick={() =>
                          handleTextDblClick(obj.id, obj.attrs.text)
                        }
                        draggable
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
        </div>
      </div>
    </div>
  );
};
export default KonvaCanvas;
