import { UserEntity } from '../../../../auth/entity/user.entity';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IDateProvider } from '../../../../system/date/date-provider';
import { IWebinaireRepository } from '../../ports/webinaire.repository';
import { IParticipationRepository } from '../../ports/participation.repository';
import { IUserRepository } from '../../../../auth/ports/auth.gateway';

type Request = {
  user: UserEntity;
  webinaireId: string;
  startAt: Date;
  endAt: Date;
};

type Response = void;

export class ChangeDates extends Executable<Request, Response> {
  constructor(
    private readonly dateProvider: IDateProvider,
    private readonly userRepository: IUserRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async execute({
    user,
    webinaireId,
    startAt,
    endAt,
  }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireQuery.getOrThrow(
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
    const participations =
      await this.participationRepository.findParticipations(webinaireId);

    const users = await this.userRepository.findByIds(
      participations.map((p) => p.data.userId),
    );

    await Promise.all(
      users.map(async (user) => {
        return this.mailer.sendMail({
          to: user.data.emailAddress,
          subject: 'Changement de dates',
          body: 'Les dates du webinaire ont été modifiées.',
        });
      }),
    );
  }
}
