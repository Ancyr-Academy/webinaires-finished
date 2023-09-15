import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoUser } from '../../auth/models/mongo-user';

export namespace MongoWebinaire {
  export const CollectionName = 'webinaires';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop({ type: String, ref: MongoUser.CollectionName })
    organizerId: string;

    @Prop({ type: Number })
    seats: number;

    @Prop({ type: Date })
    startAt: Date;

    @Prop({ type: Date })
    endAt: Date;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
