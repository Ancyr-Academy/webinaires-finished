import { UserEntity } from '../../../auth/entity/user.entity';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IDateProvider } from '../../../system/date/date-provider';
import { IWebinaireGateway } from '../../gateway/webinaire.gateway';

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
    private readonly webinaireGateway: IWebinaireGateway,
  ) {
    super();
  }

  async handle({
    user,
    webinaireId,
    startAt,
    endAt,
  }: Request): Promise<Response> {
    const webinaireOption = await this.webinaireGateway.getWebinaireById(
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

    await this.webinaireGateway.update(webinaire);
  }
}
