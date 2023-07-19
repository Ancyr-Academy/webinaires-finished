import { Module } from '@nestjs/common';
import { LoopbackMailer } from '../gateway-infra/loopback-mailer';
import { I_MAILER_SERVICE } from '../gateway/mailer.interface';

const services = [
  {
    provide: I_MAILER_SERVICE,
    useFactory: () => {
      return new LoopbackMailer();
    },
  },
];

@Module({
  providers: [...services],
  exports: [I_MAILER_SERVICE],
})
export class MailerModule {}
