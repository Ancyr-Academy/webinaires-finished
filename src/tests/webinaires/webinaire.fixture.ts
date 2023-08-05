import { IFixture } from '../setup/fixture';
import { ITestApp } from '../setup/test-app.interface';
import { WebinaireEntity } from '../../modules/webinaires/write/model/webinaire.entity';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/write/ports/webinaire.repository';
import {
  IWebinaireQuery,
  I_WEBINAIRE_QUERY,
} from '../../modules/webinaires/read/ports/webinaire.query';
import { InMemoryWebinaireQuery } from '../../modules/webinaires/read/adapters/in-memory-webinaire-query';
import { WebinaireViewModel } from '../../modules/webinaires/read/model/webinaire.viewmodel';

export class WebinaireFixture implements IFixture {
  constructor(public entity: WebinaireEntity) {}

  async save(app: ITestApp) {
    const webinaireRepository = app.get<IWebinaireRepository>(
      I_WEBINAIRE_REPOSITORY,
    );

    // Temporary hack around the fact that we're not using a real database
    // in our e2e tests. Hence we don't have a real read-model for now.
    const webinaireQuery = app.get<IWebinaireQuery>(I_WEBINAIRE_QUERY);
    if (webinaireQuery instanceof InMemoryWebinaireQuery) {
      webinaireQuery.setWebinaire(
        new WebinaireViewModel({
          id: this.entity.data.id,
          organizer: {
            id: this.entity.data.organizerId,
            name: '',
            emailAddress: '',
          },
          startAt: this.entity.data.startAt,
          endAt: this.entity.data.endAt,
          seats: {
            available: this.entity.data.seats,
            total: this.entity.data.seats,
          },
        }),
      );
    }

    await webinaireRepository.create(this.entity);
  }

  getId() {
    return this.entity.data.id;
  }
}
