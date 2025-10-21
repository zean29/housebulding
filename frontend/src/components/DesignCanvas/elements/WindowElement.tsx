import React from 'react';
import { Rect, Line, Circle } from 'react-konva';
import { Window } from '../../../types/design.types';

interface WindowElementProps {
  window: Window;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Window>) => void;
}

export const WindowElement: React.FC<WindowElementProps> = ({
  window,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  // Get window color based on type
  const getWindowColor = () => {
    switch (window.type) {
      case 'single':
        return '#87ceeb';
      case 'double':
        return '#4682b4';
      case 'bay':
        return '#5f9ea0';
      case 'sliding':
        return '#6495ed';
      default:
        return '#87ceeb';
    }
  };

  const windowColor = getWindowColor();

  return (
    <>
      {/* Window frame */}
      <Rect
        x={window.position.x - window.width / 2}
        y={window.position.y - window.height / 2}
        width={window.width}
        height={window.height}
        fill={windowColor}
        stroke="#333"
        strokeWidth={2}
        opacity={0.8}
        onClick={onSelect}
        onTap={onSelect}
      />

      {/* Window panes/dividers based on type */}
      {window.type === 'single' && (
        <Line
          points={[
            window.position.x - window.width / 2 + window.width / 2,
            window.position.y - window.height / 2,
            window.position.x - window.width / 2 + window.width / 2,
            window.position.y + window.height / 2,
          ]}
          stroke="#333"
          strokeWidth={1}
        />
      )}

      {window.type === 'double' && (
        <>
          <Line
            points={[
              window.position.x - window.width / 2 + window.width / 2,
              window.position.y - window.height / 2,
              window.position.x - window.width / 2 + window.width / 2,
              window.position.y + window.height / 2,
            ]}
            stroke="#333"
            strokeWidth={2}
          />
          <Line
            points={[
              window.position.x - window.width / 2 + window.width / 4,
              window.position.y - window.height / 2,
              window.position.x - window.width / 2 + window.width / 4,
              window.position.y + window.height / 2,
            ]}
            stroke="#333"
            strokeWidth={1}
          />
          <Line
            points={[
              window.position.x - window.width / 2 + (3 * window.width) / 4,
              window.position.y - window.height / 2,
              window.position.x - window.width / 2 + (3 * window.width) / 4,
              window.position.y + window.height / 2,
            ]}
            stroke="#333"
            strokeWidth={1}
          />
        </>
      )}

      {window.type === 'bay' && (
        <>
          {/* Central window */}
          <Rect
            x={window.position.x - window.width / 3}
            y={window.position.y - window.height / 2}
            width={window.width / 3}
            height={window.height}
            fill={windowColor}
            stroke="#333"
            strokeWidth={1}
          />
          {/* Left side window */}
          <Line
            points={[
              window.position.x - window.width / 2,
              window.position.y - window.height / 2,
              window.position.x - window.width / 3,
              window.position.y + window.height / 2,
              window.position.x - window.width / 2,
              window.position.y + window.height / 2,
            ]}
            fill={windowColor}
            stroke="#333"
            strokeWidth={2}
          />
          {/* Right side window */}
          <Line
            points={[
              window.position.x + window.width / 2,
              window.position.y - window.height / 2,
              window.position.x + window.width / 3,
              window.position.y + window.height / 2,
              window.position.x + window.width / 2,
              window.position.y + window.height / 2,
            ]}
            fill={windowColor}
            stroke="#333"
            strokeWidth={2}
          />
        </>
      )}

      {window.type === 'sliding' && (
        <>
          {/* Fixed pane */}
          <Rect
            x={window.position.x - window.width / 2}
            y={window.position.y - window.height / 2}
            width={window.width / 2}
            height={window.height}
            fill={windowColor}
            stroke="#333"
            strokeWidth={1}
            opacity={0.9}
          />
          {/* Sliding pane indicator */}
          <Rect
            x={window.position.x}
            y={window.position.y - window.height / 2 + 2}
            width={window.width / 2 - 2}
            height={window.height - 4}
            fill="transparent"
            stroke="#333"
            strokeWidth={1}
            strokeDashEnabled={true}
            dash={[3, 3]}
          />
          {/* Slider handle */}
          <Rect
            x={window.position.x + window.width / 4 - 2}
            y={window.position.y - 5}
            width={4}
            height={10}
            fill="#666"
          />
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <Circle
          x={window.position.x}
          y={window.position.y}
          radius={Math.max(window.width, window.height) / 2 + 10}
          fill="transparent"
          stroke="#3498db"
          strokeWidth={2}
          strokeDashEnabled={true}
          dash={[5, 5]}
        />
      )}

      {/* Window type label */}
      {isSelected && (
        <text
          x={window.position.x}
          y={window.position.y - window.height / 2 - 15}
          text={`${window.type.toUpperCase()} - ${window.width}x${window.height}mm`}
          fontSize={10}
          fill="#2c3e50"
          align="center"
          offsetX={40}
          offsetY={5}
        />
      )}

      {/* Sill indicator */}
      <Rect
        x={window.position.x - window.width / 2 - 5}
        y={window.position.y + window.height / 2}
        width={window.width + 10}
        height={3}
        fill="#666"
        opacity={0.6}
      />
    </>
  );
};