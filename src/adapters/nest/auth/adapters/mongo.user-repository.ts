import { Model } from 'mongoose';
import { UserEntity } from '../../../../modules/auth/core/user.entity';
import { IUserRepository } from '../../../../modules/auth/ports/user-repository';
import { Optional } from '../../../../modules/shared/optional';
import { MongoUser } from '../models/mongo-user';
import { MongoUserMapper } from '../models/mongo-user.mapper';

export class MongoUserRepository implements IUserRepository {
  private mapper = new MongoUserMapper();

  constructor(private readonly model: Model<MongoUser.SchemaClass>) {}

  async create(user: UserEntity): Promise<void> {
    const document = this.mapper.toPersistence(user);
    const model = new this.model(document);
    await model.save();
  }

  async findById(id: string): Promise<Optional<UserEntity>> {
    const model = await this.model.findById(id);
    return model ? Optional.of(this.mapper.toDomain(model)) : Optional.empty();
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const user = await this.model.findOne({
      emailAddress,
    });

    return user === null;
  }

  async findByEmailAddress(
    emailAddress: string,
  ): Promise<Optional<UserEntity>> {
    const user = await this.model.findOne({
      emailAddress,
    });

    return user ? Optional.of(this.mapper.toDomain(user)) : Optional.empty();
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    const users = await this.model.find({
      _id: {
        $in: ids,
      },
    });

    return users.map((user) => this.mapper.toDomain(user));
  }
}
