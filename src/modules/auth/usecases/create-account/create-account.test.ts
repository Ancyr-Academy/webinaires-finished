import { LoopbackMailer } from '../../../mailer/adapters/loopback-mailer';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { UserFactory } from '../../entity/user.factory';
import { InMemoryAuthGateway } from '../../adapters/in-memory/in-memory-auth-gateway';
import { PrefixPasswordHasher } from '../../services/password-hasher/prefix-password-hasher';
import { CreateAccount } from './create-account';

describe('Feature: Creating an account', () => {
  let authGateway: InMemoryAuthGateway;
  let passwordHasher: PrefixPasswordHasher;
  let mailerService: LoopbackMailer;
  let useCase: CreateAccount;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    passwordHasher = new PrefixPasswordHasher();
    mailerService = new LoopbackMailer();

    useCase = new CreateAccount(
      new FixedIdProvider(),
      authGateway,
      passwordHasher,
      mailerService,
    );
  });

  test('save the user', async () => {
    const result = await useCase.execute({
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });

    const createdUserOption = await authGateway.getUserById(result.id);
    const createdUser = createdUserOption.getOrThrow();

    expect(result).toEqual({
      id: 'stub-id',
    });

    expect(createdUser.data).toEqual({
      id: 'stub-id',
      emailAddress: 'johndoe@gmail.com',
      password: 'hashed_azerty',
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

  test('sending a confirmation e-mail', async () => {
    await useCase.execute({
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });

    const sentEmails = mailerService.getSentEmails();

    expect(sentEmails).toEqual([
      {
        to: 'johndoe@gmail.com',
        subject: 'Bienvenue à Webinaires !',
        body: 'Votre compte a bien été créé.',
      },
    ]);
  });

  describe('Validations', () => {
    it.each([
      {
        emailAddress: 'johndoe',
        password: 'azerty',
      },
      {
        emailAddress: 'johndoe@gmail.com',
        password: '',
      },
    ])(`should fail because the request is invalid`, async (request) => {
      expect(async () => {
        await useCase.execute(request);
      }).rejects.toThrowError('Validation errors');
    });
  });
});
