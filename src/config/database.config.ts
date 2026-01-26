import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Resource } from '../modules/resources/entities/resource.entity';
import { ResourceTickLog } from '../modules/resources/entities/resource-tick-log.entity';
import { ConstructionTask } from '../modules/upgrades/entities/construction-task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Resource, ResourceTickLog, ConstructionTask],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
