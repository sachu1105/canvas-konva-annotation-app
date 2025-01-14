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
  ZoomIn,
  ZoomOut,
  RefreshCw,
  X,
  MoveUp,
  MoveDown,
} from "lucide-react"; // Add text formatting icons
import Select from "react-select"; // Add react-select for font family dropdown

const KonvaCanvas = ({
  addCustomPlaceholder,
  customPlaceholders,
  templates,
  handleTemplateLoad,
  selectedTemplate,
}) => {
  const [imageUrl, setImageUrl] = useState(null); // Stores the uploaded image URL
  const [image, setImage] = useState(null); // Stores the Image object
  const [objects, setObjects] = useState([]); // Stores the list of added objects (shapes, text)
  const [selectedObjectId, setSelectedObjectId] = useState(null); // Tracks the currently selected object
  const [textEditing, setTextEditing] = useState({
    id: null,
    value: "",
    x: 0,
    y: 0,
    width: 0,
    fontSize: 20,
    fontFamily: "Arial",
    color: "#000000",
  }); // Tracks text being edited
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
  const [zoom, setZoom] = useState(1); // Add zoom state
  const [previewImage, setPreviewImage] = useState(null); // State to store the preview image
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
    setSelectedShape(""); // Reset to default option
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

  // Add this function to serialize canvas data
  const serializeCanvasData = () => {
    const stage = stageRef.current;
    
    // Helper function to clean object attributes
    const cleanAttrs = (attrs) => {
      const cleanedAttrs = {};
      // Only copy serializable properties
      const serializableProps = [
        'x', 'y', 'width', 'height', 'radius', 
        'scaleX', 'scaleY', 'rotation', 'text',
        'fontSize', 'fontFamily', 'fill', 'stroke',
        'strokeWidth', 'align', 'verticalAlign',
        'points', 'pointerLength', 'pointerWidth',
        'numPoints', 'innerRadius', 'outerRadius',
        'textDecoration', 'fontStyle'
      ];
  
      serializableProps.forEach(prop => {
        if (attrs[prop] !== undefined) {
          cleanedAttrs[prop] = attrs[prop];
        }
      });
      return cleanedAttrs;
    };
  
    const canvasData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      canvasSize: {
        width: canvasSize.width,
        height: canvasSize.height,
      },
      backgroundImage: imageUrl,
      zoom: zoom,
      objects: objects.map(obj => {
        // Get the actual node
        const node = obj.ref.current;
        let attrs = {};
  
        if (node) {
          // Get current transformation values using Konva methods
          attrs = {
            ...cleanAttrs(node.attrs),
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
            // For text specific properties
            ...(obj.type === 'text' && {
              text: node.text(),
              fontSize: node.fontSize(),
              fontFamily: node.fontFamily(),
              align: node.align(),
              fontStyle: node.fontStyle(),
              textDecoration: node.textDecoration()
            }),
            // For shapes specific properties
            ...(obj.type === 'rect' && {
              width: node.width(),
              height: node.height()
            }),
            ...(obj.type === 'circle' && {
              radius: node.radius()
            }),
            // For line and arrow
            ...((['line', 'arrow'].includes(obj.type)) && {
              points: node.points()
            }),
            // For star
            ...(obj.type === 'star' && {
              innerRadius: node.innerRadius(),
              outerRadius: node.outerRadius(),
              numPoints: node.numPoints()
            }),
            // For images, store the data URL
            ...(obj.type === 'image' && {
              imageData: node.image().src // Store the image source
            })
          };
        } else {
          attrs = cleanAttrs(obj.attrs);
        }
  
        return {
          id: obj.id,
          type: obj.type,
          attrs: attrs
        };
      })
    };
  
    return canvasData;
  };
  
  const saveCanvas = () => {
    try {
      const canvasData = serializeCanvasData();
      const stage = stageRef.current;
      
      // Create preview image
      const dataUrl = stage.toDataURL();
      
      // Create the save object with timestamp and name
      const saveObject = {
        id: Date.now(),
        name: `Canvas ${new Date().toLocaleString()}`,
        preview: dataUrl,
        data: canvasData,
      };
  
      // Update recently saved list
      setRecentlySaved(prev => {
        const updatedList = [...prev, saveObject];
        // Save to localStorage
        try {
          localStorage.setItem("recentlySavedCanvases", JSON.stringify(updatedList));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
          alert("Error saving to localStorage. Make sure you have enough storage space.");
        }
        return updatedList;
      });
  
      // Show success message
      alert("Canvas saved successfully!");
      
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert("There was an error saving the canvas. Please try again.");
    }
  };
  
  // Add a function to load saved canvas data
  const loadCanvasData = (savedData) => {
    if (!savedData || !savedData.data) return;
    
    const data = savedData.data;
    
    try {
      // Set canvas size
      setCanvasSize(data.canvasSize);
      
      // Set background image if exists
      if (data.backgroundImage) {
        setImageUrl(data.backgroundImage);
      }
      
      // Set zoom level
      setZoom(data.zoom || 1);
      
      // Create new objects with refs and restore all properties
      const newObjects = data.objects.map(obj => {
        const ref = React.createRef();
        
        // Handle image objects specially
        if (obj.type === 'image' && obj.attrs.imageData) {
          const img = new window.Image();
          img.src = obj.attrs.imageData;
          
          return {
            ...obj,
            ref,
            attrs: {
              ...obj.attrs,
              image: img,
              draggable: true,
            }
          };
        }
        
        return {
          ...obj,
          ref,
          attrs: {
            ...obj.attrs,
            draggable: true,
          }
        };
      });
      
      // Wait for all images to load before setting objects
      const imagePromises = newObjects
        .filter(obj => obj.type === 'image')
        .map(obj => {
          return new Promise((resolve) => {
            obj.attrs.image.onload = () => resolve();
          });
        });
  
      Promise.all(imagePromises).then(() => {
        setObjects(newObjects);
        addToHistory(newObjects);
      });
      
      setSelectedObjectId(null);
      
    } catch (error) {
      console.error("Error loading canvas:", error);
      alert("There was an error loading the canvas.");
    }
  };
  

  // Function to delete a saved canvas from recently saved and local storage
  const deleteSavedCanvas = (index) => {
    setRecentlySaved((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      localStorage.setItem("recentlySavedCanvases", JSON.stringify(updatedList)); // Update local storage
      return updatedList;
    });
  };

  // Retrieve saved canvases from local storage when the component mounts
  useEffect(() => {
    const savedCanvases = JSON.parse(localStorage.getItem("recentlySavedCanvases")) || [];
    setRecentlySaved(savedCanvases); // Load saved canvases into state
  }, []);

  // Modify the previewSavedCanvas function to handle loading
  const previewSavedCanvas = (savedCanvas) => {
    setPreviewImage(savedCanvas.preview);
    // Add button or functionality to load this canvas
    if (window.confirm('Would you like to load this canvas?')) {
      loadCanvasData(savedCanvas);
      setPreviewImage(null);
    }
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

    const newObjects = [
      ...objects,
      {
        id,
        type: "text",
        ref: textRef,
        attrs: {
          x: 100,
          y: 100,
          text: "Double-click to edit",
          fontSize: 20,
          fontFamily: "Arial",
          draggable: true,
          fill: "#000000",
          width: 200, // Default width
          wrap: "word", // Enable word wrapping
        },
      },
    ];
    setObjects(newObjects);
    addToHistory(newObjects);
  };

  const handleTextResize = (id, newWidth) => {
    const updatedObjects = objects.map((obj) =>
      obj.id === id && obj.type === "text"
        ? { ...obj, attrs: { ...obj.attrs, width: newWidth } }
        : obj
    );
    setObjects(updatedObjects);
    addToHistory(updatedObjects);
  };

  const handleTransformEnd = (id, e) => {
    const node = e.target;
    const newWidth = node.width() * node.scaleX();
    node.scaleX(1);
    handleTextResize(id, newWidth);
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
    if (
      e.target === e.target.getStage() ||
      e.target.attrs.id === "background-image"
    ) {
      setSelectedObjectId(null); // Deselect if clicking outside shapes or on the background image
      setTextEditing({ id: null, value: "" }); // Stop editing text
    }
  };

  // Handle double-clicking on a text object to edit
  const handleTextDoubleClick = (id) => {
    const selectedText = objects.find(
      (obj) => obj.id === id && obj.type === "text"
    );
    if (selectedText) {
      const { x, y, width, text, fontSize, fontFamily, fill } = selectedText.attrs;
      setTextEditing({
        id,
        value: text,
        x,
        y,
        width,
        fontSize,
        fontFamily,
        color: fill,
      });
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.id === id ? { ...obj, attrs: { ...obj.attrs, visible: false } } : obj
        )
      );
    }
  };

  const saveEditedText = () => {
    if (textEditing.id) {
      const updatedObjects = objects.map((obj) => {
        if (obj.id === textEditing.id && obj.type === "text") {
          return {
            ...obj,
            attrs: { ...obj.attrs, text: textEditing.value, visible: true },
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
          isPlaceholder: true, // Add this flag
          attrs: {
            x: 100,
            y: 100,
            text: placeholder, // Set the placeholder text
            fontSize: 20, // Default font size
            fontFamily: "Arial", // Optional: Set font family
            draggable: true,
            fill: "#FF5722", // Different color for placeholders
            padding: 5,
            background: "#FBE9E7", // Light background for placeholders
            stroke: "#FF5722", // Border color
            strokeWidth: 1,
            cornerRadius: 5, // Rounded corners
            width: placeholder.length * 12, // Dynamic width based on text length
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
          ? {
              ...obj,
              attrs: { ...obj.attrs, fontFamily: selectedOption.value },
            }
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
    const newObjects = template.elements
      .map((element) => {
        const id = Date.now() + Math.random(); // Unique ID for each element
        const ref = React.createRef();
        if (element.type === "text") {
          return {
            id,
            type: "text",
            ref,
            attrs: {
              ...element,
              draggable: true,
            },
          };
        }
        return null;
      })
      .filter(Boolean);

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


  const handleZoom = (newZoom) => {
    const stage = stageRef.current;
  
    if (!stage) return;
  
    // Get the current pointer position on the stage
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
  
    // Calculate the pointer position relative to the stage
    const pointerToStage = {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY(),
    };
  
    // Update the stage scale
    stage.scale({ x: newZoom, y: newZoom });
  
    // Calculate new position so the zoom stays centered on the pointer
    const newPos = {
      x: pointerPosition.x - pointerToStage.x * newZoom,
      y: pointerPosition.y - pointerToStage.y * newZoom,
    };
  
    stage.position(newPos);
    stage.batchDraw(); // Redraw the stage for updated changes
  
    // Update the state for tracking zoom level
    setZoom(newZoom);
  };
  
  // Function to handle zoom in
  const handleZoomIn = () => {
    handleZoom(Math.min(zoom + 0.1, 3)); // Limit max zoom level to 3
  };
  
  // Function to handle zoom out
  const handleZoomOut = () => {
    handleZoom(Math.max(zoom - 0.1, 0.5)); // Limit min zoom level to 0.5
  };
  
  // Function to reset zoom
  const handleZoomReset = () => {
    const stage = stageRef.current;
  
    if (!stage) return;
  
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
  
    setZoom(1);
  };
  

  // Adjust canvas size and position to stay centered
  const getCanvasStyle = () => {
    return {
      transform: `scale(${zoom})`,
      transformOrigin: "center center",
    };
  };

  // Add these layer management functions
  const moveObjectUp = () => {
    if (selectedObjectId) {
      const currentIndex = objects.findIndex(obj => obj.id === selectedObjectId);
      if (currentIndex < objects.length - 1) {
        const newObjects = [...objects];
        const temp = newObjects[currentIndex];
        newObjects[currentIndex] = newObjects[currentIndex + 1];
        newObjects[currentIndex + 1] = temp;
        setObjects(newObjects);
        addToHistory(newObjects);
      }
    }
  };

  const moveObjectDown = () => {
    if (selectedObjectId) {
      const currentIndex = objects.findIndex(obj => obj.id === selectedObjectId);
      if (currentIndex > 0) {
        const newObjects = [...objects];
        const temp = newObjects[currentIndex];
        newObjects[currentIndex] = newObjects[currentIndex - 1];
        newObjects[currentIndex - 1] = temp;
        setObjects(newObjects);
        addToHistory(newObjects);
      }
    }
  };

  //global toolbar for buttons
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return; // Ignore key events when typing in input or textarea
      }

      switch (e.key) {
        case "Delete":
        case "Backspace":
          deleteAnnotation();
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            undo();
          }
          break;
        case "y":
          if (e.ctrlKey || e.metaKey) {
            redo();
          }
          break;
        case "Enter":
          if (textEditing.id) {
            saveEditedText();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditing, selectedObjectId, objects]);

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
        deleteSavedCanvas={deleteSavedCanvas} // Pass deleteSavedCanvas as a prop
        previewSavedCanvas={previewSavedCanvas} // Pass previewSavedCanvas as a prop
        objects={objects}  // Add this prop
        selectedObjectId={selectedObjectId}  // Add this prop
        setSelectedObjectId={setSelectedObjectId}  // Add this prop
        moveObjectUp={moveObjectUp}  // Add this prop
        moveObjectDown={moveObjectDown}  // Add this prop
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#f7f7f7] overflow-hidden">
        <div className="flex justify-between items-center w-full p-4 bg-white shadow-lg z-10">
          {/* Add Text and Shape dropdowns to the top navbar */}
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
              className="py-2 px-2 text-sm  border  border-gray-500 text-grey-600 rounded-lg hover:bg-gray-100 transition-colors"
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

          {/* Text formatting options */}
          {selectedObjectId !== null &&
            objects.find((obj) => obj.id === selectedObjectId)?.type ===
              "text" && (
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

          {/* Move undo, redo, and delete buttons to the top right corner */}
          <div className="flex gap-2 ml-auto">
           
            <ToolbarButton 
            onClick={saveCanvas} 
            icon={Save} 
            label="Save" 
            />

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

        <div className="flex-1 overflow-auto p-4 flex justify-center items-center  ">
          <div
            className="relative bg-white shadow-xl rounded"
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              ...getCanvasStyle(),
            }}
          >
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              ref={stageRef}
              onClick={handleStageClick}
              scaleX={zoom}
              scaleY={zoom}
            >
              <Layer>
                {/* Render uploaded image */}
                {image && (
                  <Image
                    id="background-image"
                    image={image}
                    x={0}
                    y={0}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    // Ensure the image scales with the canvas
                    scaleX={1}
                    scaleY={1}
                    onClick={handleStageClick} // Ensure background image click clears transformer
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
                          {...obj.attrs}
                          ref={obj.ref}
                          onClick={() => setSelectedObjectId(obj.id)}
                          onDblClick={() => handleTextDoubleClick(obj.id)}
                          onDragMove={(e) => handleDragMove(obj.id, e)}
                          onDragEnd={(e) => handleDragEnd(obj.id, e)}
                          onTransformEnd={(e) => handleTransformEnd(obj.id, e)}
                          // Add special styling for placeholders
                          fill={obj.isPlaceholder ? "#FF5722" : obj.attrs.fill}
                          padding={obj.isPlaceholder ? 5 : 0}
                          background={obj.isPlaceholder ? "#FBE9E7" : "transparent"}
                          stroke={obj.isPlaceholder ? "#FF5722" : "transparent"}
                          strokeWidth={obj.isPlaceholder ? 1 : 0}
                          cornerRadius={obj.isPlaceholder ? 5 : 0}
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
                    node={objects.find((obj) => obj.id === selectedObjectId)?.ref.current}
                    enabledAnchors={
                      objects.find((obj) => obj.id === selectedObjectId)?.type === 'text'
                        ? ["middle-left", "middle-right"] // Only middle anchors for text
                        : ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"] // All anchors for other objects
                    }
                    anchorSize={8}
                    anchorStroke="black"
                    anchorCornerRadius={5}
                    anchorStrokeWidth={1}
                    anchorFill="white"
                    borderStroke="yellow"
                    borderStrokeWidth={1}
                    boundBoxFunc={(oldBox, newBox) => {
                      newBox.width = Math.max(30, newBox.width);
                      return newBox;
                    }}
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
                  fontSize: textEditing.fontSize,
                  fontFamily: textEditing.fontFamily,
                  color: textEditing.color,
                  background: "transparent", // Transparent background for the textarea
                  width: textEditing.width, // Set width for textarea
                  border: "none", // Remove border
                  overflow: "hidden", // Hide overflow
                }}
                value={textEditing.value}
                onChange={(e) =>
                  setTextEditing({ ...textEditing, value: e.target.value })
                }
                onBlur={saveEditedText} // Save text on blur
                autoFocus
              />
            )}
          </div>
        </div>

        {/* Floating Zoom Buttons */}
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg shadow-lg">
              <img src={previewImage} alt="Preview" className="max-w-full max-h-full" />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default KonvaCanvas;
