import { UserEntity } from '../../entity/user.entity';
import { IAuthGateway } from '../../gateway/auth.gateway';
import { IPasswordHasher } from '../password-hasher/password-hasher.interface';
import { AuthenticationException } from './authentication.exception';
import { IAuthenticator } from './authenticator.interface';

export class Authenticator implements IAuthenticator {
  constructor(
    private readonly authGateway: IAuthGateway,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async fromBasicAuth(token: string): Promise<UserEntity> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [emailAddress, password] = decoded.split(':');

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
}
