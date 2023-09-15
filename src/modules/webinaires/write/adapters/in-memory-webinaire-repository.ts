import { Optional } from '../../../shared/optional';
import { WebinaireEntity } from '../model/webinaire.entity';
import { IWebinaireRepository } from '../ports/webinaire.repository';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  constructor(private database: WebinaireEntity[] = []) {}

  async findById(id: string): Promise<Optional<WebinaireEntity>> {
    const webinaire = this.database.find((w) => w.data.id === id);
    if (!webinaire) {
      return Optional.empty();
    }

    return Optional.of(webinaire.clone());
  }

  async create(entity: WebinaireEntity): Promise<void> {
    this.database.push(entity);
    return;
  }

  async update(entity: WebinaireEntity): Promise<void> {
    const index = this.database.findIndex((w) => w.data.id === entity.id);
    this.database[index] = entity;
    entity.commit();
    return;
  }

  async delete(entity: WebinaireEntity): Promise<void> {
    this.database = this.database.filter((w) => w.data.id !== entity.id);
  }

  count() {
    return this.database.length;
  }
}
