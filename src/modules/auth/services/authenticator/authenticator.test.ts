import { UserFactory } from '../../entity/user.factory';
import { InMemoryUserRepository } from '../../adapters/in-memory/in-memory-user-repository';
import { PrefixPasswordHasher } from '../password-hasher/passthrough-password-hasher';
import { Authenticator } from './authenticator';

describe('Authenticating', () => {
  let authGateway: InMemoryUserRepository;
  let passwordHasher: PrefixPasswordHasher;
  let authenticator: Authenticator;

  const storedUser = UserFactory.create({
    id: 'user-1',
    emailAddress: 'johndoe@gmail.com',
    password: 'hashed_azerty',
  });

  beforeEach(() => {
    authGateway = new InMemoryUserRepository();
    passwordHasher = new PrefixPasswordHasher();
    authenticator = new Authenticator(authGateway, passwordHasher);

    authGateway.createUser(storedUser);
  });
  describe('basic authentication', () => {
    test('authenticating an existing user with the correct password', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'azerty');
      const result = await authenticator.basicAuth(basicAuth);
      expect(result).toBe(storedUser);
    });

    test('authenticating an existing user with the wrong password', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'not a valid password');
      await expect(async () => {
        await authenticator.basicAuth(basicAuth);
      }).rejects.toThrow("Password doesn't match");
    });

    test('authenticating an user that does not exist', async () => {
      const basicAuth = toBase64(
        'random-user@gmail.com',
        'not a valid password',
      );

      await expect(async () => {
        await authenticator.basicAuth(basicAuth);
      }).rejects.toThrow("User doesn't exist");
    });
  });
});

const toBase64 = (emailAddress: string, password: string) =>
  Buffer.from(`${emailAddress}:${password}`).toString('base64');
