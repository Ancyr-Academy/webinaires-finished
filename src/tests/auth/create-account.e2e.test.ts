import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../adapters/nest/app/app.module';
import {
  IAuthGateway,
  I_AUTH_GATEWAY,
} from '../../modules/auth/ports/auth.gateway';
describe('Feature: create account', () => {
  describe('Scenario: happy path', () => {
    it('should create an account', async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const result = await request(app.getHttpServer())
        .post('/auth/create-account')
        .send({
          emailAddress: 'johndoe@gmail.com',
          password: 'azerty',
        });

      expect(result.status).toEqual(201);

      const authRepository = app.get<IAuthGateway>(I_AUTH_GATEWAY);
      const userQuery = await authRepository.findByEmailAddress(
        'johndoe@gmail.com',
      );

      expect(userQuery.isNull()).toEqual(false);

      const user = userQuery.get();
      expect(user.data.emailAddress).toEqual('johndoe@gmail.com');

      await app.close();
    });
  });
});
