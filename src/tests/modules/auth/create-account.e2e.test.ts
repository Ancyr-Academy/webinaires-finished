import {
  IUserRepository,
  I_USER_REPOSITORY,
} from '../../../modules/auth/ports/auth.gateway';
import { TestApp } from '../../setup/test-app';

describe('Feature: create account', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  describe('Scenario: happy path', () => {
    const user = {
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    };

    it('should create an account', async () => {
      const result = await app
        .request()
        .post('/auth/create-account')
        .send(user);

      expect(result.status).toEqual(201);

      const authRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
      const userQuery = await authRepository.findByEmailAddress(
        user.emailAddress,
      );

      expect(userQuery.isNull()).toEqual(false);

      const createdUser = userQuery.get();
      expect(createdUser.data.emailAddress).toEqual(user.emailAddress);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
