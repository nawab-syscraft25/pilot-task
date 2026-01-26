import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { formatIST } from './config/timezone.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Core Loop API')
    .setDescription('NestJS API for Core Loop game mechanics - Pilot Task')
    .setVersion('0.1.0')
    .addTag('Health', 'Health check endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Upgrades', 'Upgrade and construction endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const startTime = formatIST(new Date());
  console.log(`
    🚀 Core Loop API is running!
    ⏰ Started at: ${startTime} IST
    📍 Server: http://localhost:${port}
    📚 API Prefix: /api/v1
    
    📖 Swagger Documentation: http://localhost:${port}/docs
    
    📋 Available Endpoints:
    GET  /api/v1/health                           - Health check
    POST /api/v1/users                            - Create user
    GET  /api/v1/users                            - Get all users
    GET  /api/v1/users/:id                        - Get user by ID
    POST /api/v1/upgrades/:userId                 - Create upgrade (queue construction)
    GET  /api/v1/upgrades/user/:userId            - Get user's construction tasks
    GET  /api/v1/upgrades/:taskId                 - Get task details
    GET  /api/v1/upgrades/queue/pending           - Get pending tasks
    GET  /api/v1/resources/tick-logs              - Get all tick logs
    GET  /api/v1/resources/tick-logs/user/:userId - Get user tick logs
    GET  /api/v1/resources/tick-logs/recent       - Get recent tick logs
    GET  /api/v1/resources/tick-logs/stats/:userId - Get user tick stats
    
    🔄 Background Services:
    ⏱️  Resource Ticker - Runs every minute, adds +10 Wood/Food to each user
    🎯 Queue Consumer - Processes construction tasks from the queue
    🌏 Timezone: IST (Indian Standard Time, UTC+05:30)
  `);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
