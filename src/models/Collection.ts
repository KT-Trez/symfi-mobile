import { PlayList } from '@/services/ResourceManager';
import { BaseListItem, CollectionId, CollectionType_FINAL, SongId } from '@/types';
import { Realm } from '@realm/react';
import type { PlaylistMetadata } from '../../types/interfaces';

export class CollectionAdapter implements BaseListItem {
  cover: {
    alt: string;
    uri?: string;
  };
  hasCover: boolean;
  id: CollectionId;
  name: string;
  order: number;
  songs: SongId[];
  version: number;

  constructor(original: PlaylistMetadata) {
    this.cover = {
      alt: 'cover',
    };
    this.hasCover = false;
    this.id = '';
    this.name = '';
    this.songs = [];
    this.order = 0;
    this.version = -1;

    this.fromPLAYLIST_METADATA(original);
  }

  static fromPLAYLIST(data: PlayList, songs: string[]) {
    const ca = new CollectionAdapter(data);
    ca.songs = songs;
    return ca;
  }

  private fromPLAYLIST_METADATA(data: PlaylistMetadata) {
    this.cover = {
      alt: data.cover.name,
      uri: data.cover.uri,
    };
    this.hasCover = data.flags.hasCover;
    this.id = data.id;
    this.name = data.name;
    this.songs = [];
    this.order = data.order;
    this.version = data.version;
  }
}

export class CollectionModel extends Realm.Object<CollectionType_FINAL, keyof Omit<CollectionType_FINAL, 'coverUri'>> {
  static schema: Realm.ObjectSchema = {
    name: 'Collection',
    primaryKey: 'id',
    properties: {
      coverUri: 'string?',
      id: 'objectId',
      order: 'int',
      songs: 'string[]',
      title: 'string',
      version: 'int',
    },
  };

  coverUri?: string;
  id!: Realm.BSON.ObjectId;
  order!: number;
  songs!: SongId[];
  title!: string;
  version!: number;

  static generate({
    coverUri,
    order,
    title,
    version,
  }: Omit<CollectionType_FINAL, 'id' | 'songs'>): CollectionType_FINAL {
    return {
      coverUri,
      id: new Realm.BSON.ObjectId(),
      order,
      songs: [],
      title,
      version,
    };
  }
}
