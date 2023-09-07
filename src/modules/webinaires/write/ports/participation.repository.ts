import { Optional } from '../../../shared/optional';
import { ParticipationEntity } from '../model/participation.entity';

export const I_PARTICIPATION_REPOSITORY = Symbol('I_PARTICIPATION_REPOSITORY');

export interface IParticipationRepository {
  find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>>;
  findParticipationCount(webinaireId: string): Promise<number>;
  findParticipations(webinaireId: string): Promise<ParticipationEntity[]>;
  create(participation: ParticipationEntity): Promise<void>;
  delete(participation: ParticipationEntity): Promise<void>;
}
