import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TestApp } from '../../../../tests/setup/test-app';
import { MongoUser } from '../models/mongo-user';
import { MongoUserRepository } from './mongo.user-repository';
import { UserEntity } from '../../../../modules/auth/core/user.entity';

describe('MongoUserRepository', () => {
  async function createUserInDatabase(user: UserEntity) {
    const record = new model({
      _id: user.data.id,
      emailAddress: user.data.emailAddress,
      password: user.data.password,
    });

    await record.save();
  }

  function expectEqualUsers(first: UserEntity, second: UserEntity) {
    expect(first.data).toEqual({
      id: second.data.id,
      emailAddress: second.data.emailAddress,
      password: second.data.password,
    });
  }

  let app: TestApp;
  let model: Model<MongoUser.SchemaClass>;
  let repository: MongoUserRepository;

  const alice = new UserEntity({
    id: 'alice',
    emailAddress: 'alice@gmail.com',
    password: 'azerty',
  });

  const bob = new UserEntity({
    id: 'bob',
    emailAddress: 'bob@gmail.com',
    password: 'azerty',
  });

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    model = app.get<Model<MongoUser.SchemaClass>>(
      getModelToken(MongoUser.CollectionName),
    );

    repository = new MongoUserRepository(model);
  });

  afterEach(async () => {
    await app.teardown();
  });

  describe('createUser', () => {
    it('should create the user', async () => {
      await repository.create(alice);

      const createdUser = await model.findById(alice.data.id);
      expect(createdUser).not.toBeNull();
      expect(createdUser!.toObject()).toEqual({
        _id: alice.data.id,
        __v: 0,
        emailAddress: alice.data.emailAddress,
        password: alice.data.password,
      });
    });
  });

  describe('findById', () => {
    beforeEach(async () => {
      await createUserInDatabase(alice);
    });

    it('should find the user when it exists', async () => {
      const userQuery = await repository.findById(alice.data.id);
      expect(userQuery.isNull()).toBe(false);

      const user = userQuery.get();
      expectEqualUsers(user, alice);
    });

    it('should not find the user when it does not exists', async () => {
      const userQuery = await repository.findById('random-id');
      expect(userQuery.isNull()).toBe(true);
    });
  });

  describe('isEmailAddressAvailable', () => {
    beforeEach(async () => {
      await createUserInDatabase(alice);
    });

    it('should return true when the e-mail address is available', async () => {
      const result = await repository.isEmailAddressAvailable(
        'available@gmail.com',
      );

      expect(result).toBe(true);
    });

    it('should return false when the e-mail address is unavailable', async () => {
      const result = await repository.isEmailAddressAvailable(
        alice.data.emailAddress,
      );

      expect(result).toBe(false);
    });
  });

  describe('findByEmailAddress', () => {
    beforeEach(async () => {
      await createUserInDatabase(alice);
    });

    it('should find the user when it exists', async () => {
      const userQuery = await repository.findByEmailAddress(
        alice.data.emailAddress,
      );
      expect(userQuery.isNull()).toBe(false);

      const user = userQuery.get();
      expectEqualUsers(user, alice);
    });

    it('should not find the user when it does not exists', async () => {
      const userQuery = await repository.findByEmailAddress('random-content');
      expect(userQuery.isNull()).toBe(true);
    });
  });

  describe('findByIds', () => {
    beforeEach(async () => {
      await createUserInDatabase(alice);
      await createUserInDatabase(bob);
    });

    it('should find all the users matching the id', async () => {
      const users = await repository.findByIds([alice.data.id, bob.data.id]);
      expect(users).toHaveLength(2);

      expectEqualUsers(users[0], alice);
      expectEqualUsers(users[1], bob);
    });
  });
});
