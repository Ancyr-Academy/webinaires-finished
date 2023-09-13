import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';

import { I_PASSWORD_HASHER } from '../../../modules/auth/services/password-hasher/password-hasher.interface';
import { Argon2PasswordHasher } from '../../../modules/auth/services/password-hasher/argon2-password-hasher';
import { CreateAccount } from '../../../modules/auth/usecases/create-account/create-account';
import { I_ID_PROVIDER } from '../../../modules/system/id/id-provider';
import { I_USER_REPOSITORY } from '../../../modules/auth/ports/auth.gateway';
import { InMemoryUserRepository } from '../../../modules/auth/adapters/in-memory-user-repository';
import { AuthController } from './auth.controller';
import { MailerModule } from '../mailer/mailer.module';
import { I_MAILER } from '../../../modules/mailer/ports/mailer.interface';
import { AuthGuard } from './auth.guard';
import { I_AUTHENTICATOR } from '../../../modules/auth/services/authenticator/authenticator.interface';
import { Authenticator } from '../../../modules/auth/services/authenticator/authenticator';

const services = [
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

const gateways = [
  {
    provide: I_USER_REPOSITORY,
    useFactory: () => {
      return new InMemoryUserRepository();
    },
  },
];

const useCases = [
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

@Module({
  imports: [MailerModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      inject: [Reflector, I_AUTHENTICATOR],
      useFactory: (reflector, authenticator) => {
        return new AuthGuard(reflector, authenticator);
      },
    },
    ...services,
    ...gateways,
    ...useCases,
  ],
  exports: [],
})
export class AuthModule {}
