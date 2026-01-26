import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly resourcesService: ResourcesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    // Create new user
    const user = this.userRepository.create(createUserDto);

    // Create initial resources (0 wood, 0 food)
    const resource = await this.resourcesService.createResource();
    user.resources = resource;

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${savedUser.id}`);

    return savedUser;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['resources'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['resources'],
    });
  }
}
