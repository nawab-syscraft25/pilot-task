import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum UpgradeType {
  BUILDING = 'building',
  RESEARCH = 'research',
  UNIT = 'unit',
}

export enum ConstructionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('construction_tasks')
export class ConstructionTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: UpgradeType })
  upgradeType: UpgradeType;

  @Column({ type: 'varchar', length: 255 })
  upgradeName: string;

  @Column({ type: 'integer' })
  woodCost: number;

  @Column({ type: 'integer' })
  foodCost: number;

  @Column({ type: 'integer', default: 60 })
  durationSeconds: number;

  @Column({ type: 'enum', enum: ConstructionStatus, default: ConstructionStatus.PENDING })
  status: ConstructionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, (user) => user.resources)
  @JoinColumn({ name: 'userId' })
  user: User;
}
