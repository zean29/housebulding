export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Wall {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  type: 'exterior' | 'interior' | 'load_bearing';
  material: string;
}

export interface Door {
  id: string;
  position: Point;
  width: number;
  height: number;
  type: 'single' | 'double' | 'sliding' | 'folding';
  direction: number;
  wallId: string;
}

export interface Window {
  id: string;
  position: Point;
  width: number;
  height: number;
  type: 'single' | 'double' | 'bay' | 'sliding';
  wallId: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'storage' | 'garage' | 'other';
  vertices: Point[];
  area: number;
  perimeter: number;
}

export interface Furniture {
  id: string;
  type: string;
  position: Point;
  rotation: number;
  dimensions: Dimensions;
  style: string;
}

export interface Measurement {
  id: string;
  startPoint: Point;
  endPoint: Point;
  value: number;
  unit: 'mm' | 'cm' | 'm' | 'inch' | 'ft';
  label?: string;
}

export interface CanvasElement extends Wall | Door | Window | Room | Furniture | Measurement {
  type: 'wall' | 'door' | 'window' | 'room' | 'furniture' | 'measurement';
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElements: string[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  grid: {
    enabled: boolean;
    size: number;
    snap: boolean;
  };
  measurements: {
    show: boolean;
    unit: 'mm' | 'cm' | 'm' | 'inch' | 'ft';
  };
}

export interface Tool {
  type: 'select' | 'wall' | 'door' | 'window' | 'room' | 'furniture' | 'measurement' | 'pan' | 'zoom';
  active: boolean;
  cursor?: string;
}

export interface BuildingCodeConstraints {
  minRoomSize: Record<string, number>;
  minDoorWidth: Record<string, number>;
  minWindowArea: Record<string, number>;
  maxFloorArea: number;
  minCeilingHeight: number;
  emergencyExitRequirements: any;
}