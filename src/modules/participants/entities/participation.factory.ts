import { EntityType } from '../../shared/entity';
import {
  ParticipantViewModel,
  ParticipantViewModelType,
} from './participant.viewmodel';
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

  static createViewModel(
    data?: Partial<ParticipantViewModelType>,
  ): ParticipantViewModel {
    return new ParticipantViewModel({
      id: 'user-1',
      name: 'User',
      emailAddress: 'user@gmail.com',
      ...data,
    });
  }
}
