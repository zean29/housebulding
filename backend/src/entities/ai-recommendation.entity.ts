import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Design } from './design.entity';

export enum RecommendationType {
  LAYOUT_OPTIMIZATION = 'layout_optimization',
  SPACE_EFFICIENCY = 'space_efficiency',
  BUILDING_CODE_COMPLIANCE = 'building_code_compliance',
  AESTHETIC_IMPROVEMENT = 'aesthetic_improvement',
  MATERIAL_SUGGESTION = 'material_suggestion',
  COST_OPTIMIZATION = 'cost_optimization',
}

export enum RecommendationStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  APPLIED = 'applied',
  REJECTED = 'rejected',
}

@Entity('ai_recommendations')
export class AiRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RecommendationType,
  })
  type: RecommendationType;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('jsonb')
  recommendation: {
    action: string;
    params: Record<string, any>;
    expectedImpact: {
      efficiency: number;
      cost: number;
      compliance: number;
      aesthetics: number;
    };
  };

  @Column('decimal', { precision: 3, scale: 2, default: 0.5 })
  confidence: number;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  priority: number;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.PENDING,
  })
  status: RecommendationStatus;

  @Column('jsonb', { nullable: true })
  appliedChanges: Record<string, any>;

  @Column('text', { nullable: true })
  userFeedback: string;

  @ManyToOne(() => Design, design => design.recommendations)
  @JoinColumn({ name: 'designId' })
  design: Design;

  @Column()
  designId: string;

  @CreateDateColumn()
  createdAt: Date;
}