import { Entity } from '../../../shared/entity';

type ParticipantData = {
  id: string;
  webinaireId: string;
  userId: string;
};

export class ParticipationEntity extends Entity<ParticipantData> {}
