import { Model } from 'mongoose';
import { Optional } from '../../../../modules/shared/optional';
import { ParticipationEntity } from '../../../../modules/webinaires/write/model/participation.entity';
import { IParticipationRepository } from '../../../../modules/webinaires/write/ports/participation.repository';
import { MongoParticipation } from '../models/mongo-participation';
import { MongoParticipationMapper } from '../models/mongo-participation.mapper';

export class MongoParticipationRepository implements IParticipationRepository {
  private mapper = new MongoParticipationMapper();

  constructor(private readonly model: Model<MongoParticipation.SchemaClass>) {}

  async find(
    webinaireId: string,
    userId: string,
  ): Promise<Optional<ParticipationEntity>> {
    throw new Error('Method not implemented.');
  }

  async findParticipationCount(webinaireId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async findAllParticipations(
    webinaireId: string,
  ): Promise<ParticipationEntity[]> {
    throw new Error('Method not implemented.');
  }

  async create(participation: ParticipationEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(participation: ParticipationEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
