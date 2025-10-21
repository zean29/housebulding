import React from 'react';
import { Line, Text, Circle } from 'react-konva';
import { Room } from '../../../types/design.types';
import { calculatePolygonArea, calculatePolygonPerimeter, isPointInPolygon } from '../../../utils/geometry';

interface RoomElementProps {
  room: Room;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Room>) => void;
}

export const RoomElement: React.FC<RoomElementProps> = ({
  room,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  // Convert vertices to flat array for Konva Line
  const points = room.vertices.flatMap(v => [v.x, v.y]);

  // Calculate room centroid for label placement
  const centroid = room.vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / room.vertices.length,
      y: acc.y + vertex.y / room.vertices.length,
    }),
    { x: 0, y: 0 }
  );

  // Get room color based on type
  const getRoomColor = () => {
    switch (room.type) {
      case 'bedroom':
        return '#ffe6e6';
      case 'bathroom':
        return '#e6f3ff';
      case 'kitchen':
        return '#fff0e6';
      case 'living':
        return '#e6ffe6';
      case 'dining':
        return '#f0e6ff';
      case 'office':
        return '#e6ffff';
      case 'storage':
        return '#f5f5f5';
      case 'garage':
        return '#e6e6e6';
      default:
        return '#f9f9f9';
    }
  };

  const roomColor = getRoomColor();

  // Format area display
  const formatArea = (area: number): string => {
    if (area >= 1000000) {
      return `${(area / 1000000).toFixed(1)}m²`;
    } else if (area >= 1000) {
      return `${(area / 1000).toFixed(1)}m²`;
    } else {
      return `${area}mm²`;
    }
  };

  return (
    <>
      {/* Room fill */}
      <Line
        points={points}
        fill={roomColor}
        stroke="#333"
        strokeWidth={2}
        closed={true}
        opacity={isSelected ? 0.9 : 0.7}
        onClick={onSelect}
        onTap={onSelect}
      />

      {/* Room pattern/hatching for different types */}
      {room.type === 'bathroom' && (
        <Line
          points={points}
          fill="transparent"
          stroke="#4da6ff"
          strokeWidth={1}
          closed={true}
          opacity={0.3}
          dash={[10, 5]}
        />
      )}

      {room.type === 'kitchen' && (
        <Line
          points={points}
          fill="transparent"
          stroke="#ff9933"
          strokeWidth={1}
          closed={true}
          opacity={0.3}
          dash={[15, 5]}
        />
      )}

      {/* Room label */}
      <Text
        x={centroid.x}
        y={centroid.y - 10}
        text={room.name || room.type.toUpperCase()}
        fontSize={14}
        fill="#2c3e50"
        fontStyle="bold"
        align="center"
        offsetX={room.name ? room.name.length * 3 : 30}
        offsetY={7}
      />

      {/* Room dimensions */}
      <Text
        x={centroid.x}
        y={centroid.y + 10}
        text={formatArea(room.area)}
        fontSize={12}
        fill="#7f8c8d"
        align="center"
        offsetX={20}
        offsetY={6}
      />

      {/* Selection handles for vertices */}
      {isSelected &&
        room.vertices.map((vertex, index) => (
          <Circle
            key={`vertex-${index}`}
            x={vertex.x}
            y={vertex.y}
            radius={6}
            fill="#3498db"
            stroke="#2980b9"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const newVertices = [...room.vertices];
              newVertices[index] = {
                x: e.target.x(),
                y: e.target.y(),
              };

              // Recalculate area and perimeter
              const newArea = calculatePolygonArea(newVertices);
              const newPerimeter = calculatePolygonPerimeter(newVertices);

              onUpdate({
                vertices: newVertices,
                area: newArea,
                perimeter: newPerimeter,
              });
            }}
          />
        ))}

      {/* Additional room info when selected */}
      {isSelected && (
        <>
          <Text
            x={centroid.x}
            y={centroid.y + 30}
            text={`Perimeter: ${Math.round(room.perimeter)}mm`}
            fontSize={10}
            fill="#95a5a6"
            align="center"
            offsetX={30}
            offsetY={5}
          />

          {/* Room type indicator */}
          <Text
            x={centroid.x}
            y={centroid.y - 25}
            text={`TYPE: ${room.type.toUpperCase()}`}
            fontSize={10}
            fill="#34495e"
            align="center"
            fontStyle="italic"
            offsetX={35}
            offsetY={5}
          />
        </>
      )}
    </>
  );
};