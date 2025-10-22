import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Design } from './design.entity';
import { User } from './user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 100, default: 'planning' })
  status: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column('timestamp', { nullable: true })
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate: Date;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Design, design => design.project)
  designs: Design[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}