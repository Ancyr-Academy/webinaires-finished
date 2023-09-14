import { Optional } from '../../../shared/optional';
import { WebinaireViewModel } from '../model/webinaire.viewmodel';
import { IWebinaireQuery } from '../ports/webinaire.query';

export class InMemoryWebinaireQuery implements IWebinaireQuery {
  constructor(private database: Record<string, WebinaireViewModel> = {}) {}

  setWebinaire(webinaire: WebinaireViewModel) {
    this.database[webinaire.props.id] = webinaire;
  }

  async findById(id: string): Promise<Optional<WebinaireViewModel>> {
    const webinaire = this.database[id];
    if (!webinaire) {
      return Optional.empty();
    }

    return Optional.of(webinaire);
  }
}
