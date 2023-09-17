import { Model } from 'mongoose';
import { MongoWebinaire } from '../models/mongo-webinaire';
import { MongoParticipation } from '../models/mongo-participation';
import { MongoUser } from '../../auth/models/mongo-user';
import { WebinaireReadModel } from '../../../../modules/webinaires/read/model/webinaire.read-model';
import { IGetWebinairesUserParticipatesInQuery } from '../../../../modules/webinaires/read/queries/get-webinaires-user-participates-in.query-interface';

export class GetWebinairesUserParticipatesInQuery
  implements IGetWebinairesUserParticipatesInQuery
{
  constructor(
    private readonly userModel: Model<MongoUser.SchemaClass>,
    private readonly webinaireModel: Model<MongoWebinaire.SchemaClass>,
    private readonly participationModel: Model<MongoParticipation.SchemaClass>,
  ) {}

  async execute(userId: string) {
    const participations = await this.participationModel.find({
      userId,
    });

    const webinaireIds = participations.map((p) => p.webinaireId);
    const webinaires = await this.webinaireModel.find({
      _id: {
        $in: webinaireIds,
      },
    });

    return Promise.all(
      webinaires.map(async (webinaire) => {
        const organizer = await this.userModel.findById(webinaire.organizerId);

        if (!organizer) {
          throw new Error('Organizer not found');
        }

        const participationsCount =
          await this.participationModel.countDocuments({
            webinaireId: webinaire.id,
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
      }),
    );
  }
}
