import { Model } from 'mongoose';
import { Optional } from '../../../../modules/shared/optional';
import { WebinaireEntity } from '../../../../modules/webinaires/write/model/webinaire.entity';
import { IWebinaireRepository } from '../../../../modules/webinaires/write/ports/webinaire.repository';
import { MongoWebinaireMapper } from '../models/mongo-webinaire.mapper';
import { MongoWebinaire } from '../models/mongo-webinaire';

export class MongoWebinaireRepository implements IWebinaireRepository {
  private mapper = new MongoWebinaireMapper();

  constructor(private readonly model: Model<MongoWebinaire.SchemaClass>) {}

  async findById(id: string): Promise<Optional<WebinaireEntity>> {
    const model = await this.model.findById(id);
    return model ? Optional.of(this.mapper.toDomain(model)) : Optional.empty();
  }

  async create(entity: WebinaireEntity): Promise<void> {
    const document = this.mapper.toPersistence(entity);
    const model = new this.model(document);
    await model.save();
  }

  async update(entity: WebinaireEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(entity: WebinaireEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
