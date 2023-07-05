import { Module } from '@nestjs/common';
import { LoopbackMailerService } from '../services/mailer/loopback-mailer-service';
import { I_MAILER_SERVICE } from '../services/mailer/mailer-service.interface';

const services = [
  {
    provide: I_MAILER_SERVICE,
    useFactory: () => {
      return new LoopbackMailerService();
    },
  },
];

@Module({
  providers: [...services],
  exports: [I_MAILER_SERVICE],
})
export class MailerModule {}
