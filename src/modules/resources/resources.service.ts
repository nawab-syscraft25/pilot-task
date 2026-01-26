import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async createResource(): Promise<Resource> {
    const resource = this.resourceRepository.create({
      wood: 0,
      food: 0,
    });
    return this.resourceRepository.save(resource);
  }

  async getResourceByUserId(userId: string): Promise<Resource | null> {
    return this.resourceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async addResources(
    userId: string,
    wood: number,
    food: number,
  ): Promise<Resource> {
    const resource = await this.getResourceByUserId(userId);

    if (!resource) {
      throw new Error(`Resource not found for user ${userId}`);
    }

    resource.wood += wood;
    resource.food += food;
    resource.updatedAt = new Date();

    const updated = await this.resourceRepository.save(resource);
    this.logger.debug(
      `Resources added to user ${userId}: +${wood} wood, +${food} food (Total: ${updated.wood}w, ${updated.food}f)`,
    );

    return updated;
  }

  async deductResources(
    userId: string,
    wood: number,
    food: number,
  ): Promise<Resource> {
    const resource = await this.getResourceByUserId(userId);

    if (!resource) {
      throw new Error(`Resource not found for user ${userId}`);
    }

    if (resource.wood < wood || resource.food < food) {
      throw new Error('Insufficient resources');
    }

    resource.wood -= wood;
    resource.food -= food;
    resource.updatedAt = new Date();

    const updated = await this.resourceRepository.save(resource);
    this.logger.log(
      `Resources deducted from user ${userId}: -${wood} wood, -${food} food`,
    );

    return updated;
  }

  async updateLastTick(userId: string): Promise<Resource> {
    const resource = await this.getResourceByUserId(userId);

    if (!resource) {
      throw new Error(`Resource not found for user ${userId}`);
    }

    resource.lastTickAt = new Date();
    return this.resourceRepository.save(resource);
  }
}
