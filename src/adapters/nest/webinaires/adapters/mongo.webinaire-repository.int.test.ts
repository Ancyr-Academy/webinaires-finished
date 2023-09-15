import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TestApp } from '../../../../tests/setup/test-app';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { MongoWebinaireRepository } from './mongo.webinaire-repository';
import { WebinaireEntity } from '../../../../modules/webinaires/write/model/webinaire.entity';
import { UserFactory } from '../../../../modules/auth/core/user.factory';
import { MongoUserRepository } from '../../auth/adapters/mongo.user-repository';
import { MongoUser } from '../../auth/models/mongo-user';

describe('MongoWebinaireRepository', () => {
  async function createWebinaireInDatabase(webinaire: WebinaireEntity) {
    const record = new model({
      _id: webinaire.data.id,
      organizerId: webinaire.data.organizerId,
      seats: webinaire.data.seats,
      startAt: webinaire.data.startAt,
      endAt: webinaire.data.endAt,
    });

    await record.save();
  }

  function expectEqualWebinaires(
    first: WebinaireEntity,
    second: WebinaireEntity,
  ) {
    expect(first.data).toEqual({
      id: second.data.id,
      organizerId: second.data.organizerId,
      seats: second.data.seats,
      startAt: second.data.startAt,
      endAt: second.data.endAt,
    });
  }

  let app: TestApp;
  let model: Model<MongoWebinaire.SchemaClass>;
  let repository: MongoWebinaireRepository;

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

    model = app.get<Model<MongoWebinaire.SchemaClass>>(
      getModelToken(MongoWebinaire.CollectionName),
    );

    repository = new MongoWebinaireRepository(model);
  });

  describe('findById', () => {
    beforeEach(async () => {
      await createWebinaireInDatabase(webinaire);
    });

    it('should find the webinaire when it exists', async () => {
      const query = await repository.findById(webinaire.data.id);
      expect(query.isNull()).toBe(false);

      const entity = query.get();
      expectEqualWebinaires(entity, webinaire);
    });

    it('should not find the webinaire when it does not exists', async () => {
      const query = await repository.findById('random-id');
      expect(query.isNull()).toBe(true);
    });
  });

  describe('create', () => {
    it('should create the webinaire', async () => {
      await repository.create(webinaire);

      const createdModel = await model.findById(webinaire.data.id);
      expect(createdModel).not.toBeNull();
      expect(createdModel!.toObject()).toEqual({
        _id: webinaire.data.id,
        __v: 0,
        organizerId: webinaire.data.organizerId,
        seats: webinaire.data.seats,
        startAt: webinaire.data.startAt,
        endAt: webinaire.data.endAt,
      });
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await repository.create(webinaire);
    });

    it('should update the webinaire', async () => {
      const clone = webinaire.clone() as WebinaireEntity;
      clone.setState({
        organizerId: bob.data.id,
        seats: 20,
        startAt: new Date('2023-01-01T09:00:00.000Z'),
        endAt: new Date('2023-01-01T11:00:00.000Z'),
      });

      await repository.update(clone);

      const createdModel = await model.findById(webinaire.data.id);
      expect(createdModel).not.toBeNull();
      expect(createdModel!.toObject()).toEqual({
        _id: webinaire.data.id,
        __v: 0,
        organizerId: bob.data.id,
        seats: 20,
        startAt: new Date('2023-01-01T09:00:00.000Z'),
        endAt: new Date('2023-01-01T11:00:00.000Z'),
      });
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await repository.create(webinaire);
    });

    it('should delete the webinaire', async () => {
      await repository.delete(webinaire);

      const createdModel = await model.findById(webinaire.data.id);
      expect(createdModel).toBeNull();
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
