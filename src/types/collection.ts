import { Realm } from '@realm/react';
import type { BaseItem } from '@types';

export type CollectionId = Realm.BSON.ObjectId;

export type CollectionType = {
  coverUri?: string;
  id: CollectionId;
  name: string;
  order: number;
  version: number;
};

export type CollectionListItem = CollectionType & BaseItem;
