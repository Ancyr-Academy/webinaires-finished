import { Optional } from '../../shared/optional';
import { UserEntity } from '../core/user.entity';
import { IUserRepository } from '../ports/auth.gateway';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private database: UserEntity[] = []) {}

  async createUser(user: UserEntity): Promise<void> {
    this.database.push(user);
  }

  async findById(id: string): Promise<Optional<UserEntity>> {
    const user = this.database.find((user) => user.data.id === id);
    return user ? Optional.of(user.clone()) : Optional.empty();
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    return !this.database.some(
      (user) => user.data.emailAddress === emailAddress,
    );
  }

  async findByEmailAddress(
    emailAddress: string,
  ): Promise<Optional<UserEntity>> {
    const user = this.database.find(
      (user) => user.data.emailAddress === emailAddress,
    );

    return user ? Optional.of(user.clone()) : Optional.empty();
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    return this.database
      .filter((user) => ids.includes(user.data.id))
      .map((user) => user.clone());
  }
}
