import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from '../../../../tests/setup/test-app';
import { UserFactory } from '../../../../modules/auth/core/user.factory';
import { MongoUserRepository } from '../../auth/adapters/mongo.user-repository';
import { MongoUser } from '../../auth/models/mongo-user';
import { MongoParticipationRepository } from './mongo.participation-repository';
import { MongoParticipation } from '../models/mongo-participation';
import { MongoWebinaireRepository } from './mongo.webinaire-repository';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { ParticipationEntity } from '../../../../modules/webinaires/write/model/participation.entity';
import { WebinaireFactory } from '../../../../modules/webinaires/write/model/webinaire.factory';

describe('MongoWebinaireRepository', () => {
  async function createParticipationInDatabase(
    participation: ParticipationEntity,
  ) {
    const record = new model({
      _id: participation.data.id,
      webinaireId: participation.data.webinaireId,
      userId: participation.data.userId,
    });

    await record.save();
  }

  function expectEqualParticipations(
    first: ParticipationEntity,
    second: ParticipationEntity,
  ) {
    expect(first.data).toEqual({
      id: second.data.id,
      webinaireId: second.data.webinaireId,
      userId: second.data.userId,
    });
  }

  let app: TestApp;
  let model: Model<MongoParticipation.SchemaClass>;
  let repository: MongoParticipationRepository;

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const charles = UserFactory.create({
    id: 'charles',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire',
    organizerId: alice.data.id,
  });

  const bobParticipation = new ParticipationEntity({
    id: 'bob-participation',
    webinaireId: webinaire.data.id,
    userId: bob.data.id,
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
    await userRepository.create(charles);

    const webinaireModel = app.get<Model<MongoWebinaire.SchemaClass>>(
      getModelToken(MongoWebinaire.CollectionName),
    );

    const webinaireRepository = new MongoWebinaireRepository(webinaireModel);
    await webinaireRepository.create(webinaire);

    model = app.get<Model<MongoParticipation.SchemaClass>>(
      getModelToken(MongoParticipation.CollectionName),
    );

    repository = new MongoParticipationRepository(model);
  });

  describe('find', () => {
    beforeEach(async () => {
      await createParticipationInDatabase(bobParticipation);
    });

    it('should find the webinaire when it exists', async () => {
      const query = await repository.find(webinaire.data.id, bob.data.id);
      expect(query.isNull()).toBe(false);

      const entity = query.get();
      expectEqualParticipations(entity, bobParticipation);
    });

    it('should not find the webinaire when it does not exists', async () => {
      const query = await repository.find(webinaire.data.id, 'random-id');
      expect(query.isNull()).toBe(true);
    });
  });

  describe('findParticipationCount', () => {
    it('should return 0 when there is 0 participant', async () => {
      const result = await repository.findParticipationCount(webinaire.data.id);
      expect(result).toBe(0);
    });

    it('should return 1 when there is 1 participant', async () => {
      await createParticipationInDatabase(bobParticipation);

      const result = await repository.findParticipationCount(webinaire.data.id);
      expect(result).toBe(1);
    });
  });

  describe('findAllParticipations', () => {
    it('should return an empty list when there is no participant', async () => {
      const result = await repository.findAllParticipations(webinaire.data.id);
      expect(result.length).toBe(0);
    });

    it('should the participant when there is only one', async () => {
      await createParticipationInDatabase(bobParticipation);

      const result = await repository.findAllParticipations(webinaire.data.id);
      expect(result.length).toBe(1);

      expectEqualParticipations(result[0], bobParticipation);
    });
  });
  describe('create', () => {
    it('should create the participation', async () => {
      await repository.create(bobParticipation);

      const query = await repository.find(
        bobParticipation.data.webinaireId,
        bobParticipation.data.userId,
      );

      expect(query.isNull()).toBe(false);

      const entity = query.get();
      expectEqualParticipations(entity, bobParticipation);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await createParticipationInDatabase(bobParticipation);
    });

    it('should delete the participation', async () => {
      await repository.delete(bobParticipation);

      const query = await repository.find(
        bobParticipation.data.webinaireId,
        bobParticipation.data.userId,
      );

      expect(query.isNull()).toBe(true);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
