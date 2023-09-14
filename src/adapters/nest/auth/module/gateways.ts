import { I_USER_REPOSITORY } from '../../../../modules/auth/ports/auth.gateway';
import { InMemoryUserRepository } from '../../../../modules/auth/adapters/in-memory-user-repository';

export const gateways = [
  {
    provide: I_USER_REPOSITORY,
    useFactory: () => {
      return new InMemoryUserRepository();
    },
  },
];
