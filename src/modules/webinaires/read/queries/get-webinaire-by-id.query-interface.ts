import { Executable } from '../../../shared/executable';
import { WebinaireReadModel } from '../model/webinaire.read-model';

export const I_GET_WEBINAIRE_BY_ID_QUERY = Symbol(
  'I_GET_WEBINAIRE_BY_ID_QUERY',
);

export interface IGetWebinaireByIdQuery
  extends Executable<string, WebinaireReadModel> {}
