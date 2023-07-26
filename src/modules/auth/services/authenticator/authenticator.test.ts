import { UserFactory } from '../../entity/user.factory';
import { InMemoryAuthGateway } from '../../adapters/in-memory-auth-gateway';
import { PassthroughPasswordHasher } from '../password-hasher/passthrough-password-hasher';
import { Authenticator } from './authenticator';

const storedUser = UserFactory.create({
  id: 'user-1',
  emailAddress: 'johndoe@gmail.com',
  password: 'hashed_azerty',
});

describe('Authenticating', () => {
  let authGateway: InMemoryAuthGateway;
  let passwordHasher: PassthroughPasswordHasher;
  let authenticator: Authenticator;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    passwordHasher = new PassthroughPasswordHasher();
    authenticator = new Authenticator(authGateway, passwordHasher);

    authGateway.createUser(storedUser);
  });
  describe('basic authentication', () => {
    test('authenticating an existing user with the correct password', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'azerty');
      const result = await authenticator.fromBasicAuth(basicAuth);
      expect(result).toBe(storedUser);
    });

    test('authenticating an existing user with the wrong password', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'not a valid password');
      expect(async () => {
        await authenticator.fromBasicAuth(basicAuth);
      }).rejects.toThrow("Password doesn't match");
    });

    test('authenticating an user that does not exist', async () => {
      const basicAuth = toBase64(
        'random-user@gmail.com',
        'not a valid password',
      );
      expect(async () => {
        await authenticator.fromBasicAuth(basicAuth);
      }).rejects.toThrow("User doesn't exist");
    });
  });
});

const toBase64 = (emailAddress: string, password: string) =>
  Buffer.from(`${emailAddress}:${password}`).toString('base64');
