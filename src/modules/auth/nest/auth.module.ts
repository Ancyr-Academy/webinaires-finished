import { Module } from '@nestjs/common';
import { I_PASSWORD_HASHER } from '../services/password-hasher/password-hasher.interface';
import { Argon2PasswordHasher } from '../services/password-hasher/argon2-password-hasher';
import { CreateAccount } from '../usecases/create-account/create-account';
import { I_ID_PROVIDER } from '../../system/id/id-provider';
import { I_AUTH_GATEWAY } from '../gateway/auth.gateway';
import { InMemoryAuthGateway } from '../gateway-infra/in-memory-auth-gateway';
import { AuthController } from './auth.controller';
import { MailerModule } from '../../mailer/nest/mailer.module';
import { I_MAILER_SERVICE } from '../../mailer/services/mailer/mailer-service.interface';

const services = [
  {
    provide: I_PASSWORD_HASHER,
    useFactory: () => {
      return new Argon2PasswordHasher();
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
    inject: [
      I_ID_PROVIDER,
      I_AUTH_GATEWAY,
      I_PASSWORD_HASHER,
      I_MAILER_SERVICE,
    ],
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
  providers: [...services, ...gateways, ...useCases],
  exports: [],
})
export class AuthModule {}
