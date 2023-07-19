import { ParticipantViewModel } from '../entities/participant.viewmodel';
import { IParticipantQuery } from '../gateway/participant.query';

export class InMemoryParticipantQuery implements IParticipantQuery {
  constructor(private database: Record<string, ParticipantViewModel> = {}) {}

  async findAllParticipants(
    webinaireId: string,
  ): Promise<ParticipantViewModel[]> {
    const participants = Object.entries(this.database)
      .filter(([key]) => key === webinaireId)
      .map(([, value]) => value);

    return participants;
  }
}
