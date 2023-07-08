import { EntityType } from '../../shared/entity';
import { WebinaireEntity } from './webinaire.entity';

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
}
