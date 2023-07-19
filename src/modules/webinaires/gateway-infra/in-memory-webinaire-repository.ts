import { Optional } from '../../shared/optional';
import { WebinaireEntity } from '../entities/webinaire.entity';
import { IWebinaireRepository } from '../gateway/webinaire.repository';

export class InMemoryWebinaireRepository implements IWebinaireRepository {
  private database = new Map<string, WebinaireEntity>();

  async getWebinaireById(id: string): Promise<Optional<WebinaireEntity>> {
    const webinaire = this.database.get(id);
    if (!webinaire) {
      return Optional.empty();
    }

    webinaire.reset();
    return Optional.of(webinaire);
  }

  async create(entity: WebinaireEntity): Promise<void> {
    this.database.set(entity.id, entity);
    return;
  }

  async update(entity: WebinaireEntity): Promise<void> {
    this.database.set(entity.id, entity);
    entity.commit();
    return;
  }

  async delete(entity: WebinaireEntity): Promise<void> {
    this.database.delete(entity.id);
    return;
  }

  count() {
    return this.database.size;
  }
}
