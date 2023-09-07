import { Optional } from '../../../shared/optional';
import { ParticipationEntity } from '../model/participation.entity';
import { IParticipationRepository } from '../ports/participation.repository';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(private database: ParticipationEntity[] = []) {}

  async findById(id: string): Promise<Optional<ParticipationEntity>> {
    const participation = this.database.find((p) => p.data.id === id);
    if (!participation) {
      return Optional.empty();
    }

    return Optional.of(participation);
  }

  async find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>> {
    const participation = this.database.find(
      (p) => p.data.webinaireId === webinaireId && p.data.userId === userId,
    );

    return participation ? Optional.of(participation) : Optional.empty();
  }

  async findParticipationCount(webinaireId: string): Promise<number> {
    const participations = this.database.filter(
      (p) => p.data.webinaireId === webinaireId,
    );

    return participations.length;
  }

  async findParticipations(
    webinaireId: string,
  ): Promise<ParticipationEntity[]> {
    const participations = this.database.filter(
      (p) => p.data.webinaireId === webinaireId,
    );

    return participations.map((p) => p.clone());
  }

  async create(participation: ParticipationEntity): Promise<void> {
    const isAlreadyInDatabase = this.database.some(
      (p) => p.data.id === participation.data.id,
    );

    if (isAlreadyInDatabase) {
      throw new Error('Participation already exists');
    }

    this.database.push(participation);
  }

  async delete(participation: ParticipationEntity): Promise<void> {
    this.database = this.database.filter(
      (p) => p.data.id !== participation.data.id,
    );
  }
}
