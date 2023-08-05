import { ParticipantViewModel } from '../model/participant.viewmodel';
import { IParticipantQuery } from '../ports/participant.query';

export class InMemoryParticipantQuery implements IParticipantQuery {
  constructor(private database: Record<string, ParticipantViewModel[]> = {}) {}

  async findAllParticipants(
    webinaireId: string,
  ): Promise<ParticipantViewModel[]> {
    const participants = this.database[webinaireId] ?? [];
    return participants;
  }
}
