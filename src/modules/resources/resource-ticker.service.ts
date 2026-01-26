import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ResourcesService } from './resources.service';
import { ResourceTickLog } from './entities/resource-tick-log.entity';
import { formatIST } from '../../config/timezone.config';

@Injectable()
export class ResourceTickerService {
  private readonly logger = new Logger(ResourceTickerService.name);

  // Constants for resource ticking
  private readonly WOOD_PER_TICK = 10;
  private readonly FOOD_PER_TICK = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResourceTickLog)
    private readonly tickLogRepository: Repository<ResourceTickLog>,
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
          
          // Save tick log to database
          const tickLog = this.tickLogRepository.create({
            userId: user.id,
            username: user.username,
            woodAdded: this.WOOD_PER_TICK,
            foodAdded: this.FOOD_PER_TICK,
            totalWoodAfter: updatedResource.wood,
            totalFoodAfter: updatedResource.food,
            success: true,
            errorMessage: null,
          });
          await this.tickLogRepository.save(tickLog);
          
          // Log individual user resource update
          const istTime = formatIST(new Date());
          this.logger.log(
            `👤 [${istTime}] User ${user.username} (${user.id}): +${this.WOOD_PER_TICK} wood, +${this.FOOD_PER_TICK} food | Total: ${updatedResource.wood} wood, ${updatedResource.food} food`,
          );
          
          tickedUsers.push(user.username);
          successCount++;
        } catch (error) {
          // Save error log to database
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const tickLog = this.tickLogRepository.create({
            userId: user.id,
            username: user.username,
            woodAdded: 0,
            foodAdded: 0,
            totalWoodAfter: user.resources?.wood || 0,
            totalFoodAfter: user.resources?.food || 0,
            success: false,
            errorMessage,
          });
          await this.tickLogRepository.save(tickLog);
          
          this.logger.error(
            `Failed to tick resources for user ${user.username} (${user.id})`,
            error,
          );
        }
      }

      const istTime = formatIST(new Date());
      this.logger.log(
        `✅ [${istTime}] Resource tick completed for ${successCount}/${users.length} users. Users: [${tickedUsers.join(', ')}]`,
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
