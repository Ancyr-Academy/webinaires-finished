import { Global, Module } from '@nestjs/common';
import { I_DATE_PROVIDER } from '../../../modules/system/date/date-provider';
import { CurrentDateProvider } from '../../../modules/system/date/current-date-provider';
import { I_ID_PROVIDER } from '../../../modules/system/id/id-provider';
import { NanoidProvider } from '../../../modules/system/id/nanoid-provider';

@Global()
@Module({
  providers: [
    {
      provide: I_DATE_PROVIDER,
      useFactory: () => {
        return new CurrentDateProvider();
      },
    },
    {
      provide: I_ID_PROVIDER,
      useFactory: () => {
        return new NanoidProvider();
      },
    },
  ],
  exports: [I_DATE_PROVIDER, I_ID_PROVIDER],
})
export class SystemModule {}
