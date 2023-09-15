import { AbstractMapper } from '../../../../modules/shared/mapper';
import { ParticipationEntity } from '../../../../modules/webinaires/write/model/participation.entity';
import { MongoParticipation } from './mongo-participation';

export class MongoParticipationMapper extends AbstractMapper<
  ParticipationEntity,
  MongoParticipation.SchemaClass
> {
  toDomain(packet: MongoParticipation.SchemaClass): ParticipationEntity {
    return new ParticipationEntity({
      id: packet._id,
      webinaireId: packet.webinaireId,
      userId: packet.userId,
    });
  }

  toPersistence(entity: ParticipationEntity): MongoParticipation.SchemaClass {
    const { data } = entity;
    return {
      _id: data.id,
      webinaireId: data.webinaireId,
      userId: data.userId,
    };
  }
}
