import { AbstractEntity } from '../../shared/entity';

type WebinaireData = {
  id: string;
  organizerId: string;
  seats: number;
  startAt: Date;
  endAt: Date;
};

export class WebinaireEntity extends AbstractEntity<WebinaireData> {}
