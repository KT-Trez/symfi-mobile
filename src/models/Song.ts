import type { File, SongId, Thumbnail } from 'types';
import { SongType } from 'types';
import { Musicly } from '../../types';
import { SavedSongMetadata } from '../../types/interfaces';
import SongData from '../classes/SongData';

export class SongAdapter implements SongType {
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
  url: string;
  title: string;
  version: number;

  constructor(data: SavedSongMetadata) {
    this.channel = {
      name: data.channel.name,
      url: data.channel.url,
    };
    this.file = data.musicly.file.path
      ? {
          cover: {
            color: 'red',
            name: 'cover',
          },
          hasCover: false,
          download: {
            downloadedAt: data.musicly.file.downloadDate ?? new Date(0),
            id: data.musicly.file.id ?? '',
            path: data.musicly.file.path ?? '',
            size: data.musicly.file.size ?? 0,
          },
          isDownloaded: true,
        }
      : {
          cover: {
            color: 'red',
            name: 'cover',
          },
          hasCover: false,
          isDownloaded: false,
        };
    this.id = data.id;
    this.metadata = {
      duration: {
        label: data.metadata.duration.simple_text,
        seconds: data.metadata.duration.seconds,
      },
      published: data.metadata.published,
      thumbnail: data.metadata.thumbnails[0],
      views: {
        count: isNaN(parseInt(data.metadata.view_count)) ? 0 : parseInt(data.metadata.view_count),
        label: data.metadata.short_view_count_text.simple_text,
      },
    };
    this.url = data.url;
    this.title = data.title;
    this.version = data.musicly.version;
  }

  static intoMediaInfo(data: SongAdapter): Musicly.Api.MediaInfo & SongData {
    return {
      channel: {
        id: '',
        name: data.channel.name,
        url: data.channel.url,
      },
      description: '',
      id: data.id,
      metadata: {
        badges: [],
        duration: {
          accessibility_label: '',
          label: data.metadata.duration.label,
          seconds: data.metadata.duration.seconds,
          simple_text: '',
        },
        owner_badges: [],
        published: data.metadata.published,
        short_view_count_text: {
          accessibility_label: '',
          simple_text: '',
        },
        thumbnails: [data.metadata.thumbnail],
        view_count: '0',
        views: {
          count: data.metadata.views.count,
          label: data.metadata.views.label,
        },
      },
      musicly: {
        cover: {
          color: '#fff',
          name: data.title,
          uri: '',
        },
        file: {
          downloadDate: data.file.download?.downloadedAt ?? new Date(0),
          id: data.file.download?.id ?? '',
          path: data.file.download?.id ?? '',
          size: data.file.download?.size ?? 0,
        },
        flags: {
          hasCover: false,
          isDownloaded: data.file.isDownloaded,
          isFavourite: false,
        },
        playListsIDs: [],
        version: data.version,
        wasPlayed: 0,
      },
      url: data.url,
      title: data.title,
    };
  }
}
