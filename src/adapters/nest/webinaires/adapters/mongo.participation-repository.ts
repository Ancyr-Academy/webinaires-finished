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
    const record = await this.model.findOne({
      webinaireId,
      userId,
    });

    return record
      ? Optional.of(this.mapper.toDomain(record))
      : Optional.empty();
  }

  async findParticipationCount(webinaireId: string): Promise<number> {
    return this.model.countDocuments({ webinaireId });
  }

  async findAllParticipations(
    webinaireId: string,
  ): Promise<ParticipationEntity[]> {
    const records = await this.model.find({ webinaireId });
    return records.map((record) => this.mapper.toDomain(record));
  }

  async create(participation: ParticipationEntity): Promise<void> {
    const record = this.mapper.toPersistence(participation);
    await this.model.create(record);
  }

  async delete(participation: ParticipationEntity): Promise<void> {
    const record = this.mapper.toPersistence(participation);

    await this.model.deleteOne({
      webinaireId: record.webinaireId,
      userId: record.userId,
    });
  }
}
