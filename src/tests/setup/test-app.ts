import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../adapters/nest/app/app.module';
import { Nullable } from '../../modules/shared/types';
import { DatabaseManager } from './database-manager';
import { IFixture } from './fixture';
import { ITestApp } from './test-app.interface';

export class TestApp implements ITestApp {
  private app: Nullable<INestApplication> = null;
  private databaseManager = new DatabaseManager();

  async setup() {
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [
            () => ({
              DATABASE_URL:
                'mongodb://webinaires:azerty@localhost:3701/webinaires?authSource=admin&directConnection=true',
            }),
          ],
        }),
      ],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();
    await this.databaseManager.clear(this);
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
