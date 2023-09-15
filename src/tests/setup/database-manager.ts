import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from './test-app';
import { MongoUser } from '../../adapters/nest/auth/models/mongo-user';
import { MongoWebinaire } from '../../adapters/nest/webinaires/models/mongo-webinaire';
import { MongoParticipation } from '../../adapters/nest/webinaires/models/mongo-participation';

export class DatabaseManager {
  async clear(app: TestApp) {
    await app
      .get<Model<MongoUser.SchemaClass>>(
        getModelToken(MongoUser.CollectionName),
      )
      .deleteMany({});

    await app
      .get<Model<MongoWebinaire.SchemaClass>>(
        getModelToken(MongoWebinaire.CollectionName),
      )
      .deleteMany({});

    await app
      .get<Model<MongoParticipation.SchemaClass>>(
        getModelToken(MongoParticipation.CollectionName),
      )
      .deleteMany({});
  }
}
