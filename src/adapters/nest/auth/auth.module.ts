import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { I_USER_REPOSITORY } from '../../../modules/auth/ports/user-repository';
import { AuthController } from './controllers/auth.controller';
import { MailerModule } from '../mailer/mailer.module';
import { services } from './module/services';
import { gateways } from './module/gateways';
import { useCases } from './module/use-cases';
import { hooks } from './module/hooks';
import { MongoUser } from './models/mongo-user';

@Global()
@Module({
  imports: [
    MailerModule,
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: MongoUser.SchemaClass.name,
        schema: MongoUser.Schema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [...hooks, ...services, ...gateways, ...useCases],
  exports: [I_USER_REPOSITORY],
})
export class AuthModule {}
