import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `{"data":{"serviceName":"nestjs-modular-monolith","version":"v1"}`;
  }
}
