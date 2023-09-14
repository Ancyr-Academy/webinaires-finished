import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export namespace MongoUser {
  @MongooseSchema()
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    emailAddress: string;

    @Prop()
    password: string;
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
