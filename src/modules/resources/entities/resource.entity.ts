import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConstructionTask } from '../../upgrades/entities/construction-task.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', default: 0 })
  wood: number;

  @Column({ type: 'integer', default: 0 })
  food: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastTickAt: Date;

  @OneToOne(() => User, (user) => user.resources)
  user: User;

  @OneToMany(() => ConstructionTask, (task) => task.user)
  constructionTasks: ConstructionTask[];
}
