import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsNumber } from 'class-validator';
import { DesignType } from '../../../entities/design.entity';

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(DesignType)
  type: DesignType;

  @IsObject()
  canvasData: {
    version: string;
    elements: any[];
    viewport: { x: number; y: number; zoom: number };
    grid: { enabled: boolean; size: number; snap: boolean };
    measurements: any;
  };

  @IsOptional()
  @IsObject()
  model3dData?: {
    geometry: any;
    materials: any;
    textures: any;
    lighting: any;
  };

  @IsOptional()
  @IsNumber()
  totalArea?: number;

  @IsOptional()
  @IsNumber()
  perimeter?: number;

  @IsOptional()
  @IsNumber()
  ceilingHeight?: number;

  @IsOptional()
  @IsObject()
  rooms?: Array<{
    id: string;
    name: string;
    type: string;
    area: number;
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
  }>;

  @IsOptional()
  @IsObject()
  materials?: Record<string, any>;

  @IsUUID()
  projectId: string;
}