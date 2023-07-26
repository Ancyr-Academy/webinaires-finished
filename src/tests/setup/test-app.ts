import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../adapters/nest/app/app.module';
import { Nullable } from '../../modules/shared/types';

export class TestApp {
  private app: Nullable<INestApplication> = null;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();
  }

  request() {
    return request(this.app!.getHttpServer());
  }

  get<T>(token: string | symbol) {
    return this.app!.get<T>(token);
  }

  async teardown() {
    if (this.app) {
      await this.app.close();
      this.app = null;
    }
  }
}
