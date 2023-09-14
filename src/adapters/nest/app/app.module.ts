import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from '../system/system.module';
import { AuthModule } from '../auth/module/auth.module';
import { CatchAllFilter } from './catch-all.filter';
import { WebinaireModule } from '../webinaires/webinaire.module';

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
