import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UpgradesService } from './upgrades.service';
import { CreateUpgradeDto } from './dto/create-upgrade.dto';
import { ConstructionTask } from './entities/construction-task.entity';

@ApiTags('Upgrades')
@Controller('api/v1/upgrades')
export class UpgradesController {
  constructor(private readonly upgradesService: UpgradesService) {}

  /**
   * GET /api/v1/upgrades/queue/pending
   * Get all pending tasks (for admin/monitoring)
   */
  @Get('queue/pending')
  @ApiOperation({ summary: 'Get all pending construction tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of pending tasks',
    type: [ConstructionTask],
  })
  async getPendingTasks(): Promise<ConstructionTask[]> {
    return this.upgradesService.getPendingTasks();
  }

  /**
   * GET /api/v1/upgrades/user/:userId
   * Get all construction tasks for a user
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all construction tasks for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of construction tasks',
    type: [ConstructionTask],
  })
  async getUserTasks(@Param('userId') userId: string): Promise<ConstructionTask[]> {
    return this.upgradesService.getUserTasks(userId);
  }

  /**
   * POST /api/v1/upgrades/:userId
   * Create a new upgrade/construction task
   * - Validates resources
   * - Deducts resources
   * - Creates task in queue
   */
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new upgrade/construction task',
    description:
      'Validates user has sufficient resources, deducts them, and creates a construction task in the queue',
  })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status: 201,
    description: 'Construction task created successfully',
    type: ConstructionTask,
  })
  @ApiResponse({ status: 400, description: 'Insufficient resources' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createUpgrade(
    @Param('userId') userId: string,
    @Body() createUpgradeDto: CreateUpgradeDto,
  ): Promise<ConstructionTask> {
    return this.upgradesService.createUpgrade(userId, createUpgradeDto);
  }

  /**
   * GET /api/v1/upgrades/:taskId
   * Get a specific construction task
   */
  @Get(':taskId')
  @ApiOperation({ summary: 'Get a specific construction task by ID' })
  @ApiParam({ name: 'taskId', description: 'Construction Task UUID' })
  @ApiResponse({
    status: 200,
    description: 'Construction task details',
    type: ConstructionTask,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskById(@Param('taskId') taskId: string): Promise<ConstructionTask> {
    return this.upgradesService.getTaskById(taskId);
  }
}
