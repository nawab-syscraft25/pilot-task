import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { User } from './modules/users/entities/user.entity';
import { Resource } from './modules/resources/entities/resource.entity';
import { ResourceTickLog } from './modules/resources/entities/resource-tick-log.entity';
import { ConstructionTask } from './modules/upgrades/entities/construction-task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User, Resource, ResourceTickLog, ConstructionTask],
        synchronize: process.env.NODE_ENV === 'development',
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([User, Resource, ResourceTickLog, ConstructionTask]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
