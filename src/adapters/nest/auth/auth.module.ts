import { Module } from '@nestjs/common';
import { I_PASSWORD_HASHER } from '../../../modules/auth/services/password-hasher/password-hasher.interface';
import { Argon2PasswordHasher } from '../../../modules/auth/services/password-hasher/argon2-password-hasher';
import { CreateAccount } from '../../../modules/auth/usecases/create-account/create-account';
import { I_ID_PROVIDER } from '../../../modules/system/id/id-provider';
import { I_AUTH_GATEWAY } from '../../../modules/auth/ports/auth.gateway';
import { InMemoryAuthGateway } from '../../../modules/auth/adapters/in-memory/in-memory-auth-gateway';
import { AuthController } from './auth.controller';
import { MailerModule } from '../mailer/mailer.module';
import { I_MAILER } from '../../../modules/mailer/ports/mailer.interface';
import { AuthGuard } from './auth.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
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
    inject: [I_AUTH_GATEWAY, I_PASSWORD_HASHER],
    useFactory: (authGateway, passwordHasher) => {
      return new Authenticator(authGateway, passwordHasher);
    },
  },
];

const gateways = [
  {
    provide: I_AUTH_GATEWAY,
    useFactory: () => {
      return new InMemoryAuthGateway();
    },
  },
];

const useCases = [
  {
    provide: CreateAccount,
    inject: [I_ID_PROVIDER, I_AUTH_GATEWAY, I_PASSWORD_HASHER, I_MAILER],
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
