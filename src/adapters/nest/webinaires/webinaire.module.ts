import { Module } from '@nestjs/common';

import { MailerModule } from '../mailer/mailer.module';
import { WebinaireController } from './webinaire.controller';
import { gateways } from './gateways';
import { useCases } from './use-cases';

@Module({
  imports: [MailerModule],
  controllers: [WebinaireController],
  providers: [...gateways, ...useCases],
  exports: [],
})
export class WebinaireModule {}
