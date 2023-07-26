import { Optional } from '../../shared/optional';
import { WebinaireViewModel } from '../entities/webinaire.viewmodel';

export const I_WEBINAIRE_QUERY = Symbol('I_WEBINAIRE_QUERY');

export interface IWebinaireQuery {
  findById(id: string): Promise<Optional<WebinaireViewModel>>;
}
