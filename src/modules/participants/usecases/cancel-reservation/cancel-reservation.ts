import { UserEntity } from '../../../auth/entity/user.entity';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IParticipationRepository } from '../../gateway/participation.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class CancelReservation extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
  ) {
    super();
  }

  async handle({ user, webinaireId }: Request): Promise<Response> {
    const participationOption = await this.participationRepository.find(
      webinaireId,
      user.id,
    );

    const participation = participationOption.getOrThrow(
      new DomainException('NOT_FOUND', 'Participation not found'),
    );

    await this.participationRepository.delete(participation);
  }
}
