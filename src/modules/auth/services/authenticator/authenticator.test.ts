import { UserFactory } from '../../core/user.factory';
import { InMemoryUserRepository } from '../../adapters/in-memory-user-repository';
import { PrefixPasswordHasher } from '../password-hasher/prefix-password-hasher';
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

    authGateway.create(storedUser);
  });
  describe('basic authentication', () => {
    test('the user exists', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'azerty');
      const result = await authenticator.authenticate(basicAuth);

      expect(result).toEqual(storedUser);
    });

    test('the user exists but the password is wrong', async () => {
      const basicAuth = toBase64('johndoe@gmail.com', 'not a valid password');

      await expect(() => authenticator.authenticate(basicAuth)).rejects.toThrow(
        "Password doesn't match",
      );
    });

    test('the user does not exist', async () => {
      const basicAuth = toBase64(
        'random-user@gmail.com',
        'not a valid password',
      );

      await expect(() => authenticator.authenticate(basicAuth)).rejects.toThrow(
        "User doesn't exist",
      );
    });
  });
});

const toBase64 = (emailAddress: string, password: string) =>
  Buffer.from(`${emailAddress}:${password}`).toString('base64');
