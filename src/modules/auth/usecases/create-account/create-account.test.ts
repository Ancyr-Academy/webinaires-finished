import { LoopbackMailerService } from '../../../mailer/services/mailer/loopback-mailer-service';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { UserFactory } from '../../entity/user.factory';
import { InMemoryAuthGateway } from '../../gateway-infra/in-memory-auth-gateway';
import { PassthroughPasswordHasher } from '../../services/password-hasher/passthrough-password-hasher';
import { CreateAccount } from './create-account';

describe('Create account', () => {
  let authGateway: InMemoryAuthGateway;
  let passwordHasher: PassthroughPasswordHasher;
  let mailerService: LoopbackMailerService;
  let useCase: CreateAccount;

  beforeEach(() => {
    authGateway = new InMemoryAuthGateway();
    passwordHasher = new PassthroughPasswordHasher();
    mailerService = new LoopbackMailerService();

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
});
