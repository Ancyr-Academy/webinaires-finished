import { Module } from '@nestjs/common';
import { LoopbackMailer } from '../gateway-infra/loopback-mailer';
import { I_MAILER } from '../gateway/mailer.interface';

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
