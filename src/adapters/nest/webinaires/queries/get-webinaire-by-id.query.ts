import { Model } from 'mongoose';
import { IGetWebinaireByIdQuery } from '../../../../modules/webinaires/read/queries/get-webinaire-by-id.query-interface';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { MongoParticipation } from '../models/mongo-participation';
import { MongoUser } from '../../auth/models/mongo-user';
import { WebinaireReadModel } from '../../../../modules/webinaires/read/model/webinaire.read-model';

export class GetWebinaireByIdQuery implements IGetWebinaireByIdQuery {
  constructor(
    private readonly userModel: Model<MongoUser.SchemaClass>,
    private readonly webinaireModel: Model<MongoWebinaire.SchemaClass>,
    private readonly participationModel: Model<MongoParticipation.SchemaClass>,
  ) {}

  async execute(id: string) {
    const webinaire = await this.webinaireModel.findById(id);

    if (!webinaire) {
      throw new Error('Webinaire not found');
    }

    const organizer = await this.userModel.findById(webinaire.organizerId);

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    const participationsCount = await this.participationModel.countDocuments({
      webinaireId: id,
    });

    return new WebinaireReadModel({
      id: webinaire.id,
      organizer: {
        id: organizer.id,
        emailAddress: organizer.emailAddress,
      },
      seats: {
        available: webinaire.seats - participationsCount,
        total: webinaire.seats,
      },
      startAt: webinaire.startAt,
      endAt: webinaire.endAt,
    });
  }
}
