import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResourcesService } from './resources.service';

@Injectable()
export class ResourceTickerService {
  private readonly logger = new Logger(ResourceTickerService.name);

  // Constants for resource ticking
  private readonly WOOD_PER_TICK = 10;
  private readonly FOOD_PER_TICK = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly resourcesService: ResourcesService,
  ) {}

  /**
   * Runs every minute to add resources to all users
   * This is the 'Core Loop' mechanic - automatic resource generation
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async tickResources(): Promise<void> {
    this.logger.debug('🔄 Resource ticker started');

    try {
      // Get all users
      const users = await this.userRepository.find({
        relations: ['resources'],
      });

      if (users.length === 0) {
        this.logger.debug('No users to tick');
        return;
      }

      // Add resources to each user
      for (const user of users) {
        await this.resourcesService.addResources(
          user.id,
          this.WOOD_PER_TICK,
          this.FOOD_PER_TICK,
        );
        await this.resourcesService.updateLastTick(user.id);
      }

      this.logger.log(
        `✅ Resource tick completed for ${users.length} users. +${this.WOOD_PER_TICK} wood, +${this.FOOD_PER_TICK} food each`,
      );
    } catch (error) {
      this.logger.error('❌ Error during resource ticker', error);
    }
  }

  /**
   * Manual tick for testing purposes
   */
  async manualTick(): Promise<void> {
    await this.tickResources();
  }
}
