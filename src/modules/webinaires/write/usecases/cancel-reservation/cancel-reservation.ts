import { UserEntity } from '../../../../auth/entity/user.entity';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { AbstractExecutable } from '../../../../shared/executable';
import { IWebinaireQuery } from '../../../read/ports/webinaire.query';
import { IParticipationRepository } from '../../ports/participation.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class CancelReservation extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly webinaireQuery: IWebinaireQuery,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async run({ user, webinaireId }: Request): Promise<Response> {
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
    const webinaireOption = await this.webinaireQuery.findById(webinaireId);
    const webinaire = webinaireOption.getOrThrow();

    await this.mailer.sendMail({
      to: webinaire.data.organizer.emailAddress,
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
