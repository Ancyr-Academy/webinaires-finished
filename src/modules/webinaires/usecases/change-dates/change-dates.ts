import { UserEntity } from '../../../auth/entity/user.entity';
import { IMailer } from '../../../mailer/gateway/mailer.interface';
import { IParticipantQuery } from '../../gateway/participant.query';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IDateProvider } from '../../../system/date/date-provider';
import { IWebinaireRepository } from '../../gateway/webinaire.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
  startAt: Date;
  endAt: Date;
};

type Response = void;

export class ChangeDates extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly dateProvider: IDateProvider,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participantQuery: IParticipantQuery,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async handle({
    user,
    webinaireId,
    startAt,
    endAt,
  }: Request): Promise<Response> {
    const webinaireOption = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireOption.getOrThrow(
      new DomainException('WEBINAIRE_NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isOrganizer(user.id) === false) {
      throw new DomainException(
        'NOT_ORGANIZER',
        'Only the organizer can change the dates',
      );
    }

    webinaire.setState({
      startAt,
      endAt,
    });

    if (webinaire.isTooClose(this.dateProvider.getDate())) {
      throw new DomainException(
        'TOO_CLOSE_TO_DELAY',
        'Webinaire must start in at least 3 days',
      );
    }

    await this.webinaireRepository.update(webinaire);
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
          subject: 'Changement de dates',
          body: 'Les dates du webinaire ont été modifiées.',
        });
      }),
    );
  }
}
