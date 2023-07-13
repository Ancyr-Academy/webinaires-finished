import { Optional } from '../../shared/optional';
import { WebinaireViewModel } from '../entities/webinaire.viewmodel';

export interface IWebinaireQuery {
  findById(id: string): Promise<Optional<WebinaireViewModel>>;
}
