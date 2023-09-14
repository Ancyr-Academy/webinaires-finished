import * as deepObjectDiff from 'deep-object-diff';
import { Entity } from './entity';

export interface IMapper<T> {
  toDomain(packet: any): T;
  toPersistence(entity: T): any;
  diff(entity: T): any;
}

export abstract class AbstractMapper<
  T extends Entity<any>,
  Schema extends Record<string, any>,
> implements IMapper<T>
{
  abstract toDomain(packet: Schema): T;
  abstract toPersistence(entity: T): Schema;

  diff(entity: T) {
    const oldEntity = this.toPersistence(entity.clone());
    const newEntity = this.toPersistence(entity);
    return deepObjectDiff.diff(oldEntity, newEntity);
  }
}
