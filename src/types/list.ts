import { Realm } from '@realm/react';

export type BaseItem = {
  id: string | Realm.BSON.ObjectId;
  isSelected?: boolean;
};
