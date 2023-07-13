import { Optional } from '../../shared/optional';
import { ParticipationEntity } from '../entities/participation.entity';

export interface IParticipationRepository {
  find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>>;
  create(participation: ParticipationEntity): Promise<void>;
  delete(participation: ParticipationEntity): Promise<void>;
}
