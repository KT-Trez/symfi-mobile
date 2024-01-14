export type File = (FileWithCover | FileWithoutCover) & (FileIsDownloaded | FileIsNotDownloaded);

type FileIsDownloaded = {
  download: {
    downloadedAt: Date;
    id: string;
    path: string;
    size: number;
  };
  isDownloaded: true;
};

type FileIsNotDownloaded = {
  download?: undefined;
  isDownloaded: false;
};

type FileWithCover = {
  cover: {
    color: string;
    name: string;
    uri: string;
  };
  hasCover: true;
};

type FileWithoutCover = {
  cover: {
    color: string;
    name: string;
  };
  hasCover: false;
};
