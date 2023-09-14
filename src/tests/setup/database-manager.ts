import { Model } from 'mongoose';
import { TestApp } from './test-app';
import { getModelToken } from '@nestjs/mongoose';
import { MongoUser } from '../../adapters/nest/auth/models/mongo-user';

export class DatabaseManager {
  async clear(app: TestApp) {
    await app
      .get<Model<MongoUser.SchemaClass>>(
        getModelToken(MongoUser.SchemaClass.name),
      )
      .deleteMany({});
  }
}
