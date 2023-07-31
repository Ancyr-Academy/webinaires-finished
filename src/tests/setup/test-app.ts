import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../adapters/nest/app/app.module';
import { Nullable } from '../../modules/shared/types';
import { CreateAccount } from '../../modules/auth/usecases/create-account/create-account';

export class TestApp {
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

  async registerUser(emailAddress: string, password: string) {
    const authGateway = this.app!.get<CreateAccount>(CreateAccount);
    const result = await authGateway.execute({
      emailAddress,
      password,
    });

    return result;
  }

  createAuthorizationToken(emailAddress: string, password: string) {
    return `Basic ${Buffer.from(`${emailAddress}:${password}`).toString(
      'base64',
    )}`;
  }
}
