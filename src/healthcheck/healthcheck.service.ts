import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  getHealthcheck(): string {
    return 'OK';
  }
}
