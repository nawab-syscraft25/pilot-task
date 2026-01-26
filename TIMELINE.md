# Core Loop API - Pilot Task Timeline

## 📋 Project Overview

**Goal**: Create a basic NestJS API demonstrating the Core Loop mechanics for a game server.

**Duration**: 2-3 Weeks (depending on team size and complexity)

---

## 📅 Detailed Timeline & Deliverables

### **Week 1: Foundation & Core Infrastructure**

#### **Phase 1.1: Project Setup (Days 1-2) - 1-2 Days**
- ✅ Initialize NestJS project with TypeScript
- ✅ Configure PostgreSQL connection (Supabase)
- ✅ Set up environment variables & configuration
- ✅ Install dependencies (TypeORM, Bull, Redis)
- ✅ Configure database migrations
- **Deliverable**: Basic project structure with database connection

#### **Phase 1.2: User Management Module (Days 2-3) - 1-2 Days**
- ✅ Create `User` entity with validation
- ✅ Create `Resource` entity linked to users
- ✅ Implement `UsersService` and `UsersController`
- ✅ Create POST `/users` endpoint for user registration
- ✅ Create GET `/users` and GET `/users/:id` endpoints
- ✅ Add input validation (class-validator)
- **Deliverable**: User creation and retrieval fully functional

#### **Phase 1.3: Resource System - Core Loop (Days 4-5) - 1-2 Days**
- ✅ Create `ResourcesService` for resource management
- ✅ Implement automatic resource ticker
- ✅ Configure NestJS scheduler (@nestjs/schedule)
- ✅ Set up cron job to run every minute
- ✅ Add +10 Wood/Food per minute to all users
- ✅ Test resource accumulation
- **Deliverable**: Resource Ticker fully operational

### **Week 2: Queue Logic & Upgrades**

#### **Phase 2.1: Construction Task System (Days 6-7) - 1-2 Days**
- ✅ Create `ConstructionTask` entity
- ✅ Define upgrade types (building, research, unit)
- ✅ Define task statuses (pending, in_progress, completed, cancelled)
- ✅ Create `UpgradesService` with business logic
- ✅ Implement resource validation
- ✅ Implement resource deduction logic
- **Deliverable**: Task entity and service layer complete

#### **Phase 2.2: Upgrade Endpoint & Queue Integration (Days 8-9) - 1-2 Days**
- ✅ Create POST `/upgrades/:userId` endpoint
- ✅ Implement request validation (DTO validation)
- ✅ Add resource checking & deduction logic
- ✅ Create construction task records in database
- ✅ Integrate Bull queue for task processing
- ✅ Set up Redis connection
- ✅ Create `UpgradeQueueConsumer` for async processing
- **Deliverable**: Full upgrade endpoint with queue integration

#### **Phase 2.3: Testing & Documentation (Days 10) - 1 Day**
- ✅ Write unit tests for services
- ✅ Write integration tests for endpoints
- ✅ Create API documentation
- ✅ Write README with examples
- ✅ Test all endpoints with Postman/cURL
- **Deliverable**: Complete test suite & documentation

### **Week 3: Polish & Deployment (Optional - For Alpha Phase Readiness)**

#### **Phase 3.1: Error Handling & Validation (Days 11-12) - 1 Day**
- ✅ Implement global exception filters
- ✅ Add comprehensive error messages
- ✅ Validate all inputs
- ✅ Handle edge cases
- **Deliverable**: Production-ready error handling

#### **Phase 3.2: Performance & Optimization (Days 13) - 1 Day**
- Database indexing for common queries
- Add response caching where applicable
- Optimize query performance
- Load testing
- **Deliverable**: Optimized performance metrics

#### **Phase 3.3: Deployment & Documentation (Days 14) - 1 Day**
- Create Docker configuration
- Set up CI/CD pipeline (optional)
- Deploy to staging environment
- Create deployment guide
- **Deliverable**: Deployment-ready application

---

## 🎯 Minimum Viable Product (MVP) - By End of Week 2

### What's Included ✅
- User creation and management
- Resource ticker (+10 Wood/Food every minute)
- Upgrade/construction endpoint with resource validation
- Construction task queue with Bull/Redis
- Task status tracking (pending → in_progress → completed)
- Full API documentation
- Database schema with PostgreSQL
- Error handling and validation

### What's NOT Included (For Alpha Phase)
- User authentication (JWT)
- Frontend/UI
- WebSocket real-time updates
- Leaderboards
- Trading system
- Advanced analytics

---

## 📊 Resource Estimates

### Team Composition (Recommended)
- **Backend Developer**: 1-2 (primary developer + optional reviewer)
- **DevOps/Database**: 0.5 (setup & optimization)
- **QA/Testing**: 0.5 (testing & bug fixes)

### Total Effort
- **Optimistic**: 5-7 days (1 senior developer)
- **Realistic**: 10-14 days (1 developer + part-time support)
- **Conservative**: 14-21 days (1 developer + full QA)

