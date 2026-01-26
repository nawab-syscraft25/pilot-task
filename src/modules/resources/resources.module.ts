import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ResourcesService } from './resources.service';
import { ResourceTickerService } from './resource-ticker.service';
import { Resource } from './entities/resource.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, User]),
    ScheduleModule.forRoot(),
  ],
  providers: [ResourcesService, ResourceTickerService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
