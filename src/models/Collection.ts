import { CURRENT_SCHEMA_VERSION } from '@config';
import { Realm } from '@realm/react';
import type { CollectionId, CollectionType, PartialByAndOmit } from '@types';

export class CollectionModel extends Realm.Object<CollectionType, keyof Omit<CollectionType, 'coverUri'>> {
  static schema: Realm.ObjectSchema = {
    name: 'Collection',
    primaryKey: 'id',
    properties: {
      coverUri: 'string?',
      id: 'objectId',
      name: 'string',
      order: 'int',
      version: 'int',
    },
  };

  coverUri?: string;
  id!: CollectionId;
  name!: string;
  order!: number;
  version!: number;

  static generate({
    coverUri,
    name,
    order,
  }: PartialByAndOmit<CollectionType, 'coverUri' | 'order', 'id' | 'version'>): CollectionType {
    return {
      coverUri,
      id: new Realm.BSON.ObjectId(),
      name: name,
      order: order ?? 0,
      version: CURRENT_SCHEMA_VERSION,
    };
  }
}
