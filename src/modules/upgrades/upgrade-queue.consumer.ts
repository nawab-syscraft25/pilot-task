import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpgradesService } from './upgrades.service';
import { ConstructionStatus } from './entities/construction-task.entity';

@Processor('upgrades')
export class UpgradeQueueConsumer {
  private readonly logger = new Logger(UpgradeQueueConsumer.name);

  constructor(private readonly upgradesService: UpgradesService) {}

  /**
   * Process construction tasks from the queue
   * This handles the actual construction logic and completion
   */
  @Process('construct')
  async processConstruction(job: Job<{ taskId: string; durationSeconds: number }>) {
    const { taskId, durationSeconds } = job.data;

    try {
      this.logger.log(`⏳ Starting construction for task ${taskId}`);

      // Update task status to IN_PROGRESS
      await this.upgradesService.updateTaskStatus(
        taskId,
        ConstructionStatus.IN_PROGRESS,
      );

      // Wait for construction to complete
      await new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000));

      // Update task status to COMPLETED
      const completedTask = await this.upgradesService.updateTaskStatus(
        taskId,
        ConstructionStatus.COMPLETED,
      );

      this.logger.log(`✅ Construction completed for task ${taskId}`);

      return completedTask;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Error processing construction task ${taskId}: ${errorMessage}`);
      throw error;
    }
  }
}
