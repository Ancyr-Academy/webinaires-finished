import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MailerModule } from '../mailer/mailer.module';
import { WebinaireController } from './webinaire.controller';
import { gateways } from './gateways';
import { useCases } from './use-cases';
import { MongoWebinaire } from './models/mongo-webinaire';
import { MongoParticipation } from './models/mongo-participation';

@Module({
  imports: [
    MailerModule,
    MongooseModule.forFeature([
      {
        name: MongoWebinaire.CollectionName,
        schema: MongoWebinaire.Schema,
      },
      {
        name: MongoParticipation.CollectionName,
        schema: MongoParticipation.Schema,
      },
    ]),
  ],
  controllers: [WebinaireController],
  providers: [...gateways, ...useCases],
  exports: [],
})
export class WebinaireModule {}
