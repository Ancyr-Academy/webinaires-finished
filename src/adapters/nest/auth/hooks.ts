import { APP_GUARD, Reflector } from '@nestjs/core';
import { I_AUTHENTICATOR } from '../../../modules/auth/services/authenticator/authenticator.interface';
import { AuthGuard } from './auth.guard';

export const hooks = [
  {
    provide: APP_GUARD,
    inject: [Reflector, I_AUTHENTICATOR],
    useFactory: (reflector, authenticator) => {
      return new AuthGuard(reflector, authenticator);
    },
  },
];
