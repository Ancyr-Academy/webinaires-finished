import { UserEntity } from '../../../../auth/entity/user.entity';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IWebinaireRepository } from '../../ports/webinaire.repository';

type Request = {
  webinaireId: string;
  user: UserEntity;
  seats: number;
};

type Response = void;

export class ChangeSeats extends Executable<Request, Response> {
  constructor(private readonly webinaireRepository: IWebinaireRepository) {
    super();
  }

  async run({ user, webinaireId, seats }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireQuery.getOrThrow(
      new DomainException('WEBINAIRE_NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isOrganizer(user.id) === false) {
      throw new DomainException(
        'NOT_ORGANIZER',
        'Only the organizer can change the number of seats',
      );
    }

    if (seats < webinaire.data.seats) {
      throw new DomainException(
        'TOO_FEW_SEATS',
        'You cannot reduce the number of seats',
      );
    }

    webinaire.setState({
      seats,
    });

    if (webinaire.hasValidNumberOfSeats() === false) {
      throw new DomainException(
        'INVALID_NUMBER_OF_SEATS',
        'Webinaire must have between 1 and 1000 seats',
      );
    }

    await this.webinaireRepository.update(webinaire);
  }
}
