import React from 'react';
import { Line, Text, Arrow, Circle } from 'react-konva';
import { Measurement } from '../../../types/design.types';
import { calculateDistance, angleToDegrees } from '../../../utils/geometry';

interface MeasurementElementProps {
  measurement: Measurement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Measurement>) => void;
}

export const MeasurementElement: React.FC<MeasurementElementProps> = ({
  measurement,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const distance = calculateDistance(measurement.startPoint, measurement.endPoint);
  const angle = angleToDegrees(
    Math.atan2(
      measurement.endPoint.y - measurement.startPoint.y,
      measurement.endPoint.x - measurement.startPoint.x
    )
  );

  // Calculate offset position for measurement text
  const offsetDistance = 20;
  const offsetAngle = angle + 90;
  const midX = (measurement.startPoint.x + measurement.endPoint.x) / 2;
  const midY = (measurement.startPoint.y + measurement.endPoint.y) / 2;

  const textX = midX + Math.cos((offsetAngle * Math.PI) / 180) * offsetDistance;
  const textY = midY + Math.sin((offsetAngle * Math.PI) / 180) * offsetDistance;

  // Format measurement value based on unit
  const formatMeasurement = (value: number, unit: string): string => {
    switch (unit) {
      case 'mm':
        return `${Math.round(value)}mm`;
      case 'cm':
        return `${(value / 10).toFixed(1)}cm`;
      case 'm':
        return `${(value / 1000).toFixed(2)}m`;
      case 'inch':
        return `${(value / 25.4).toFixed(1)}"`;
      case 'ft':
        return `${(value / 304.8).toFixed(2)}'`;
      default:
        return `${Math.round(value)}mm`;
    }
  };

  const formattedValue = formatMeasurement(measurement.value || distance, measurement.unit);

  return (
    <>
      {/* Measurement line */}
      <Line
        points={[
          measurement.startPoint.x,
          measurement.startPoint.y,
          measurement.endPoint.x,
          measurement.endPoint.y,
        ]}
        stroke="#e74c3c"
        strokeWidth={2}
        opacity={0.8}
        onClick={onSelect}
        onTap={onSelect}
      />

      {/* Extension lines */}
      <Line
        points={[
          measurement.startPoint.x,
          measurement.startPoint.y,
          measurement.startPoint.x + Math.cos(((angle + 90) * Math.PI) / 180) * 10,
          measurement.startPoint.y + Math.sin(((angle + 90) * Math.PI) / 180) * 10,
        ]}
        stroke="#e74c3c"
        strokeWidth={1}
        opacity={0.6}
      />

      <Line
        points={[
          measurement.endPoint.x,
          measurement.endPoint.y,
          measurement.endPoint.x + Math.cos(((angle + 90) * Math.PI) / 180) * 10,
          measurement.endPoint.y + Math.sin(((angle + 90) * Math.PI) / 180) * 10,
        ]}
        stroke="#e74c3c"
        strokeWidth={1}
        opacity={0.6}
      />

      {/* End markers */}
      <Circle
        x={measurement.startPoint.x}
        y={measurement.startPoint.y}
        radius={3}
        fill="#e74c3c"
      />

      <Circle
        x={measurement.endPoint.x}
        y={measurement.endPoint.y}
        radius={3}
        fill="#e74c3c}
      />

      {/* Measurement text background */}
      <text
        x={textX}
        y={textY}
        text={formattedValue}
        fontSize={12}
        fill="white"
        align="center"
        offsetX={formattedValue.length * 3 + 4}
        offsetY={8}
      />

      {/* Measurement text */}
      <Text
        x={textX}
        y={textY}
        text={formattedValue}
        fontSize={12}
        fill="#c0392b"
        fontStyle="bold"
        align="center"
        offsetX={formattedValue.length * 3 + 4}
        offsetY={8}
        onClick={onSelect}
        onTap={onSelect}
      />

      {/* Optional label */}
      {measurement.label && (
        <Text
          x={textX}
          y={textY + 15}
          text={measurement.label}
          fontSize={10}
          fill="#7f8c8d"
          align="center"
          fontStyle="italic"
          offsetX={measurement.label.length * 2.5 + 4}
          offsetY={6}
        />
      )}

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Start point handle */}
          <Circle
            x={measurement.startPoint.x}
            y={measurement.startPoint.y}
            radius={8}
            fill="transparent"
            stroke="#3498db"
            strokeWidth={2}
            strokeDashEnabled={true}
            dash={[3, 3]}
            draggable
            onDragMove={(e) => {
              const newDistance = calculateDistance(
                { x: e.target.x(), y: e.target.y() },
                measurement.endPoint
              );
              onUpdate({
                startPoint: {
                  x: e.target.x(),
                  y: e.target.y(),
                },
                value: newDistance,
              });
            }}
          />

          {/* End point handle */}
          <Circle
            x={measurement.endPoint.x}
            y={measurement.endPoint.y}
            radius={8}
            fill="transparent"
            stroke="#3498db"
            strokeWidth={2}
            strokeDashEnabled={true}
            dash={[3, 3]}
            draggable
            onDragMove={(e) => {
              const newDistance = calculateDistance(
                measurement.startPoint,
                { x: e.target.x(), y: e.target.y() }
              );
              onUpdate({
                endPoint: {
                  x: e.target.x(),
                  y: e.target.y(),
                },
                value: newDistance,
              });
            }}
          />
        </>
      )}

      {/* Unit indicator when selected */}
      {isSelected && (
        <Text
          x={textX}
          y={textY - 15}
          text={`UNIT: ${measurement.unit.toUpperCase()}`}
          fontSize={9}
          fill="#95a5a6"
          align="center"
          fontStyle="italic"
          offsetX={25}
          offsetY={5}
        />
      )}
    </>
  );
};