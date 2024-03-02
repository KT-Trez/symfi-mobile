export type SongId = string;

export type SongType = {
  channel: Channel;
  cover?: Cover;
  duration: {
    label: string;
    seconds: number;
  };
  file?: File;
  id: SongId;
  name: string;
  published: string;
  thumbnail: string;
  version: number;
  views: {
    count: number;
    label: string;
  };
};

// helper types
export type Channel = {
  name: string;
  url: string;
};

export type Cover = {
  name: string;
  uri: string;
};

export type File = {
  downloadedAt: Date;
  id: string;
  uri: string;
  size: number;
};
