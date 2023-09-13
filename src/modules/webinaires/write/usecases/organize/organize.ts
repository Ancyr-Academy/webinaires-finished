import { UserEntity } from '../../../../auth/core/user.entity';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IDateProvider } from '../../../../system/date/date-provider';
import { IIDProvider } from '../../../../system/id/id-provider';
import { WebinaireEntity } from '../../model/webinaire.entity';
import { IWebinaireRepository } from '../../ports/webinaire.repository';

type Request = {
  user: UserEntity;

  startAt: Date;
  endAt: Date;
  seats: number;
};

type Response = {
  id: string;
};

export class Organize extends Executable<Request, Response> {
  constructor(
    private readonly idProvider: IIDProvider,
    private readonly dateProvider: IDateProvider,
    private readonly webinaireGateway: IWebinaireRepository,
  ) {
    super();
  }

  async execute({ user, startAt, endAt, seats }: Request): Promise<Response> {
    const webinaire = new WebinaireEntity({
      id: this.idProvider.getId(),
      organizerId: user.id,
      startAt,
      endAt,
      seats,
    });

    if (webinaire.isTooClose(this.dateProvider.getDate())) {
      throw new DomainException(
        'TOO_CLOSE_TO_DELAY',
        'Webinaire must start in at least 3 days',
      );
    }

    if (webinaire.hasValidNumberOfSeats() === false) {
      throw new DomainException(
        'INVALID_NUMBER_OF_SEATS',
        'Webinaire must have between 1 and 1000 seats',
      );
    }

    await this.webinaireGateway.create(webinaire);

    return {
      id: webinaire.id,
    };
  }
}
