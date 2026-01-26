import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ResourceTickerService } from './resource-ticker.service';
import { Resource } from './entities/resource.entity';
import { ResourceTickLog } from './entities/resource-tick-log.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, ResourceTickLog, User]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourceTickerService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
