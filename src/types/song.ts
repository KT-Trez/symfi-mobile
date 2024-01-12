import type { File } from './file';

export type SongId = string;

export type SongType = {
  channel: {
    name: string;
    url: string;
  };
  file: File;
  id: SongId;
  metadata: {
    duration: {
      label: string;
      seconds: number;
    };
    published: string;
    thumbnail: Thumbnail;
    views: {
      count: number;
      label: string;
    };
  };
  title: string;
  url: string;
  version: number;
};

export type Thumbnail = {
  height: number;
  url: string;
  width: number;
};
