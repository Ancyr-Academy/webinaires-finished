import { ParticipantViewModel } from '../entities/participant.viewmodel';
import { IParticipantQuery } from '../gateway/participant.query';

export class InMemoryParticipantQuery implements IParticipantQuery {
  constructor(private database: Record<string, ParticipantViewModel[]> = {}) {}

  async findAllParticipants(
    webinaireId: string,
  ): Promise<ParticipantViewModel[]> {
    const participants = this.database[webinaireId] ?? [];
    return participants;
  }
}
