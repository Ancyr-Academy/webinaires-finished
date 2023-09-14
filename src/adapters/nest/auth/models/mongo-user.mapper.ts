import { UserEntity } from '../../../../modules/auth/core/user.entity';
import { AbstractMapper } from '../../../../modules/shared/mapper';
import { MongoUser } from './mongo-user';

export class MongoUserMapper extends AbstractMapper<
  UserEntity,
  MongoUser.SchemaClass
> {
  toDomain(packet: MongoUser.SchemaClass): UserEntity {
    return new UserEntity({
      id: packet._id,
      emailAddress: packet.emailAddress,
      password: packet.password,
    });
  }

  toPersistence(entity: UserEntity): MongoUser.SchemaClass {
    const { data } = entity;
    return {
      _id: data.id,
      emailAddress: data.emailAddress,
      password: data.password,
    };
  }
}
