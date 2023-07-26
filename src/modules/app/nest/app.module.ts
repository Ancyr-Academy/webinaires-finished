import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from '../../system/nest/system.module';
import { AuthModule } from '../../auth/nest/auth.module';
import { CatchAllFilter } from './catch-all.filter';
import { WebinaireModule } from '../../../nest/webinaires/webinaire.module';

@Module({
  imports: [SystemModule, AuthModule, WebinaireModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
  ],
})
export class AppModule {}
