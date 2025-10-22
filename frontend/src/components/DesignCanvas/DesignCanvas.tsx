import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasState, Tool, CanvasElement, Wall, Door, Window, Room, Point } from '../../types/design.types';
import { Grid } from './Grid';
import { WallElement } from './elements/WallElement';
import { DoorElement } from './elements/DoorElement';
import { WindowElement } from './elements/WindowElement';
import { RoomElement } from './elements/RoomElement';
import { MeasurementElement } from './elements/MeasurementElement';
import { useCanvasStore } from '../../hooks/useCanvasStore';
import { calculateDistance, snapToGrid } from '../../utils/geometry';

interface DesignCanvasProps {
  width: number;
  height: number;
  tool: Tool;
  onStateChange?: (state: CanvasState) => void;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  width,
  height,
  tool,
  onStateChange,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const {
    elements,
    selectedElements,
    viewport,
    grid,
    measurements,
    setElements,
    setSelectedElements,
    setViewport,
    updateElement,
  } = useCanvasStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  // Handle canvas interactions
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (tool.type === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedElements([]);
      }
    }
  }, [tool.type, setSelectedElements]);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    const snappedPoint = grid.snap ? snapToGrid(point, grid.size) : point;

    switch (tool.type) {
      case 'wall':
        setIsDrawing(true);
        setStartPoint(snappedPoint);
        setCurrentPoint(snappedPoint);
        break;

      case 'select':
        // Selection handled by individual elements
        break;
    }
  }, [tool.type, grid]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !startPoint) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    const snappedPoint = grid.snap ? snapToGrid(point, grid.size) : point;
    setCurrentPoint(snappedPoint);
  }, [isDrawing, startPoint, grid]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !startPoint || !currentPoint) return;

    const distance = calculateDistance(startPoint, currentPoint);
    if (distance > 10) { // Minimum wall length
      const newWall: Wall = {
        id: `wall_${Date.now()}`,
        type: 'wall',
        startPoint,
        endPoint: currentPoint,
        thickness: 150, // Default 150mm wall thickness
        type: 'interior',
        material: 'concrete',
      };

      setElements([...elements, newWall]);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  }, [isDrawing, startPoint, currentPoint, elements, setElements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElements.length > 0) {
          setElements(elements.filter(el => !selectedElements.includes(el.id)));
          setSelectedElements([]);
        }
      }
      if (e.key === 'Escape') {
        setSelectedElements([]);
        setIsDrawing(false);
        setStartPoint(null);
        setCurrentPoint(null);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          // Undo functionality
          e.preventDefault();
        }
        if (e.key === 'y') {
          // Redo functionality
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, elements, setElements, setSelectedElements]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        elements,
        selectedElements,
        viewport,
        grid,
        measurements,
      });
    }
  }, [elements, selectedElements, viewport, grid, measurements, onStateChange]);

  return (
    <div style={{ border: '1px solid #ccc', position: 'relative' }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        scaleX={viewport.zoom}
        scaleY={viewport.zoom}
        x={viewport.x}
        y={viewport.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Grid */}
          {grid.enabled && (
            <Grid
              width={width}
              height={height}
              size={grid.size}
              zoom={viewport.zoom}
            />
          )}

          {/* Render elements */}
          {elements.map((element) => {
            switch (element.type) {
              case 'wall':
                return (
                  <WallElement
                    key={element.id}
                    wall={element as Wall}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => setSelectedElements([element.id])}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                  />
                );
              case 'door':
                return (
                  <DoorElement
                    key={element.id}
                    door={element as Door}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => setSelectedElements([element.id])}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                  />
                );
              case 'window':
                return (
                  <WindowElement
                    key={element.id}
                    window={element as Window}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => setSelectedElements([element.id])}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                  />
                );
              case 'room':
                return (
                  <RoomElement
                    key={element.id}
                    room={element as Room}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => setSelectedElements([element.id])}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                  />
                );
              case 'measurement':
                return (
                  <MeasurementElement
                    key={element.id}
                    measurement={element}
                    isSelected={selectedElements.includes(element.id)}
                    onSelect={() => setSelectedElements([element.id])}
                    onUpdate={(updates) => updateElement(element.id, updates)}
                  />
                );
              default:
                return null;
            }
          })}

          {/* Current drawing preview */}
          {isDrawing && startPoint && currentPoint && (
            <Line
              points={[startPoint.x, startPoint.y, currentPoint.x, currentPoint.y]}
              stroke="#888"
              strokeWidth={2}
              dash={[5, 5]}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Selection transformer */}
          <Transformer
            ref={transformerRef}
            visible={selectedElements.length > 0}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit transformer
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      {/* Canvas info overlay */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
      }}>
        Zoom: {Math.round(viewport.zoom * 100)}% |
        Grid: {grid.enabled ? 'ON' : 'OFF'} |
        Elements: {elements.length}
      </div>
    </div>
  );
};