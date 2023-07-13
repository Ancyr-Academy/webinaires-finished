import { Optional } from '../../shared/optional';
import { WebinaireViewModel } from '../entities/webinaire.viewmodel';
import { IWebinaireQuery } from '../gateway/webinaire.query';

export class InMemoryWebinaireQuery implements IWebinaireQuery {
  constructor(private webinaires: Record<string, WebinaireViewModel> = {}) {}

  async findById(id: string): Promise<Optional<WebinaireViewModel>> {
    const webinaire = this.webinaires[id];
    if (!webinaire) {
      return Optional.empty();
    }

    return Optional.of(webinaire);
  }
}
