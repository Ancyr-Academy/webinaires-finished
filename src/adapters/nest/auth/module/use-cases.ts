import { I_PASSWORD_HASHER } from '../../../../modules/auth/services/password-hasher/password-hasher.interface';
import { CreateAccount } from '../../../../modules/auth/usecases/create-account/create-account';
import { I_ID_PROVIDER } from '../../../../modules/system/id/id-provider';
import { I_USER_REPOSITORY } from '../../../../modules/auth/ports/user-repository';
import { I_MAILER } from '../../../../modules/mailer/ports/mailer.interface';

export const useCases = [
  {
    provide: CreateAccount,
    inject: [I_ID_PROVIDER, I_USER_REPOSITORY, I_PASSWORD_HASHER, I_MAILER],
    useFactory: (idProvider, authGateway, passwordHasher, mailerService) => {
      return new CreateAccount(
        idProvider,
        authGateway,
        passwordHasher,
        mailerService,
      );
    },
  },
];
