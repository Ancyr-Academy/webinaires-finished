import { UserEntity } from '../../../auth/entity/user.entity';
import { IMailer } from '../../../mailer/ports/mailer.interface';
import { IParticipantQuery } from '../../ports/participant.query';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IWebinaireRepository } from '../../ports/webinaire.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class CancelWebinaire extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participantQuery: IParticipantQuery,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async handle({ user, webinaireId }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireQuery.getOrThrow(
      new DomainException('WEBINAIRE_NOT_FOUND', 'Webinaire not found'),
    );

    console.log(webinaire, user.id, user.data.emailAddress);

    if (webinaire.isOrganizer(user.id) === false) {
      throw new DomainException(
        'NOT_ORGANIZER',
        'Only the organizer can cancel the webinaire',
      );
    }

    await this.webinaireRepository.delete(webinaire);
    await this.notifyParticipants(webinaireId);
  }

  async notifyParticipants(webinaireId: string): Promise<void> {
    const participants = await this.participantQuery.findAllParticipants(
      webinaireId,
    );

    await Promise.all(
      participants.map(async (participant) => {
        return this.mailer.sendMail({
          to: participant.data.emailAddress,
          subject: 'Annulation du webinaire',
          body: 'Le webinaire a été annulé.',
        });
      }),
    );
  }
}
