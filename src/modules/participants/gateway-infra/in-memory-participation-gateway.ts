import { Optional } from '../../shared/optional';
import { ParticipationEntity } from '../entities/participation.entity';
import { IParticipationRepository } from '../gateway/participation.repository';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(
    private participations: Record<string, ParticipationEntity> = {},
  ) {}

  async findById(id: string): Promise<Optional<ParticipationEntity>> {
    const participation = this.participations[id];
    if (!participation) {
      return Optional.empty();
    }

    return Optional.of(participation);
  }

  async find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>> {
    const participation = Object.values(this.participations).find(
      (p) => p.data.webinaireId === webinaireId && p.data.userId === userId,
    );

    return participation ? Optional.of(participation) : Optional.empty();
  }

  async create(participation: ParticipationEntity): Promise<void> {
    if (this.participations[participation.data.id]) {
      throw new Error('Participation already exists');
    }

    this.participations[participation.data.id] = participation;
  }

  async delete(participation: ParticipationEntity): Promise<void> {
    delete this.participations[participation.data.id];
  }
}
