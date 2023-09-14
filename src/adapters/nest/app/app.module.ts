import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from '../system/system.module';
import { AuthModule } from '../auth/auth.module';
import { CatchAllFilter } from './catch-all.filter';
import { WebinaireModule } from '../webinaires/webinaire.module';

@Module({
  imports: [
    SystemModule,
    AuthModule,
    WebinaireModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
  ],
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
