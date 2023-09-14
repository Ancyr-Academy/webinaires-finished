import { Module } from '@nestjs/common';
import { AppModule } from './adapters/nest/app/app.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AppModule, ConfigModule.forRoot()],
})
export class MainModule {}
