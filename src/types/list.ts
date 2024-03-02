import Realm from 'realm';

export type BaseItem = {
  id: string | Realm.BSON.ObjectId;
  isSelected: boolean;
};
