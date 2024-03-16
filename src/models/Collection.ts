import { Realm } from '@realm/react';
import type { CollectionId, CollectionType, PartialByAndOmit } from '@types';
import { SongModel } from './Song';

type GeneratedCollectionType = Pick<CollectionType, 'coverUri' | 'name'>;

export class CollectionModel extends Realm.Object<CollectionType, Exclude<keyof CollectionType, 'coverUri'>> {
  static schema: Realm.ObjectSchema = {
    name: 'Collection',
    primaryKey: 'id',
    properties: {
      coverUri: 'string?',
      id: {
        default: new Realm.BSON.ObjectId(),
        type: 'objectId',
      },
      name: 'string',
      order: {
        default: 0,
        type: 'int',
      },
      songs: {
        objectType: SongModel.schema.name,
        property: 'collections',
        type: 'linkingObjects',
      },
    },
  };

  coverUri?: string;
  id!: CollectionId;
  name!: string;
  order!: number;

  static generate({
    coverUri,
    name,
  }: PartialByAndOmit<CollectionType, 'coverUri', 'id' | 'order' | 'songs'>): GeneratedCollectionType {
    return {
      coverUri,
      name,
    };
  }
}
