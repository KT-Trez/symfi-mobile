import { ConfigItem } from '@/types';

export class ConfigItemModel extends Realm.Object<ConfigItem> {
  static schema: Realm.ObjectSchema = {
    name: 'ConfigItem',
    primaryKey: 'id',
    properties: {
      id: 'objectId',
      key: 'string',
      value: 'string',
    },
  };

  id!: string;
  key!: string;
  value!: string;

  static generate({ key, value }: Omit<ConfigItem, 'id'>): ConfigItem {
    return {
      id: new Realm.BSON.ObjectId(),
      key,
      value,
    };
  }
}
