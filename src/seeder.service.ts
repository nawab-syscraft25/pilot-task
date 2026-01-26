import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Resource } from './modules/resources/entities/resource.entity';
import { ConstructionTask, ConstructionStatus, UpgradeType } from './modules/upgrades/entities/construction-task.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(ConstructionTask)
    private readonly constructionTaskRepository: Repository<ConstructionTask>,
  ) {}

  async seedAll(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');

    try {
      // Clear existing data (optional - comment out if you want to keep existing data)
      await this.clearDatabase();

      // Seed users with resources
      const users = await this.seedUsers();
      this.logger.log(`✅ Created ${users.length} users`);

      // Seed construction tasks
      const tasks = await this.seedConstructionTasks(users);
      this.logger.log(`✅ Created ${tasks.length} construction tasks`);

      this.logger.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  private async clearDatabase(): Promise<void> {
    this.logger.log('🧹 Clearing existing data...');
    
    // Use query builder to delete all records
    await this.constructionTaskRepository.createQueryBuilder().delete().execute();
    await this.userRepository.createQueryBuilder().delete().execute();
    await this.resourceRepository.createQueryBuilder().delete().execute();
    
    this.logger.log('✅ Database cleared');
  }

  private async seedUsers(): Promise<User[]> {
    const usersData = [
      {
        username: 'player1',
        email: 'player1@game.com',
        wood: 150,
        food: 120,
      },
      {
        username: 'hero2',
        email: 'hero2@game.com',
        wood: 200,
        food: 180,
      },
      {
        username: 'builder3',
        email: 'builder3@game.com',
        wood: 50,
        food: 75,
      },
      {
        username: 'newbie4',
        email: 'newbie4@game.com',
        wood: 20,
        food: 30,
      },
      {
        username: 'veteran5',
        email: 'veteran5@game.com',
        wood: 500,
        food: 450,
      },
    ];

    const users: User[] = [];

    for (const userData of usersData) {
      // Create resource
      const resource = this.resourceRepository.create({
        wood: userData.wood,
        food: userData.food,
        lastTickAt: new Date(),
      });
      const savedResource = await this.resourceRepository.save(resource);

      // Create user
      const user = this.userRepository.create({
        username: userData.username,
        email: userData.email,
        resources: savedResource,
      });
      const savedUser = await this.userRepository.save(user);
      users.push(savedUser);

      this.logger.log(
        `👤 Created user: ${userData.username} | ${userData.wood}🪵 ${userData.food}🍖`,
      );
    }

    return users;
  }

  private async seedConstructionTasks(users: User[]): Promise<ConstructionTask[]> {
    const tasksData = [
      // Player1 tasks
      {
        userId: users[0].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Woodcutter\'s Hut',
        woodCost: 50,
        foodCost: 30,
        durationSeconds: 120,
        status: ConstructionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        userId: users[0].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Farm',
        woodCost: 60,
        foodCost: 40,
        durationSeconds: 180,
        status: ConstructionStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        userId: users[0].id,
        upgradeType: UpgradeType.RESEARCH,
        upgradeName: 'Tool Workshop',
        woodCost: 80,
        foodCost: 50,
        durationSeconds: 240,
        status: ConstructionStatus.PENDING,
        createdAt: new Date(),
      },
      
      // Hero2 tasks
      {
        userId: users[1].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Barracks',
        woodCost: 100,
        foodCost: 80,
        durationSeconds: 300,
        status: ConstructionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        userId: users[1].id,
        upgradeType: UpgradeType.RESEARCH,
        upgradeName: 'Storage Upgrade',
        woodCost: 40,
        foodCost: 40,
        durationSeconds: 90,
        status: ConstructionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      
      // Builder3 tasks
      {
        userId: users[2].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Sawmill',
        woodCost: 70,
        foodCost: 50,
        durationSeconds: 150,
        status: ConstructionStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 600000), // 10 minutes ago
      },
      
      // Newbie4 tasks
      {
        userId: users[3].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Small House',
        woodCost: 20,
        foodCost: 15,
        durationSeconds: 60,
        status: ConstructionStatus.PENDING,
        createdAt: new Date(Date.now() - 120000), // 2 minutes ago
      },
      
      // Veteran5 tasks
      {
        userId: users[4].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Castle',
        woodCost: 300,
        foodCost: 250,
        durationSeconds: 600,
        status: ConstructionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 14400000), // 4 hours ago
      },
      {
        userId: users[4].id,
        upgradeType: UpgradeType.RESEARCH,
        upgradeName: 'Advanced Forge',
        woodCost: 150,
        foodCost: 120,
        durationSeconds: 420,
        status: ConstructionStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
      },
      {
        userId: users[4].id,
        upgradeType: UpgradeType.BUILDING,
        upgradeName: 'Marketplace',
        woodCost: 200,
        foodCost: 150,
        durationSeconds: 480,
        status: ConstructionStatus.PENDING,
        createdAt: new Date(),
      },
    ];

    const tasks: ConstructionTask[] = [];

    for (const taskData of tasksData) {
      const task = this.constructionTaskRepository.create(taskData);
      const savedTask = await this.constructionTaskRepository.save(task);
      tasks.push(savedTask);

      const statusEmoji = 
        taskData.status === ConstructionStatus.COMPLETED ? '✅' :
        taskData.status === ConstructionStatus.IN_PROGRESS ? '⏳' : '⏸️';
      
      const user = users.find(u => u.id === taskData.userId);
      this.logger.log(
        `${statusEmoji} ${user?.username}: ${taskData.upgradeName} (${taskData.status})`,
      );
    }

    return tasks;
  }

  async clearAll(): Promise<void> {
    await this.clearDatabase();
    this.logger.log('🧹 All data cleared successfully');
  }
}
