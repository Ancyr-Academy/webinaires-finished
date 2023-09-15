import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoWebinaire } from './mongo-webinaire';
import { MongoUser } from '../../auth/models/mongo-user';

export namespace MongoParticipation {
  export const CollectionName = 'participations';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop({ type: String, ref: MongoWebinaire.CollectionName })
    webinaireId: string;

    @Prop({ type: String, ref: MongoUser.CollectionName })
    userId: string;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
