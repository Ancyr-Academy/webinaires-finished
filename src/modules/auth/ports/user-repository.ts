import { Optional } from '../../shared/optional';
import { UserEntity } from '../core/user.entity';

export const I_USER_REPOSITORY = Symbol('I_USER_REPOSITORY');

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findById(id: string): Promise<Optional<UserEntity>>;
  isEmailAddressAvailable(emailAddress: string): Promise<boolean>;
  findByEmailAddress(emailAddress: string): Promise<Optional<UserEntity>>;
  findByIds(ids: string[]): Promise<UserEntity[]>;
}
