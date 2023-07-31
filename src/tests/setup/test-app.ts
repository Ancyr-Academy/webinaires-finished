import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../adapters/nest/app/app.module';
import { Nullable } from '../../modules/shared/types';
import { ITestApp } from './test-app.interface';
import { IFixture } from './fixture';

export class TestApp implements ITestApp {
  private app: Nullable<INestApplication> = null;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();
  }

  async teardown() {
    if (this.app) {
      await this.app.close();
      this.app = null;
    }
  }

  request() {
    return request(this.app!.getHttpServer());
  }

  get<T>(token: string | symbol | any) {
    return this.app!.get<T>(token);
  }

  loadFixtures(fixtures: IFixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.save(this)));
  }
}
