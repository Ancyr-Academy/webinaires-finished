import { AbstractMapper } from '../../../../modules/shared/mapper';
import { WebinaireEntity } from '../../../../modules/webinaires/write/model/webinaire.entity';
import { MongoWebinaire } from './mongo-webinaire';

export class MongoWebinaireMapper extends AbstractMapper<
  WebinaireEntity,
  MongoWebinaire.SchemaClass
> {
  toDomain(packet: MongoWebinaire.SchemaClass): WebinaireEntity {
    return new WebinaireEntity({
      id: packet._id,
      organizerId: packet.organizerId,
      seats: packet.seats,
      startAt: packet.startAt,
      endAt: packet.endAt,
    });
  }

  toPersistence(entity: WebinaireEntity): MongoWebinaire.SchemaClass {
    const { data } = entity;
    return {
      _id: data.id,
      organizerId: data.organizerId,
      seats: data.seats,
      startAt: data.startAt,
      endAt: data.endAt,
    };
  }
}
