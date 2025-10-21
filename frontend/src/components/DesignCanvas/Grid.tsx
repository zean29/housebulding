import React from 'react';
import { Line } from 'react-konva';

interface GridProps {
  width: number;
  height: number;
  size: number;
  zoom: number;
}

export const Grid: React.FC<GridProps> = ({ width, height, size, zoom }) => {
  const lines = [];

  // Calculate visible grid area
  const startX = -width / zoom;
  const endX = (width * 2) / zoom;
  const startY = -height / zoom;
  const endY = (height * 2) / zoom;

  // Vertical lines
  for (let x = Math.floor(startX / size) * size; x <= endX; x += size) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e0e0e0"
        strokeWidth={1 / zoom}
        opacity={0.5}
      />
    );
  }

  // Horizontal lines
  for (let y = Math.floor(startY / size) * size; y <= endY; y += size) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e0e0e0"
        strokeWidth={1 / zoom}
        opacity={0.5}
      />
    );
  }

  // Major grid lines (every 5 grid units)
  const majorSize = size * 5;

  // Major vertical lines
  for (let x = Math.floor(startX / majorSize) * majorSize; x <= endX; x += majorSize) {
    lines.push(
      <Line
        key={`mv-${x}`}
        points={[x, startY, x, endY]}
        stroke="#c0c0c0"
        strokeWidth={2 / zoom}
        opacity={0.7}
      />
    );
  }

  // Major horizontal lines
  for (let y = Math.floor(startY / majorSize) * majorSize; y <= endY; y += majorSize) {
    lines.push(
      <Line
        key={`mh-${y}`}
        points={[startX, y, endX, y]}
        stroke="#c0c0c0"
        strokeWidth={2 / zoom}
        opacity={0.7}
      />
    );
  }

  return <>{lines}</>;
};