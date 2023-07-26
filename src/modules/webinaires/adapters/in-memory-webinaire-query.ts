import { Optional } from '../../shared/optional';
import { WebinaireViewModel } from '../entities/webinaire.viewmodel';
import { IWebinaireQuery } from '../ports/webinaire.query';

export class InMemoryWebinaireQuery implements IWebinaireQuery {
  constructor(private database: Record<string, WebinaireViewModel> = {}) {}

  async findById(id: string): Promise<Optional<WebinaireViewModel>> {
    const webinaire = this.database[id];
    if (!webinaire) {
      return Optional.empty();
    }

    return Optional.of(webinaire);
  }
}
