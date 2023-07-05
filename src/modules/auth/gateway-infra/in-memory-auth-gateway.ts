import { Optional } from '../../shared/optional';
import { UserEntity } from '../entity/user.entity';
import { IAuthGateway } from '../gateway/auth.gateway';

export class InMemoryAuthGateway implements IAuthGateway {
  private users = new Map<string, UserEntity>();

  async createUser(user: UserEntity): Promise<void> {
    this.users.set(user.id, user);
  }

  async getUserById(id: string): Promise<Optional<UserEntity>> {
    const user = this.users.get(id);
    return user ? Optional.of(user) : Optional.empty();
  }

  async isEmailAddressAvailable(emailAddress: string): Promise<boolean> {
    const users = Array.from(this.users.values());
    return !users.some((user) => user.data.emailAddress === emailAddress);
  }

  async findByEmailAddress(
    emailAddress: string,
  ): Promise<Optional<UserEntity>> {
    const users = Array.from(this.users.values());
    const user = users.find((user) => user.data.emailAddress === emailAddress);
    return user ? Optional.of(user) : Optional.empty();
  }
}
