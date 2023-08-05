import { EntityType } from '../../../shared/entity';
import { ParticipationEntity } from './participation.entity';

export class ParticipationFactory {
  static create(
    data?: Partial<EntityType<ParticipationEntity>>,
  ): ParticipationEntity {
    return new ParticipationEntity({
      id: 'participation-1',
      webinaireId: 'webinaire-1',
      userId: 'user-1',
      ...data,
    });
  }
}
