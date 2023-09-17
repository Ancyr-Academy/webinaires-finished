import { Executable } from '../../../shared/executable';
import { WebinaireReadModel } from '../model/webinaire.read-model';

export const I_FIND_WEBINAIRE_BY_ID_QUERY = Symbol(
  'I_FIND_WEBINAIRE_BY_ID_QUERY',
);

export interface IFindWebinaireByIdQuery
  extends Executable<string, WebinaireReadModel> {}
