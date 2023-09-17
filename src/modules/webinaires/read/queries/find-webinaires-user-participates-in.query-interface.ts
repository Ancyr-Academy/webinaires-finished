import { Executable } from '../../../shared/executable';
import { WebinaireReadModel } from '../model/webinaire.read-model';

export const I_FIND_WEBINAIRES_USER_PARTICIPATES_IN_QUERY = Symbol(
  'I_FIND_WEBINAIRES_USER_PARTICIPATES_IN_QUERY',
);

export interface IFindWebinairesUserParticipatesInQuery
  extends Executable<string, WebinaireReadModel[]> {}