### Cost Estimate (Hourly Rate: $50-150/hour)
- **Optimistic**: $2,000 - $6,000
- **Realistic**: $4,000 - $10,500
- **Conservative**: $5,600 - $21,000

---

## 🔄 Development Flow

### Daily Standup Topics
- ✅ What was completed yesterday?
- 🔄 What's in progress today?
- 🚧 Any blockers or challenges?
- 📅 What's planned for next day?

### Code Review Checklist
- [ ] Code follows NestJS best practices
- [ ] Tests pass (>80% coverage)
- [ ] Database migrations work correctly
- [ ] Error handling is comprehensive
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Performance is acceptable

---

## 🚀 Success Criteria

### ✅ Pilot Task is Successful When:
1. **Core Loop Mechanic Works**
   - Resource ticker adds +10 Wood/Food every minute to all users
   - Resources persist in database
   - Multiple users can have independent resources

2. **Upgrade System Works**
   - POST endpoint validates resources correctly
   - Resources are deducted on upgrade creation
   - Construction tasks are queued and tracked
   - Task status transitions work (pending → completed)

3. **API is Robust**
   - All endpoints have proper error handling
   - Input validation prevents bad data
   - Database is properly structured
   - Queue processes tasks reliably

4. **Documentation is Complete**
   - README with setup instructions
   - API endpoint documentation
   - Example requests/responses
   - Troubleshooting guide

5. **Ready for Alpha Phase**
   - Code is maintainable and scalable
   - Performance is acceptable
   - Can be deployed to production environment
   - Foundation for frontend implementation

---

## 📈 Risk Analysis & Mitigation

### High Risk Items
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Database connection issues | Medium | High | Test early with Supabase, have fallback plan |
| Redis queue failure | Medium | High | Implement queue monitoring, add logging |
| Performance under load | Low | High | Load testing early, optimize queries |

### Medium Risk Items
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| TypeORM migration issues | Low | Medium | Document schema, test migrations early |
| Timezone issues | Medium | Low | Use UTC timestamps consistently |

---

## 📝 Deliverables Checklist

### Code Deliverables
- [x] NestJS backend project structure
- [x] User management module
- [x] Resource system with automatic ticker
- [x] Upgrade/construction module with queue
- [x] Database schema with PostgreSQL
- [x] Bull queue configuration with Redis
- [x] Error handling and validation
- [x] Unit and integration tests

### Documentation Deliverables
- [x] README with setup instructions
- [x] API endpoint documentation
- [x] Database schema documentation
- [x] Architecture overview
- [x] Deployment guide
- [x] Troubleshooting guide

### Infrastructure Deliverables
- [x] .env configuration template
- [x] Docker setup (optional)
- [x] Database migrations
- [x] Git repository with proper structure

---

## 🎉 Post-Pilot (Alpha Phase)

Once the pilot is successful, proceed with:

### Frontend Development (2-3 weeks)
- User dashboard with real-time resource display
- Construction queue visualization
- Upgrade selection interface
- WebSocket integration for live updates

### Additional Backend Features (2-3 weeks)
- User authentication (JWT)
- Leaderboard system
- Alliance/guild system
- Trading mechanics
- Battle system

### Infrastructure & DevOps (1-2 weeks)
- Docker containerization
- Kubernetes deployment
- CI/CD pipeline (GitHub Actions, Jenkins)
- Monitoring & logging (ELK stack, Datadog)
- Database backup strategy

---

## 📞 Communication & Approval Gates

### Gate 1: Project Setup (End of Day 2)
- Database connection verified
- Dependencies installed
- Project structure approved
- **Go/No-Go Decision**: Proceed to Phase 1.2

### Gate 2: User Management (End of Day 4)
- User creation endpoint working
- Database persistence confirmed
- Tests passing
- **Go/No-Go Decision**: Proceed to Phase 1.3

### Gate 3: Core Loop Implementation (End of Day 6)
- Resource ticker running correctly
- Resources accumulating in database
- Performance acceptable
- **Go/No-Go Decision**: Proceed to Phase 2

### Gate 4: MVP Completion (End of Day 14)
- All features implemented
- Tests passing
- Documentation complete
- Performance tested
- **Decision**: Ready for Alpha Phase

---

## 💡 Notes

- This timeline assumes 8-hour work days
- Buffer time of 2-3 days is recommended for unforeseen issues
- If team has limited NestJS experience, add 2-3 days for learning curve
- Redis setup might require additional DevOps time if not already available
- Regular commits and code review will help maintain quality

---

## 📞 Key Contacts & Resources

- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io
- **Bull Queue Docs**: https://docs.bullmq.io
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Redis Docs**: https://redis.io/documentation

---

**Created**: January 26, 2026
**Project**: Core Loop API - Pilot Task
**Status**: Ready for Development ✅
