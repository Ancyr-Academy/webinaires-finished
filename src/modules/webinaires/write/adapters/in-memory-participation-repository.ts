import { Optional } from '../../../shared/optional';
import { ParticipationEntity } from '../model/participation.entity';
import { IParticipationRepository } from '../ports/participation.repository';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(private database: Record<string, ParticipationEntity> = {}) {}

  async findById(id: string): Promise<Optional<ParticipationEntity>> {
    const participation = this.database[id];
    if (!participation) {
      return Optional.empty();
    }

    return Optional.of(participation);
  }

  async find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>> {
    const participation = Object.values(this.database).find(
      (p) => p.data.webinaireId === webinaireId && p.data.userId === userId,
    );

    return participation ? Optional.of(participation) : Optional.empty();
  }

  async create(participation: ParticipationEntity): Promise<void> {
    if (this.database[participation.data.id]) {
      throw new Error('Participation already exists');
    }

    this.database[participation.data.id] = participation;
  }

  async delete(participation: ParticipationEntity): Promise<void> {
    delete this.database[participation.data.id];
  }
}
