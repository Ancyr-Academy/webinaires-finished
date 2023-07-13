import { UserEntity } from '../../../auth/entity/user.entity';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IIDProvider } from '../../../system/id/id-provider';
import { IWebinaireQuery } from '../../../webinaires/gateway/webinaire.query';
import { ParticipationEntity } from '../../entities/participation.entity';
import { IParticipationRepository } from '../../gateway/participation.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class ReserveSeat extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly idProvider: IIDProvider,
    private readonly webinaireQuery: IWebinaireQuery,
    private readonly participationRepository: IParticipationRepository,
  ) {
    super();
  }

  async handle({ user, webinaireId }: Request): Promise<Response> {
    const webinaireOption = await this.webinaireQuery.findById(webinaireId);
    const webinaire = webinaireOption.getOrThrow(
      new DomainException('NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isFull()) {
      throw new DomainException('WEBINAIRE_FULL', 'Webinaire is full');
    }

    const participationOption = await this.participationRepository.find(
      webinaireId,
      user.id,
    );

    if (participationOption.isNull() === false) {
      throw new DomainException(
        'ALREADY_RESERVED',
        'You already participate in this webinaire',
      );
    }

    const participation = new ParticipationEntity({
      id: this.idProvider.getId(),
      userId: user.id,
      webinaireId,
    });

    await this.participationRepository.create(participation);
  }
}
