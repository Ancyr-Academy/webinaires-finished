import { Optional } from '../../shared/optional';
import { WebinaireEntity } from '../entities/webinaire.entity';

export interface IWebinaireGateway {
  getWebinaireById(id: string): Promise<Optional<WebinaireEntity>>;
  create(entity: WebinaireEntity): Promise<void>;
  update(entity: WebinaireEntity): Promise<void>;
}
