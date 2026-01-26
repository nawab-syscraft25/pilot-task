import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck() {
    return {
      status: 'ok',
      message: 'Core Loop API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
