import { LoopbackMailer } from '../../../mailer/adapters/loopback-mailer';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { UserFactory } from '../../entity/user.factory';
import { InMemoryAuthGateway } from '../../adapters/in-memory/in-memory-auth-gateway';
import { PrefixPasswordHasher } from '../../services/password-hasher/passthrough-password-hasher';
import { CreateAccount } from './create-account';

describe('Feature: Creating an account', () => {
  let authGateway: InMemoryAuthGateway;
  let passwordHasher: PrefixPasswordHasher;
  let mailerService: LoopbackMailer;
  let useCase: CreateAccount;

  const alice = UserFactory.create({
    id: 'user-1',
    emailAddress: 'alice@gmail.com',
    password: 'azerty',
  });

  beforeEach(async () => {
    authGateway = new InMemoryAuthGateway();
    passwordHasher = new PrefixPasswordHasher();
    mailerService = new LoopbackMailer();

    await authGateway.createUser(alice);

    useCase = new CreateAccount(
      new FixedIdProvider(),
      authGateway,
      passwordHasher,
      mailerService,
    );
  });

  describe('Scenario: happy path', () => {
    const payload = {
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    };

    it('should return the ID of the user', async () => {
      const result = await useCase.execute(payload);

      expect(result).toEqual({
        id: 'stub-id',
      });
    });

    it('should save the user', async () => {
      const result = await useCase.execute(payload);

      const createdUserOption = await authGateway.getUserById(result.id);
      const createdUser = createdUserOption.getOrThrow();

      expect(createdUser.data).toEqual({
        id: 'stub-id',
        emailAddress: 'johndoe@gmail.com',
        password: 'hashed_azerty',
      });
    });

    it('should send a confirmation e-mail', async () => {
      await useCase.execute(payload);
      const sentEmails = mailerService.getSentEmails();

      expect(sentEmails).toEqual([
        {
          to: 'johndoe@gmail.com',
          subject: 'Bienvenue à Webinaires !',
          body: 'Votre compte a bien été créé.',
        },
      ]);
    });
  });

  describe('Scenario: the e-mail is already taken', () => {
    it('should fail to create the user', async () => {
      expect(async () => {
        await useCase.execute({
          emailAddress: 'alice@gmail.com',
          password: 'azerty',
        });
      }).rejects.toThrowError('Email address is not available');
    });
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
