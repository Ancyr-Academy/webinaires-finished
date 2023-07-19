import { EntityType } from '../../shared/entity';
import { WebinaireEntity } from './webinaire.entity';
import {
  WebinaireViewModel,
  WebinaireViewModelType,
} from './webinaire.viewmodel';

export class WebinaireFactory {
  static create(data?: Partial<EntityType<WebinaireEntity>>): WebinaireEntity {
    return new WebinaireEntity({
      id: 'webinaire-1',
      organizerId: 'organizer-1',
      seats: 100,
      startAt: new Date('2023-01-21T11:00:00.000Z'),
      endAt: new Date('2023-01-21T12:00:00.000Z'),
      ...data,
    });
  }

  static createViewModel(
    data?: Partial<WebinaireViewModelType>,
  ): WebinaireViewModel {
    return new WebinaireViewModel({
      id: 'webinaire-1',
      organizer: {
        id: 'organizer-1',
        name: 'The Organizer',
        emailAddress: 'the-organizer@gmail.com',
      },
      seats: {
        available: 100,
        total: 100,
      },
      startAt: new Date('2023-01-21T11:00:00.000Z'),
      endAt: new Date('2023-01-21T12:00:00.000Z'),
      ...data,
    });
  }
}
