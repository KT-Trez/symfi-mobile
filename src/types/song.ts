import type { BaseItem, CollectionId } from '@types';

export type SongId = string;

export type SongType = {
  channel: Channel;
  collections: CollectionId[];
  cover?: Cover;
  duration: Duration;
  file?: File;
  id: SongId;
  name: string;
  published: string;
  thumbnail: string;
  version: number;
  views: Views;
};

export type SongTypeApi = Omit<SongType, 'collections' | 'cover' | 'file'>;

export type SongListItem = SongType & BaseItem;

// helper types
export type Channel = {
  name: string;
  url: string;
};

export type Cover = {
  name: string;
  uri: string;
};

export type Duration = {
  label: string;
  seconds: number;
};

export type File = {
  downloadedAt: Date;
  id: string;
  uri: string;
  size: number;
};

export type Views = {
  count: number;
  label: string;
};
