import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { UserFactory } from '../../entity/user.factory';
import { InMemoryAuthGateway } from '../../gateway-infra/in-memory-auth-gateway';
import { PassthroughPasswordHasher } from '../../services/password-hasher/passthrough-password-hasher';
import { CreateAccount } from './create-account';

describe('Create account', () => {
  let authGateway: InMemoryAuthGateway;
  let passwordHasher: PassthroughPasswordHasher;
  let useCase: CreateAccount;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    passwordHasher = new PassthroughPasswordHasher();
    useCase = new CreateAccount(
      new FixedIdProvider(),
      authGateway,
      passwordHasher,
    );
  });

  test('should return the id of the new created user', async () => {
    const result = await useCase.execute({
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });

    expect(result).toEqual({
      id: 'stub-id',
    });
  });

  test('should save the user', async () => {
    const result = await useCase.execute({
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });

    const createdUserOption = await authGateway.getUserById(result.id);
    const createdUser = createdUserOption.getOrThrow();

    expect(createdUser.data).toEqual({
      id: 'stub-id',
      emailAddress: 'johndoe@gmail.com',
      password: 'hashed:azerty',
    });
  });

  test('should fail because the e-mail address is already taken', async () => {
    await authGateway.createUser(
      UserFactory.create({
        id: 'user-1',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );

    expect(async () => {
      await useCase.execute({
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty',
      });
    }).rejects.toThrowError('Email address is not available');
  });
});
