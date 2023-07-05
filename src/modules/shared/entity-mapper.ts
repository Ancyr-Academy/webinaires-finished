import { AbstractEntity, EntityType } from './entity';
import * as deepObjectDiff from 'deep-object-diff';

export interface IMapper<T> {
  toEntity(packet: any): T;
  toModel(entity: T): any;
  diff(entity: T): any;
}

export abstract class AbstractMapper<
  T extends AbstractEntity<any>,
  Schema extends Record<string, any>,
> implements IMapper<T>
{
  abstract toEntity(packet: Schema): T;
  abstract toModel(entity: T): Schema;

  diff(entity: T): Partial<EntityType<T>> {
    const oldSql = this.toModel(entity.cloneInitial());
    const newSql = this.toModel(entity);
    return deepObjectDiff.diff(oldSql, newSql);
  }
}
