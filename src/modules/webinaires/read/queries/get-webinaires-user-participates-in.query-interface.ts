import { Executable } from '../../../shared/executable';
import { WebinaireReadModel } from '../model/webinaire.read-model';

export const I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY = Symbol(
  'I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY',
);

export interface IGetWebinairesUserParticipatesInQuery
  extends Executable<string, WebinaireReadModel[]> {}
