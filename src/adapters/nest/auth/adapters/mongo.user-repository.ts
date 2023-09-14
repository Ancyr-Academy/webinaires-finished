import { UserEntity } from '../../../../modules/auth/core/user.entity';
import { IUserRepository } from '../../../../modules/auth/ports/user-repository';
import { Optional } from '../../../../modules/shared/optional';

export class MongoUserRepository implements IUserRepository {
  createUser(user: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Optional<UserEntity>> {
    throw new Error('Method not implemented.');
  }
  isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByEmailAddress(emailAddress: string): Promise<Optional<UserEntity>> {
    throw new Error('Method not implemented.');
  }
  findByIds(ids: string[]): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
}
