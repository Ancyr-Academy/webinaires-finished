import { UserEntity } from '../../entity/user.entity';
import { IUserRepository } from '../../ports/auth.gateway';
import { IPasswordHasher } from '../password-hasher/password-hasher.interface';
import { AuthenticationException } from './authentication.exception';
import { IAuthenticator } from './authenticator.interface';

export class Authenticator implements IAuthenticator {
  constructor(
    private readonly authGateway: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async authenticate(token: string): Promise<UserEntity> {
    const [emailAddress, password] = this.extractCredentials(token);

    const userOption = await this.authGateway.findByEmailAddress(emailAddress);
    const user = userOption.getOrThrow(
      new AuthenticationException("User doesn't exist"),
    );

    const isPasswordValid = await this.passwordHasher.verify(
      password,
      user.data.password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationException("Password doesn't match");
    }

    return user;
  }

  private extractCredentials(token: string): [string, string] {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [emailAddress, password] = decoded.split(':');
    return [emailAddress, password];
  }
}
