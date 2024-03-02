import { Realm } from '@realm/react';

export type ConfigItem = {
  id: Realm.BSON.ObjectId;
  key: string;
  value: string;
};
