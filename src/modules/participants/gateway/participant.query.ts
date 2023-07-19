import { ParticipantViewModel } from '../entities/participant.viewmodel';

export interface IParticipantQuery {
  findAllParticipants(webinaireId: string): Promise<ParticipantViewModel[]>;
}
