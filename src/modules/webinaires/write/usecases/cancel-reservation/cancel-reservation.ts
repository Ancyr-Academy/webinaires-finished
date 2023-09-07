import { UserEntity } from '../../../../auth/entity/user.entity';
import { IUserRepository } from '../../../../auth/ports/auth.gateway';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IParticipationRepository } from '../../ports/participation.repository';
import { IWebinaireRepository } from '../../ports/webinaire.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class CancelReservation extends Executable<Request, Response> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async execute({ user, webinaireId }: Request): Promise<Response> {
    const participationQuery = await this.participationRepository.find(
      webinaireId,
      user.id,
    );

    const participation = participationQuery.getOrThrow(
      new DomainException('NOT_FOUND', 'Participation not found'),
    );

    await this.participationRepository.delete(participation);

    await this.notifyOrganizer(participation.data.webinaireId);
    await this.notifyParticipant(user);
  }

  private async notifyOrganizer(webinaireId: string) {
    const webinaireQuery = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireQuery.getOrThrow();

    const userQuery = await this.userRepository.findById(
      webinaire.data.organizerId,
    );

    const user = userQuery.getOrThrow();

    await this.mailer.sendMail({
      to: user.data.emailAddress,
      subject: 'Annulation de participation',
      body: 'Une personne a annulé sa participation à votre webinaire.',
    });
  }

  private async notifyParticipant(user: UserEntity) {
    await this.mailer.sendMail({
      to: user.data.emailAddress,
      subject: 'Annulation de votre participation',
      body: 'Votre participation au webinaire a bien été annulée.',
    });
  }
}
