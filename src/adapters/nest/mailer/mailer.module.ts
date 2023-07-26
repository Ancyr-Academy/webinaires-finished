import { Module } from '@nestjs/common';
import { LoopbackMailer } from '../../../modules/mailer/adapters/loopback-mailer';
import { I_MAILER } from '../../../modules/mailer/ports/mailer.interface';

const services = [
  {
    provide: I_MAILER,
    useFactory: () => {
      return new LoopbackMailer();
    },
  },
];

@Module({
  providers: [...services],
  exports: [I_MAILER],
})
export class MailerModule {}
