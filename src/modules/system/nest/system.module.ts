import { Global, Module } from '@nestjs/common';
import { I_DATE_PROVIDER } from '../date/date-provider';
import { CurrentDateProvider } from '../date/current-date-provider';
import { I_ID_PROVIDER } from '../id/id-provider';
import { NanoidProvider } from '../id/nanoid-provider';

@Global()
@Module({
  providers: [
    {
      provide: I_DATE_PROVIDER,
      useFactory: () => {
        new CurrentDateProvider();
      },
    },
    {
      provide: I_ID_PROVIDER,
      useFactory: () => {
        new NanoidProvider();
      },
    },
  ],
})
export class SystemModule {}
