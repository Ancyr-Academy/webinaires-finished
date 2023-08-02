import { IFixture } from '../setup/fixture';
import { ITestApp } from '../setup/test-app.interface';
import { ParticipationEntity } from '../../modules/webinaires/entities/participation.entity';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '../../modules/webinaires/ports/participation.repository';

export class ParticipationFixture implements IFixture {
  constructor(public entity: ParticipationEntity) {}

  async save(app: ITestApp) {
    const participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );

    await participationRepository.create(this.entity);
  }

  getId() {
    return this.entity.data.id;
  }
}
