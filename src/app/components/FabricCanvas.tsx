"use client";

import React, { useEffect, useCallback, useImperativeHandle, useState } from 'react';

interface FabricCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasSize: { width: number; height: number };
  fabricModule: any;
}

const GRID_SIZE = 20;

const FabricCanvas: React.FC<FabricCanvasProps> = React.forwardRef(({ 
  canvasRef, 
  canvasSize, 
  fabricModule
}, ref) => {
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);

  const addFurniture = useCallback((type: string) => {
    if (!fabricCanvas || !fabricModule) return;

    const fabric = fabricModule.fabric || fabricModule;
    let object;
    let size = 100; // Default size for the bounding box

    switch (type) {
      case 'sofa':
        object = new fabric.Rect({ width: size * 1.5, height: size * 0.75, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'chair':
        object = new fabric.Circle({ radius: size / 2, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'table':
      case 'coffee table':
        object = new fabric.Rect({ width: size, height: size, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'bed':
        size = 150;
        object = new fabric.Rect({ width: size * 1.5, height: size, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'dresser':
      case 'bookshelf':
      case 'wardrobe':
        object = new fabric.Rect({ width: size * 1.2, height: size * 0.5, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'desk':
        object = new fabric.Rect({ width: size * 1.2, height: size * 0.6, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'nightstand':
        size = 60;
        object = new fabric.Rect({ width: size, height: size, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'dining table':
        size = 120;
        object = new fabric.Rect({ width: size, height: size, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'armchair':
        object = new fabric.Rect({ width: size * 0.8, height: size * 0.8, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'ottoman':
        size = 60;
        object = new fabric.Circle({ radius: size / 2, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'tv stand':
        object = new fabric.Rect({ width: size * 1.5, height: size * 0.4, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'plant':
        size = 50;
        object = new fabric.Circle({ radius: size / 2, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'rug':
        size = 200;
        object = new fabric.Rect({ width: size, height: size * 1.5, fill: 'transparent', stroke: 'transparent' });
        break;
      case 'lamp':
        size = 40;
        object = new fabric.Circle({ radius: size / 2, fill: 'transparent', stroke: 'transparent' });
        break;
      default:
        object = new fabric.Rect({ width: size, height: size, fill: 'transparent', stroke: 'transparent' });
    }

    if (object) {
      // Create text
      const text = new fabric.Text(type, {
        fontSize: 16,
        fill: 'black',
        originX: 'center',
        originY: 'center',
      });

      // Create bounding box with increased size
      const boundingBox = new fabric.Rect({
        width: size * 1.1, // Increase width by 10%
        height: size * 1.1, // Increase height by 10%
        fill: 'rgba(0,0,0,0.1)', // Slightly visible fill
        stroke: 'black',
        strokeWidth: 2,
        left: 50,
        top: 50,
      });

      // Store references to associated objects
      boundingBox.furnitureObject = object;
      boundingBox.furnitureText = text;

      // Function to enforce canvas boundaries
      const enforceBoundaries = () => {
        const canvasWidth = fabricCanvas.width;
        const canvasHeight = fabricCanvas.height;
        const boxWidth = boundingBox.width * boundingBox.scaleX;
        const boxHeight = boundingBox.height * boundingBox.scaleY;

        let left = boundingBox.left;
        let top = boundingBox.top;

        // Enforce left boundary
        if (left < 0) left = 0;
        // Enforce right boundary
        if (left + boxWidth > canvasWidth) left = canvasWidth - boxWidth;
        // Enforce top boundary
        if (top < 0) top = 0;
        // Enforce bottom boundary
        if (top + boxHeight > canvasHeight) top = canvasHeight - boxHeight;

        boundingBox.set({
          left: left,
          top: top,
        });
      };

      // Function to update object and text
      const updateContents = () => {
        enforceBoundaries();

        const canvasWidth = fabricCanvas.width;
        const canvasHeight = fabricCanvas.height;
        const boxWidth = boundingBox.width * boundingBox.scaleX;
        const boxHeight = boundingBox.height * boundingBox.scaleY;

        // Update object to fill the entire bounding box
        object.set({
          width: boxWidth,
          height: boxHeight,
          scaleX: 1,
          scaleY: 1,
          left: boundingBox.left,
          top: boundingBox.top,
        });

        // Calculate visible part of the bounding box
        const visibleLeft = Math.max(boundingBox.left, 0);
        const visibleTop = Math.max(boundingBox.top, 0);
        const visibleRight = Math.min(boundingBox.left + boxWidth, canvasWidth);
        const visibleBottom = Math.min(boundingBox.top + boxHeight, canvasHeight);
        const visibleWidth = visibleRight - visibleLeft;
        const visibleHeight = visibleBottom - visibleTop;

        // Update text size and position
        const minDimension = Math.min(visibleWidth, visibleHeight);
        const fontSize = Math.max(10, minDimension / 5); // Minimum font size of 10
        text.set({
          fontSize: fontSize,
          left: visibleLeft + visibleWidth / 2,
          top: visibleTop + visibleHeight / 2,
        });

        fabricCanvas.renderAll();
      };

      // Update on scaling and moving of bounding box
      boundingBox.on('scaling', updateContents);
      boundingBox.on('moving', updateContents);
      boundingBox.on('modified', updateContents);

      // Make only the bounding box selectable
      boundingBox.set({
        selectable: true,
        hoverCursor: 'move',
        hasBorders: true,
        hasControls: true,
      });
      object.set('selectable', false);
      text.set('selectable', false);

      // Add elements to canvas
      fabricCanvas.add(boundingBox, object, text);

      // Initial update
      updateContents();

      fabricCanvas.renderAll();
    }
  }, [fabricCanvas, fabricModule]);

  useImperativeHandle(ref, () => ({
    addFurniture,
    takeScreenshot: () => {
      if (fabricCanvas) {
        // Get metadata of objects on the canvas
        const objects = fabricCanvas.getObjects();
        const metadata = objects.map(obj => ({
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
          angle: obj.angle,
          text: obj.text || null
        }));

        // Take screenshot without changing background
        const screenshot = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1
        });

        return {
          screenshot,
          metadata
        };
      }
      return null;
    }
  }));

  const drawGrid = useCallback(() => {
    if (!fabricCanvas || !fabricModule) return;
    
    const fabric = fabricModule.fabric || fabricModule;
    fabricCanvas.clear();

    // Set white background
    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill: 'white',
      selectable: false
    });
    fabricCanvas.add(background);

    // Add grid
    for (let i = 0; i <= canvasSize.width; i += GRID_SIZE) {
      fabricCanvas.add(new fabric.Line([i, 0, i, canvasSize.height], { stroke: '#ccc', selectable: false }));
    }
    for (let i = 0; i <= canvasSize.height; i += GRID_SIZE) {
      fabricCanvas.add(new fabric.Line([0, i, canvasSize.width, i], { stroke: '#ccc', selectable: false }));
    }

    // Add room border
    const border = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false
    });
    fabricCanvas.add(border);
    fabricCanvas.renderAll();
  }, [fabricCanvas, fabricModule, canvasSize]);

  useEffect(() => {
    if (fabricModule && canvasRef.current) {
      const fabric = fabricModule.fabric || fabricModule;
      if (!fabricCanvas) {
        const canvas = new fabric.Canvas(canvasRef.current, canvasSize);
        setFabricCanvas(canvas);
      } else {
        fabricCanvas.setDimensions(canvasSize);
        drawGrid();
      }
    }
  }, [fabricModule, canvasSize, canvasRef, fabricCanvas, drawGrid]);

  useEffect(() => {
    if (fabricCanvas) {
      drawGrid();

      // Snap to grid
      fabricCanvas.on('object:moving', function(options: any) {
        const obj = options.target;
        obj.set({
          left: Math.round(obj.left / GRID_SIZE) * GRID_SIZE,
          top: Math.round(obj.top / GRID_SIZE) * GRID_SIZE
        });
      });

      // Enable object removal with Delete key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          const activeObject = fabricCanvas.getActiveObject();
          if (activeObject) {
            // Remove the bounding box
            fabricCanvas.remove(activeObject);
            
            // Remove associated furniture object and text
            if (activeObject.furnitureObject) {
              fabricCanvas.remove(activeObject.furnitureObject);
            }
            if (activeObject.furnitureText) {
              fabricCanvas.remove(activeObject.furnitureText);
            }

            fabricCanvas.renderAll();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        fabricCanvas.off('object:moving');
      };
    }
  }, [fabricCanvas, drawGrid]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-1">
      <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
        <canvas 
          ref={canvasRef} 
          width={canvasSize.width} 
          height={canvasSize.height} 
          style={{ border: '1px solid blue' }}
        />
      </div>
    </div>
  );
});

FabricCanvas.displayName = 'FabricCanvas';

export default FabricCanvas;