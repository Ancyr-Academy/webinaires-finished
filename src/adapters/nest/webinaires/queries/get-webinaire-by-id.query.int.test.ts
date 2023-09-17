import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from '../../../../tests/setup/test-app';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { WebinaireEntity } from '../../../../modules/webinaires/write/model/webinaire.entity';
import { UserFactory } from '../../../../modules/auth/core/user.factory';
import { MongoUserRepository } from '../../auth/adapters/mongo.user-repository';
import { MongoUser } from '../../auth/models/mongo-user';
import { GetWebinaireByIdQuery } from './get-webinaire-by-id.query';
import { WebinaireReadModel } from '../../../../modules/webinaires/read/model/webinaire.read-model';
import { MongoWebinaireRepository } from '../adapters/mongo.webinaire-repository';
import { MongoParticipation } from '../models/mongo-participation';

describe('GetWebinaireByIdQuery', () => {
  function expectEqualWebinaires(
    first: WebinaireReadModel,
    second: WebinaireReadModel,
  ) {
    expect(first).toEqual(second);
  }

  let app: TestApp;
  let query: GetWebinaireByIdQuery;

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = new WebinaireEntity({
    id: 'webinaire',
    organizerId: alice.data.id,
    seats: 10,
    startAt: new Date('2023-01-01T08:00:00.000Z'),
    endAt: new Date('2023-01-01T10:00:00.000Z'),
  });

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    const userModel = app.get<Model<MongoUser.SchemaClass>>(
      getModelToken(MongoUser.CollectionName),
    );

    const userRepository = new MongoUserRepository(userModel);
    await userRepository.create(alice);
    await userRepository.create(bob);

    const webinaireModel = app.get<Model<MongoWebinaire.SchemaClass>>(
      getModelToken(MongoWebinaire.CollectionName),
    );

    const webinaireRepository = new MongoWebinaireRepository(webinaireModel);
    await webinaireRepository.create(webinaire);

    const participationModel = app.get<Model<MongoParticipation.SchemaClass>>(
      getModelToken(MongoParticipation.CollectionName),
    );

    query = new GetWebinaireByIdQuery(
      userModel,
      webinaireModel,
      participationModel,
    );
  });

  describe('the webinaire exists', () => {
    it('should return the webinaire read model', async () => {
      const expected = new WebinaireReadModel({
        id: webinaire.data.id,
        organizer: {
          id: alice.data.id,
          emailAddress: alice.data.emailAddress,
        },
        seats: {
          available: webinaire.data.seats,
          total: webinaire.data.seats,
        },
        startAt: webinaire.data.startAt,
        endAt: webinaire.data.endAt,
      });

      const result = await query.execute(webinaire.data.id);

      expectEqualWebinaires(result, expected);
    });
  });

  describe('the webinaire does not exist', () => {
    it('should throw an error', async () => {
      await expect(() => query.execute('some-test')).rejects.toThrowError(
        'Webinaire not found',
      );
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
