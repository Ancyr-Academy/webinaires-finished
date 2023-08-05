import {
  ParticipantViewModel,
  ParticipantViewModelType,
} from '../../read/model/participant.viewmodel';

export class ParticipantFactory {
  static create(
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
