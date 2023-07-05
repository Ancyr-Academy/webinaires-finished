import { EntityType } from '../../shared/entity';
import { UserEntity } from './user.entity';

export class UserFactory {
  static create(data?: Partial<EntityType<UserEntity>>): UserEntity {
    return new UserEntity({
      id: 'id',
      emailAddress: 'emailAddress',
      password: 'password',
      ...data,
    });
  }
}
