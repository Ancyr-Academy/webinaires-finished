import { Optional } from '../../shared/optional';
import { UserEntity } from '../entity/user.entity';

export interface IAuthGateway {
  createUser(user: UserEntity): Promise<void>;
  getUserById(id: string): Promise<Optional<UserEntity>>;
}
