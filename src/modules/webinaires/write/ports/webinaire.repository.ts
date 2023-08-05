import { Optional } from '../../../shared/optional';
import { WebinaireEntity } from '../model/webinaire.entity';

export const I_WEBINAIRE_REPOSITORY = Symbol('I_WEBINAIRE_REPOSITORY');

export interface IWebinaireRepository {
  getWebinaireById(id: string): Promise<Optional<WebinaireEntity>>;
  create(entity: WebinaireEntity): Promise<void>;
  update(entity: WebinaireEntity): Promise<void>;
  delete(entity: WebinaireEntity): Promise<void>;
}
