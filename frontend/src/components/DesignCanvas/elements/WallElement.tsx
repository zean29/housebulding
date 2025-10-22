import React from 'react';
import { Line, Circle } from 'react-konva';
import { Wall } from '../../../types/design.types';
import { calculateDistance, angleToDegrees } from '../../../utils/geometry';

interface WallElementProps {
  wall: Wall;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Wall>) => void;
}

export const WallElement: React.FC<WallElementProps> = ({
  wall,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const length = calculateDistance(wall.startPoint, wall.endPoint);
  const angle = angleToDegrees(
    Math.atan2(
      wall.endPoint.y - wall.startPoint.y,
      wall.endPoint.x - wall.startPoint.x
    )
  );

  // Wall styling based on type
  const getWallStyle = () => {
    switch (wall.type) {
      case 'exterior':
        return { stroke: '#2c3e50', strokeWidth: wall.thickness / 10 };
      case 'load_bearing':
        return { stroke: '#34495e', strokeWidth: wall.thickness / 8 };
      default:
        return { stroke: '#7f8c8d', strokeWidth: wall.thickness / 12 };
    }
  };

  const wallStyle = getWallStyle();

  return (
    <>
      {/* Main wall line */}
      <Line
        points={[
          wall.startPoint.x,
          wall.startPoint.y,
          wall.endPoint.x,
          wall.endPoint.y,
        ]}
        {...wallStyle}
        lineCap="square"
        lineJoin="miter"
        opacity={isSelected ? 1 : 0.8}
        onClick={onSelect}
        onTap={onSelect}
        strokeScaleEnabled={false}
      />

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Start point handle */}
          <Circle
            x={wall.startPoint.x}
            y={wall.startPoint.y}
            radius={8}
            fill="#3498db"
            stroke="#2980b9"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              onUpdate({
                startPoint: {
                  x: e.target.x(),
                  y: e.target.y(),
                },
              });
            }}
          />

          {/* End point handle */}
          <Circle
            x={wall.endPoint.x}
            y={wall.endPoint.y}
            radius={8}
            fill="#3498db"
            stroke="#2980b9"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              onUpdate({
                endPoint: {
                  x: e.target.x(),
                  y: e.target.y(),
                },
              });
            }}
          />

          {/* Wall length label */}
          <text
            x={(wall.startPoint.x + wall.endPoint.x) / 2}
            y={(wall.startPoint.y + wall.endPoint.y) / 2 - 15}
            text={`${Math.round(length)}mm`}
            fontSize={12}
            fill="#2c3e50"
            fontStyle="bold"
            align="center"
            offsetX={20}
            offsetY={6}
          />
        </>
      )}

      {/* Wall type indicator */}
      {isSelected && (
        <text
          x={(wall.startPoint.x + wall.endPoint.x) / 2}
          y={(wall.startPoint.y + wall.endPoint.y) / 2 + 15}
          text={wall.type.replace('_', ' ').toUpperCase()}
          fontSize={10}
          fill="#7f8c8d"
          align="center"
          offsetX={25}
          offsetY={5}
        />
      )}
    </>
  );
};