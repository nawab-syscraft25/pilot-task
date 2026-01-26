import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceTickLog } from './entities/resource-tick-log.entity';
import { ResourceTickLogDto } from './dto/resource-tick-log.dto';

@ApiTags('Resources')
@Controller('api/v1/resources')
export class ResourcesController {
  constructor(
    @InjectRepository(ResourceTickLog)
    private readonly tickLogRepository: Repository<ResourceTickLog>,
  ) {}

  @Get('tick-logs')
  @ApiOperation({ summary: 'Get all resource tick logs' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of logs (default: 100)' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  async getTickLogs(
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
  ): Promise<ResourceTickLogDto[]> {
    const query = this.tickLogRepository
      .createQueryBuilder('log')
      .orderBy('log.tickedAt', 'DESC')
      .take(limit || 100);

    if (userId) {
      query.where('log.userId = :userId', { userId });
    }

    return query.getMany();
  }

  @Get('tick-logs/user/:userId')
  @ApiOperation({ summary: 'Get resource tick logs for a specific user' })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of logs (default: 50)' })
  async getUserTickLogs(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ): Promise<ResourceTickLogDto[]> {
    return this.tickLogRepository.find({
      where: { userId },
      order: { tickedAt: 'DESC' },
      take: limit || 50,
    });
  }

  @Get('tick-logs/recent')
  @ApiOperation({ summary: 'Get most recent tick logs across all users' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of logs (default: 20)' })
  async getRecentTickLogs(
    @Query('limit') limit?: number,
  ): Promise<ResourceTickLogDto[]> {
    return this.tickLogRepository.find({
      order: { tickedAt: 'DESC' },
      take: limit || 20,
    });
  }

  @Get('tick-logs/stats/:userId')
  @ApiOperation({ summary: 'Get resource tick statistics for a user' })
  @ApiParam({ name: 'userId', type: String })
  async getUserTickStats(@Param('userId') userId: string) {
    const logs = await this.tickLogRepository.find({
      where: { userId },
      order: { tickedAt: 'DESC' },
    });

    const totalTicks = logs.length;
    const successfulTicks = logs.filter(log => log.success).length;
    const failedTicks = logs.filter(log => !log.success).length;
    const totalWoodEarned = logs.reduce((sum, log) => sum + log.woodAdded, 0);
    const totalFoodEarned = logs.reduce((sum, log) => sum + log.foodAdded, 0);

    return {
      userId,
      totalTicks,
      successfulTicks,
      failedTicks,
      totalWoodEarned,
      totalFoodEarned,
      username: logs[0]?.username || 'Unknown',
      firstTick: logs[logs.length - 1]?.tickedAt,
      lastTick: logs[0]?.tickedAt,
    };
  }
}
