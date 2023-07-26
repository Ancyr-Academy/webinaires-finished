import { ParticipantViewModel } from '../entities/participant.viewmodel';

export const I_PARTICIPANT_QUERY = Symbol('I_PARTICIPANT_QUERY');

export interface IParticipantQuery {
  findAllParticipants(webinaireId: string): Promise<ParticipantViewModel[]>;
}
