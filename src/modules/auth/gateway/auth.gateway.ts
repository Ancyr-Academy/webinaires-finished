import { Optional } from '../../shared/optional';
import { UserEntity } from '../entity/user.entity';

export const I_AUTH_GATEWAY = Symbol('I_AUTH_GATEWAY');

export interface IAuthGateway {
  createUser(user: UserEntity): Promise<void>;
  getUserById(id: string): Promise<Optional<UserEntity>>;
  isEmailAddressAvailable(emailAddress: string): Promise<boolean>;
}
