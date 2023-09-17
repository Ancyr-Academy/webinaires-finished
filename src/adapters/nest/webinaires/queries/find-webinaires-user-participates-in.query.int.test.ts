import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from '../../../../tests/setup/test-app';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { UserFactory } from '../../../../modules/auth/core/user.factory';
import { MongoUserRepository } from '../../auth/adapters/mongo.user-repository';
import { MongoUser } from '../../auth/models/mongo-user';
import { WebinaireReadModel } from '../../../../modules/webinaires/read/model/webinaire.read-model';
import { MongoWebinaireRepository } from '../adapters/mongo.webinaire-repository';
import { MongoParticipation } from '../models/mongo-participation';
import { MongoParticipationRepository } from '../adapters/mongo.participation-repository';
import { WebinaireFactory } from '../../../../modules/webinaires/write/model/webinaire.factory';
import { ParticipationFactory } from '../../../../modules/webinaires/write/model/participation.factory';
import { FindWebinairesUserParticipatesInQuery } from './find-webinaires-user-participates-in.query';

describe('FindWebinairesUserParticipatesInQuery', () => {
  function expectEqualWebinaires(
    first: WebinaireReadModel,
    second: WebinaireReadModel,
  ) {
    expect(first).toEqual(second);
  }

  let app: TestApp;
  let query: FindWebinairesUserParticipatesInQuery;

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire',
    organizerId: alice.data.id,
    seats: 10,
    startAt: new Date('2023-01-01T08:00:00.000Z'),
    endAt: new Date('2023-01-01T10:00:00.000Z'),
  });

  const bobParticipation = ParticipationFactory.create({
    id: 'bob-participation',
    userId: bob.data.id,
    webinaireId: webinaire.data.id,
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

    const participationRepository = new MongoParticipationRepository(
      participationModel,
    );

    await participationRepository.create(bobParticipation);

    query = new FindWebinairesUserParticipatesInQuery(
      userModel,
      webinaireModel,
      participationModel,
    );
  });

  describe('the user does not participate in any webinaire', () => {
    const userId = alice.data.id;

    it('should return an empty array', async () => {
      const result = await query.execute(userId);
      expect(result.length).toBe(0);
    });
  });

  describe('the user participates in one webinaire', () => {
    const userId = bob.data.id;

    it('should return the webinaire the user participates in', async () => {
      const expected = new WebinaireReadModel({
        id: webinaire.data.id,
        organizer: {
          id: alice.data.id,
          emailAddress: alice.data.emailAddress,
        },
        seats: {
          available: webinaire.data.seats - 1,
          total: webinaire.data.seats,
        },
        startAt: webinaire.data.startAt,
        endAt: webinaire.data.endAt,
      });

      const result = await query.execute(userId);
      expect(result.length).toBe(1);
      expectEqualWebinaires(result[0], expected);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
