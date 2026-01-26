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
      let successCount = 0;
      const tickedUsers: string[] = [];

      for (const user of users) {
        try {
          const updatedResource = await this.resourcesService.addResources(
            user.id,
            this.WOOD_PER_TICK,
            this.FOOD_PER_TICK,
          );
          await this.resourcesService.updateLastTick(user.id);
          
          // Log individual user resource update
          this.logger.log(
            `👤 User ${user.username} (${user.id}): +${this.WOOD_PER_TICK} wood, +${this.FOOD_PER_TICK} food | Total: ${updatedResource.wood} wood, ${updatedResource.food} food`,
          );
          
          tickedUsers.push(user.username);
          successCount++;
        } catch (error) {
          this.logger.error(
            `Failed to tick resources for user ${user.username} (${user.id})`,
            error,
          );
        }
      }

      this.logger.log(
        `✅ Resource tick completed for ${successCount}/${users.length} users. Users: [${tickedUsers.join(', ')}]`,
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
