import React, { useRef, useEffect } from 'react';

function Canvas({ shapes, image, color, setShapes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

    // Draw the image if exists
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => ctx.drawImage(img, 50, 50, 100, 100); // Position and size of the image
    }

    // Draw all shapes
    shapes.forEach(shape => {
      ctx.beginPath();
      ctx.fillStyle = shape.color || color;
      if (shape.type === 'circle') {
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape.type === 'rectangle') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'text') {
        ctx.font = "20px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
      }
    });
  }, [shapes, image, color]);

  return <canvas ref={canvasRef} width={600} height={400} />;
}

export default Canvas;
