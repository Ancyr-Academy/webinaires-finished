import { I_PASSWORD_HASHER } from '../../../modules/auth/services/password-hasher/password-hasher.interface';
import { Argon2PasswordHasher } from '../../../modules/auth/services/password-hasher/argon2-password-hasher';
import { I_USER_REPOSITORY } from '../../../modules/auth/ports/auth.gateway';
import { I_AUTHENTICATOR } from '../../../modules/auth/services/authenticator/authenticator.interface';
import { Authenticator } from '../../../modules/auth/services/authenticator/authenticator';

export const services = [
  {
    provide: I_PASSWORD_HASHER,
    useFactory: () => {
      return new Argon2PasswordHasher();
    },
  },
  {
    provide: I_AUTHENTICATOR,
    inject: [I_USER_REPOSITORY, I_PASSWORD_HASHER],
    useFactory: (authGateway, passwordHasher) => {
      return new Authenticator(authGateway, passwordHasher);
    },
  },
];
