import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IIDProvider } from '../../../system/id/id-provider';
import { UserEntity } from '../../entity/user.entity';
import { IAuthGateway } from '../../gateway/auth.gateway';
import { IPasswordHasher } from '../../services/password-hasher/password-hasher-interface';

type Request = {
  emailAddress: string;
  password: string;
};

type Response = {
  id: string;
};

export class CreateAccount extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly idProvider: IIDProvider,
    private readonly authGateway: IAuthGateway,
    private readonly passwordHasher: IPasswordHasher,
  ) {
    super();
  }

  async handle({ emailAddress, password }: Request): Promise<Response> {
    const isEmailAddressAvailable =
      await this.authGateway.isEmailAddressAvailable(emailAddress);

    if (!isEmailAddressAvailable) {
      throw new EmailAddressNotAvailableException();
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const user = new UserEntity({
      id: this.idProvider.getId(),
      emailAddress,
      password: hashedPassword,
    });

    await this.authGateway.createUser(user);

    return {
      id: this.idProvider.getId(),
    };
  }
}

class EmailAddressNotAvailableException extends DomainException {
  constructor() {
    super('EMAIL_ADDRESS_NOT_AVAILABLE', 'Email address is not available');
  }
}
