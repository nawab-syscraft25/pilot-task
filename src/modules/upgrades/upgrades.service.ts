import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstructionTask, ConstructionStatus } from './entities/construction-task.entity';
import { CreateUpgradeDto } from './dto/create-upgrade.dto';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class UpgradesService {
  private readonly logger = new Logger(UpgradesService.name);

  constructor(
    @InjectRepository(ConstructionTask)
    private readonly constructionTaskRepository: Repository<ConstructionTask>,
    private readonly resourcesService: ResourcesService,
  ) {}

  /**
   * Creates an upgrade/construction task
   * 1. Validates that user has enough resources
   * 2. Deducts resources from user
   * 3. Creates a construction task in the database
   * 4. Queues the task for processing (future: via Redis/Bull)
   */
  async createUpgrade(
    userId: string,
    createUpgradeDto: CreateUpgradeDto,
  ): Promise<ConstructionTask> {
    this.logger.log(
      `Creating upgrade "${createUpgradeDto.upgradeName}" for user ${userId}`,
    );

    try {
      // Step 1: Get user's resources
      const resource = await this.resourcesService.getResourceByUserId(userId);

      if (!resource) {
        throw new BadRequestException('User resources not found');
      }

      // Step 2: Validate resources
      if (resource.wood < createUpgradeDto.woodCost) {
        throw new BadRequestException(
          `Insufficient wood. Required: ${createUpgradeDto.woodCost}, Available: ${resource.wood}`,
        );
      }

      if (resource.food < createUpgradeDto.foodCost) {
        throw new BadRequestException(
          `Insufficient food. Required: ${createUpgradeDto.foodCost}, Available: ${resource.food}`,
        );
      }

      // Step 3: Deduct resources
      await this.resourcesService.deductResources(
        userId,
        createUpgradeDto.woodCost,
        createUpgradeDto.foodCost,
      );

      // Step 4: Create construction task
      const task = this.constructionTaskRepository.create({
        userId,
        upgradeType: createUpgradeDto.upgradeType,
        upgradeName: createUpgradeDto.upgradeName,
        woodCost: createUpgradeDto.woodCost,
        foodCost: createUpgradeDto.foodCost,
        durationSeconds: createUpgradeDto.durationSeconds || 60,
        status: ConstructionStatus.PENDING,
      });

      const savedTask = await this.constructionTaskRepository.save(task);

      this.logger.log(
        `✅ Upgrade task created: ${savedTask.id} - Resources deducted and queued for processing`,
      );

      // TODO: Queue task to Redis/Bull for async processing
      // This would handle the actual construction/completion logic

      return savedTask;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error creating upgrade: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Get all construction tasks for a user
   */
  async getUserTasks(userId: string): Promise<ConstructionTask[]> {
    return this.constructionTaskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific construction task
   */
  async getTaskById(taskId: string): Promise<ConstructionTask> {
    const task = await this.constructionTaskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Construction task not found');
    }

    return task;
  }

  /**
   * Get all pending tasks (for queue processing)
   */
  async getPendingTasks(): Promise<ConstructionTask[]> {
    return this.constructionTaskRepository.find({
      where: { status: ConstructionStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Update task status (called by queue consumer)
   */
  async updateTaskStatus(
    taskId: string,
    status: ConstructionStatus,
  ): Promise<ConstructionTask> {
    const task = await this.getTaskById(taskId);

    task.status = status;
    if (status === ConstructionStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    return this.constructionTaskRepository.save(task);
  }
}
