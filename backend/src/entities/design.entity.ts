import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { AiRecommendation } from './ai-recommendation.entity';

export enum DesignType {
  FLOOR_PLAN_2D = 'floor_plan_2d',
  MODEL_3D = 'model_3d',
}

export enum DesignStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
}

@Entity('designs')
export class Design {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DesignType,
    default: DesignType.FLOOR_PLAN_2D,
  })
  type: DesignType;

  @Column({
    type: 'enum',
    enum: DesignStatus,
    default: DesignStatus.DRAFT,
  })
  status: DesignStatus;

  @Column('jsonb')
  canvasData: {
    version: string;
    elements: any[];
    viewport: any;
    grid: any;
    measurements: any;
  };

  @Column('jsonb', { nullable: true })
  model3dData: {
    geometry: any;
    materials: any;
    textures: any;
    lighting: any;
  };

  @Column('decimal', { precision: 8, scale: 2 })
  totalArea: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  perimeter: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
    ceilingHeight: number;

  @Column('jsonb', { nullable: true })
  rooms: Array<{
    id: string;
    name: string;
    type: string;
    area: number;
    dimensions: { width: number; height: number };
    position: { x: number; y: number };
  }>;

  @Column('jsonb', { nullable: true })
  materials: Record<string, any>;

  @ManyToOne(() => Project, project => project.designs)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: string;

  @OneToMany(() => AiRecommendation, recommendation => recommendation.design)
  recommendations: AiRecommendation[];

  @Column('int', { default: 1 })
  version: number;

  @Column('uuid', { nullable: true })
  parentDesignId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}