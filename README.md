# Core Loop API - NestJS Backend

A basic NestJS API demonstrating the "Core Loop" game mechanics for the Pilot Task.

## 🎯 Features Implemented

### 1. **User Management**
- Create new users with username and email validation
- Each user gets initial resources (0 Wood, 0 Food)
- Retrieve user information with associated resources

### 2. **Resource System (Core Loop)**
- **Automatic Resource Ticker**: Every minute, all users gain +10 Wood and +10 Food
- Resource tracking per user
- Real-time resource updates

### 3. **Upgrade/Construction System**
- **POST /upgrade Endpoint**: Submit construction tasks
  - Validates user has sufficient resources
  - Deducts resources from user account
  - Creates a `ConstructionTask` in the database with timestamp
  - Queues task for processing via Bull/Redis

### 4. **Queue Logic**
- Construction tasks are queued and processed asynchronously
- Tasks transition through states: `PENDING → IN_PROGRESS → COMPLETED`
- Each task has configurable duration (default: 60 seconds)

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Supabase)
- **Task Queue**: Bull + Redis
- **ORM**: TypeORM
- **Validation**: class-validator
- **Scheduling**: @nestjs/schedule (for resource ticker)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (already configured in `.env`)
- Redis (for queue processing)

### 1. Install Dependencies
```bash
cd core-loop-api
npm install
```

### 2. Configure Environment Variables
Update `.env` with your settings:
```env
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
```

### 3. Run Migrations (if any)
```bash
npm run db:migrate
```

### 4. Start the Server

**Development Mode** (with hot reload):
```bash
npm run start:dev
```

**Production Mode**:
```bash
npm run build
npm run start:prod
```

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/v1/health
```

### User Management

**Create User**
```http
POST /api/v1/users
Content-Type: application/json

{
  "username": "player1",
  "email": "player1@example.com"
}
```

**Get All Users**
```http
GET /api/v1/users
```

**Get User by ID**
```http
GET /api/v1/users/:userId
```

### Upgrades/Construction

**Create Upgrade (Main Queue Logic)**
```http
POST /api/v1/upgrades/:userId
Content-Type: application/json

{
  "upgradeType": "building",
  "upgradeName": "Woodcutter's Hut",
  "woodCost": 50,
  "foodCost": 30,
  "durationSeconds": 120
}
```

Response:
```json
{
  "id": "task-uuid",
  "userId": "user-uuid",
  "upgradeType": "building",
  "upgradeName": "Woodcutter's Hut",
  "woodCost": 50,
  "foodCost": 30,
  "durationSeconds": 120,
  "status": "pending",
  "createdAt": "2026-01-26T10:00:00Z",
  "updatedAt": "2026-01-26T10:00:00Z"
}
```

**Get User's Construction Tasks**
```http
GET /api/v1/upgrades/user/:userId
```

**Get Task Details**
```http
GET /api/v1/upgrades/:taskId
```

**Get Pending Tasks (Admin)**
```http
GET /api/v1/upgrades/queue/pending
```

---

## 🔄 Core Loop Mechanics

### Resource Ticker Flow
1. Every minute (60 seconds), a cron job runs
2. Retrieves all users from database
3. Adds +10 Wood and +10 Food to each user
4. Updates the `lastTickAt` timestamp

```typescript
// Scheduled via @nestjs/schedule
@Cron(CronExpression.EVERY_MINUTE)
async tickResources(): Promise<void>
```

### Upgrade/Construction Flow
1. **POST /upgrades/:userId** is called with upgrade details
2. **Validation**: Check if user has enough resources
   - If insufficient: Return 400 BadRequest
3. **Deduction**: Subtract resources from user account
4. **Task Creation**: Create `ConstructionTask` record in DB
   - Status: `PENDING`
   - Duration: 60 seconds (customizable)
   - Timestamp: Current time
5. **Queue**: Task is added to Bull queue for processing
6. **Processing**: Queue consumer processes task
   - Updates status to `IN_PROGRESS`
   - Waits for duration
   - Updates status to `COMPLETED` with `completedAt` timestamp

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Resources Table
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  wood INTEGER DEFAULT 0,
  food INTEGER DEFAULT 0,
  lastTickAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userId UUID UNIQUE REFERENCES users(id)
);
```

