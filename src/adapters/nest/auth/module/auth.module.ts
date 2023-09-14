import { Global, Module } from '@nestjs/common';

import { I_USER_REPOSITORY } from '../../../../modules/auth/ports/auth.gateway';
import { AuthController } from '../controllers/auth.controller';
import { MailerModule } from '../../mailer/mailer.module';
import { services } from './services';
import { gateways } from './gateways';
import { useCases } from './use-cases';
import { hooks } from './hooks';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [MailerModule, ConfigModule],
  controllers: [AuthController],
  providers: [...hooks, ...services, ...gateways, ...useCases],
  exports: [I_USER_REPOSITORY],
})
export class AuthModule {}
