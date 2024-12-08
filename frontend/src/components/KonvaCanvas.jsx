import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Rect, Circle, Text, Transformer } from 'react-konva';

const KonavaCanvas = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [objects, setObjects] = useState([]); // Store objects with refs
  const [selectedObjectId, setSelectedObjectId] = useState(null); // Track selected object by ID
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageUrl]);

  useEffect(() => {
    if (transformerRef.current && selectedObjectId !== null) {
      const selectedNode = objects.find((obj) => obj.id === selectedObjectId)?.ref.current;
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedObjectId, objects]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addRectangle = () => {
    const id = Date.now();
    const rectRef = React.createRef();
    setObjects((prevObjects) => [
      ...prevObjects,
      { id, type: 'rect', ref: rectRef, attrs: { x: 50, y: 50, width: 100, height: 80, fill: 'rgba(0, 0, 255, 0.3)', draggable: true } },
    ]);
  };

  const addCircle = () => {
    const id = Date.now();
    const circleRef = React.createRef();
    setObjects((prevObjects) => [
      ...prevObjects,
      { id, type: 'circle', ref: circleRef, attrs: { x: 200, y: 200, radius: 50, fill: 'rgba(255, 0, 0, 0.3)', draggable: true } },
    ]);
  };

  const addText = () => {
    const id = Date.now();
    const textRef = React.createRef();
    setObjects((prevObjects) => [
      ...prevObjects,
      { id, type: 'text', ref: textRef, attrs: { x: 300, y: 300, text: 'Sample Text', fontSize: 20, draggable: true } },
    ]);
  };

  const deleteAnnotation = () => {
    if (selectedObjectId !== null) {
      setObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== selectedObjectId));
      setSelectedObjectId(null);
    } else {
      alert('Please select an object to delete');
    }
  };

  const handleObjectClick = (id) => {
    setSelectedObjectId(id);
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 p-2 border border-blue-300 rounded" />

      <div className="flex space-x-4 mb-4">
        <button onClick={addRectangle} className="bg-violet-400 text-white p-2 rounded">Add Rectangle</button>
        <button onClick={addCircle} className="bg-blue-400 text-white p-2 rounded">Add Circle</button>
        <button onClick={addText} className="bg-green-400 text-white p-2 rounded">Add Text</button>
        <button onClick={deleteAnnotation} className="border border-red-500 text-red-500 hover:border-red-300 p-2 rounded">Delete Selected</button>
      </div>

      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
          {image && (
            <Image
              image={image}
              x={50}
              y={50}
              width={image.width * 0.5}
              height={image.height * 0.5}
            />
          )}

          {objects.map((obj) => {
            if (obj.type === 'rect') {
              return (
                <Rect
                  key={obj.id}
                  {...obj.attrs}
                  ref={obj.ref}
                  onClick={() => handleObjectClick(obj.id)}
                />
              );
            }
            if (obj.type === 'circle') {
              return (
                <Circle
                  key={obj.id}
                  {...obj.attrs}
                  ref={obj.ref}
                  onClick={() => handleObjectClick(obj.id)}
                />
              );
            }
            if (obj.type === 'text') {
              return (
                <Text
                  key={obj.id}
                  {...obj.attrs}
                  ref={obj.ref}
                  onClick={() => handleObjectClick(obj.id)}
                />
              );
            }
            return null;
          })}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonavaCanvas;
