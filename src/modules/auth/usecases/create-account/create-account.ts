import { z } from 'zod';
import { DomainException } from '../../../shared/domain-exception';
import { Executable } from '../../../shared/executable';
import { Validator } from '../../../shared/validator';
import { IIDProvider } from '../../../system/id/id-provider';
import { UserEntity } from '../../entity/user.entity';
import { IUserRepository } from '../../ports/auth.gateway';
import { IPasswordHasher } from '../../services/password-hasher/password-hasher.interface';
import { IMailer } from '../../../mailer/ports/mailer.interface';

type Request = {
  emailAddress: string;
  password: string;
};

type Response = {
  id: string;
};

export class CreateAccount extends Executable<Request, Response> {
  private validator = new Validator(
    z.object({
      emailAddress: z.string().email(),
      password: z.string().min(6),
    }),
  );

  constructor(
    private readonly idProvider: IIDProvider,
    private readonly authGateway: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async execute(payload: Request): Promise<Response> {
    await this.validator.validate(payload);
    const { emailAddress, password } = payload;

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
    await this.mailer.sendMail({
      to: emailAddress,
      subject: 'Bienvenue à Webinaires !',
      body: 'Votre compte a bien été créé.',
    });

    return {
      id: user.data.id,
    };
  }
}

class EmailAddressNotAvailableException extends DomainException {
  constructor() {
    super('EMAIL_ADDRESS_NOT_AVAILABLE', 'Email address is not available');
  }
}
