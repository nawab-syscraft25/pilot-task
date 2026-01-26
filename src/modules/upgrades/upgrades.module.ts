import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UpgradesService } from './upgrades.service';
import { UpgradesController } from './upgrades.controller';
import { ConstructionTask } from './entities/construction-task.entity';
import { ResourcesModule } from '../resources/resources.module';
import { UpgradeQueueConsumer } from './upgrade-queue.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConstructionTask]),
    ResourcesModule,
    BullModule.registerQueue({
      name: 'upgrades',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [UpgradesService, UpgradeQueueConsumer],
  controllers: [UpgradesController],
  exports: [UpgradesService],
})
export class UpgradesModule {}
