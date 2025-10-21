import React from 'react';
import { Rect, Arc, Line, Circle } from 'react-konva';
import { Door } from '../../../types/design.types';
import { degreesToAngle } from '../../../utils/geometry';

interface DoorElementProps {
  door: Door;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Door>) => void;
}

export const DoorElement: React.FC<DoorElementProps> = ({
  door,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  // Calculate door swing arc
  const doorAngle = degreesToAngle(door.direction);
  const swingRadius = door.width;

  // Get door color based on type
  const getDoorColor = () => {
    switch (door.type) {
      case 'single':
        return '#8b4513';
      case 'double':
        return '#a0522d';
      case 'sliding':
        return '#696969';
      case 'folding':
        return '#708090';
      default:
        return '#8b4513';
    }
  };

  const doorColor = getDoorColor();

  return (
    <>
      {/* Door opening indicator */}
      <Rect
        x={door.position.x - door.width / 2}
        y={door.position.y - 10}
        width={door.width}
        height={20}
        fill="white"
        stroke="#333"
        strokeWidth={2}
        opacity={0.7}
        onClick={onSelect}
        onTap={onSelect}
      />

      {/* Door visualization */}
      {door.type !== 'sliding' && (
        <>
          {/* Door swing arc */}
          <Arc
            x={door.position.x}
            y={door.position.y}
            innerRadius={0}
            outerRadius={swingRadius}
            angle={90}
            rotation={door.direction - 90}
            fill="transparent"
            stroke="#ccc"
            strokeWidth={1}
            dash={[5, 5]}
            opacity={0.5}
          />

          {/* Door panel */}
          <Line
            points={[
              door.position.x,
              door.position.y,
              door.position.x + Math.cos(doorAngle) * door.width,
              door.position.y + Math.sin(doorAngle) * door.width,
            ]}
            stroke={doorColor}
            strokeWidth={6}
            lineCap="round"
            onClick={onSelect}
            onTap={onSelect}
          />
        </>
      )}

      {/* Sliding door visualization */}
      {door.type === 'sliding' && (
        <>
          <Rect
            x={door.position.x - door.width / 2 - 5}
            y={door.position.y - 8}
            width={door.width / 2}
            height={16}
            fill={doorColor}
            stroke="#333"
            strokeWidth={1}
            onClick={onSelect}
            onTap={onSelect}
          />
          <Rect
            x={door.position.x + 5}
            y={door.position.y - 8}
            width={door.width / 2}
            height={16}
            fill={doorColor}
            stroke="#333"
            strokeWidth={1}
            onClick={onSelect}
            onTap={onSelect}
          />
        </>
      )}

      {/* Double door visualization */}
      {door.type === 'double' && (
        <>
          <Line
            points={[
              door.position.x,
              door.position.y,
              door.position.x + Math.cos(doorAngle) * (door.width / 2),
              door.position.y + Math.sin(doorAngle) * (door.width / 2),
            ]}
            stroke={doorColor}
            strokeWidth={5}
            lineCap="round"
            onClick={onSelect}
            onTap={onSelect}
          />
          <Line
            points={[
              door.position.x,
              door.position.y,
              door.position.x + Math.cos(doorAngle + Math.PI) * (door.width / 2),
              door.position.y + Math.sin(doorAngle + Math.PI) * (door.width / 2),
            ]}
            stroke={doorColor}
            strokeWidth={5}
            lineCap="round"
            onClick={onSelect}
            onTap={onSelect}
          />
        </>
      )}

      {/* Selection handle */}
      {isSelected && (
        <Circle
          x={door.position.x}
          y={door.position.y}
          radius={10}
          fill="transparent"
          stroke="#3498db"
          strokeWidth={2}
          strokeDashEnabled={true}
          dash={[5, 5]}
        />
      )}

      {/* Door type label */}
      {isSelected && (
        <text
          x={door.position.x}
          y={door.position.y - 25}
          text={`${door.type.toUpperCase()} - ${door.width}mm`}
          fontSize={10}
          fill="#2c3e50"
          align="center"
          offsetX={30}
          offsetY={5}
        />
      )}
    </>
  );
};