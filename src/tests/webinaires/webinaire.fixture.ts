import { IFixture } from '../setup/fixture';
import { ITestApp } from '../setup/test-app.interface';
import { WebinaireEntity } from '../../modules/webinaires/entities/webinaire.entity';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';

export class WebinaireFixture implements IFixture {
  constructor(public entity: WebinaireEntity) {}

  async save(app: ITestApp) {
    const webinaireRepository = app.get<IWebinaireRepository>(
      I_WEBINAIRE_REPOSITORY,
    );
    await webinaireRepository.create(this.entity);
  }

  getId() {
    return this.entity.data.id;
  }
}
