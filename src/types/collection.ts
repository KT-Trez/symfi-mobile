import type { SongId } from './song';

export type CollectionType = {
  cover: {
    alt: string;
  };
  id: CollectionId;
  name: string;
  order: number;
  songs: SongId[];
  version: number;
} & (CollectionWithCover | CollectionWithoutCover);

export type CollectionId = string;

type CollectionWithCover = {
  cover: {
    uri: string;
  };
  hasCover: true;
};

type CollectionWithoutCover = {
  cover: {
    uri?: undefined;
  };
  hasCover: false;
};

export type CollectionType_FINAL = {
  coverUri?: string;
  id: Realm.BSON.ObjectId;
  order: number;
  songs: SongId[];
  title: string;
  version: number;
};