### Construction Tasks Table
```sql
CREATE TABLE construction_tasks (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  upgradeType ENUM ('building', 'research', 'unit'),
  upgradeName VARCHAR(255) NOT NULL,
  woodCost INTEGER NOT NULL,
  foodCost INTEGER NOT NULL,
  durationSeconds INTEGER DEFAULT 60,
  status ENUM ('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  completedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test:cov
```

### Example Test Script
```bash
# 1. Create a user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player@test.com"}'

# 2. Wait 1+ minute to observe resource ticker adding resources

# 3. Create an upgrade
curl -X POST http://localhost:3000/api/v1/upgrades/:USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "upgradeType": "building",
    "upgradeName": "Woodcutter",
    "woodCost": 10,
    "foodCost": 10
  }'

# 4. Check construction tasks
curl http://localhost:3000/api/v1/upgrades/user/:USER_ID
```

---

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Environment Variables for Production
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NODE_ENV=production
PORT=3000
```

---

## 📝 Project Structure

```
src/
├── main.ts                           # Application entry point
├── app.module.ts                     # Root module
├── app.controller.ts                 # Health check endpoint
├── app.service.ts
├── config/
│   └── database.config.ts            # TypeORM configuration
├── modules/
│   ├── users/
│   │   ├── entities/user.entity.ts
│   │   ├── dto/
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── resources/
│   │   ├── entities/resource.entity.ts
│   │   ├── resources.service.ts
│   │   ├── resource-ticker.service.ts    # Core Loop ⏱️
│   │   ├── resources.module.ts
│   │   └── dto/
│   └── upgrades/
│       ├── entities/construction-task.entity.ts
│       ├── upgrades.service.ts
│       ├── upgrades.controller.ts
│       ├── upgrade-queue.consumer.ts      # Queue Processing 🎯
│       ├── upgrades.module.ts
│       └── dto/
└── shared/
    └── filters/
```

---

## 🔑 Key Implementation Details

### Resource Ticker
- **File**: `src/modules/resources/resource-ticker.service.ts`
- **Mechanism**: NestJS `@Cron` decorator
- **Frequency**: Every minute
- **Action**: +10 Wood, +10 Food per user

### Upgrade Endpoint
- **File**: `src/modules/upgrades/upgrades.controller.ts`
- **Endpoint**: `POST /api/v1/upgrades/:userId`
- **Logic**:
  1. Validates resources
  2. Deducts resources
  3. Creates task with timestamp
  4. Queues for processing

### Queue Consumer
- **File**: `src/modules/upgrades/upgrade-queue.consumer.ts`
- **Framework**: Bull + Redis
- **Process**: Handles construction duration and status updates

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is accessible
- Check network/firewall settings for Supabase

### Redis Connection Issues
- Ensure Redis is running
- Verify `REDIS_URL` in `.env`
- For local development: `redis-server` should be running

### Tasks Not Processing
- Check Redis connection
- Review queue logs in console
- Verify Bull workers are running

---

## 📈 Next Steps (Alpha Phase)

1. **Frontend Implementation**
   - React/Vue UI for user dashboard
   - Real-time resource display (WebSockets)
   - Construction queue visualization

2. **Advanced Features**
   - Player authentication (JWT)
   - Leaderboards
   - Market system
   - Alliance/Guild system
   - Trading mechanics

3. **Optimizations**
   - Caching layer (Redis)
   - Load balancing
   - Database indexing
   - Performance monitoring

4. **Infrastructure**
   - Docker containerization
   - Kubernetes deployment
   - CI/CD pipeline
   - Monitoring & logging

---

## 📞 Support

For issues or questions, please refer to the NestJS documentation or create an issue in the repository.

**Links**:
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Bull Queue Documentation](https://docs.bullmq.io)
