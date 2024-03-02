import { CURRENT_SCHEMA_VERSION } from '@/config';
import type { Channel, Cover, File, SongId, SongType } from '@/types';
import { Musicly } from '../../types';
import type { SavedSongMetadata } from '../../types/interfaces';
import SongData from '../classes/SongData';

export class SongAdapter implements SongType {
  channel: Channel;
  cover?: Cover | undefined;
  duration: { label: string; seconds: number };
  file?: File | undefined;
  id: string;
  name: string;
  published: string;
  thumbnail: string;
  version: number;
  views: { count: number; label: string };

  constructor(data: SavedSongMetadata) {
    this.channel = {
      name: data.channel.name,
      url: data.channel.url,
    };
    this.cover = data.musicly.flags.hasCover
      ? {
          name: data.musicly.cover.name,
          uri: data.musicly.cover.uri!,
        }
      : undefined;
    this.duration = {
      label: data.metadata.duration.simple_text,
      seconds: data.metadata.duration.seconds,
    };
    this.file = data.musicly.flags.isDownloaded
      ? {
          downloadedAt: data.musicly.file.downloadDate,
          id: data.musicly.file.id!,
          uri: data.musicly.file.path!,
          size: data.musicly.file.size!,
        }
      : undefined;
    this.id = data.id;
    this.name = data.title;
    this.published = data.metadata.published;
    this.thumbnail = data.metadata.thumbnails[0].url;
    this.version = data.musicly.version;
    this.views = {
      count: isNaN(parseInt(data.metadata.view_count)) ? 0 : parseInt(data.metadata.view_count),
      label: data.metadata.short_view_count_text.simple_text,
    };
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
          label: data.duration.label,
          seconds: data.duration.seconds,
          simple_text: '',
        },
        owner_badges: [],
        published: data.published,
        short_view_count_text: {
          accessibility_label: '',
          simple_text: '',
        },
        thumbnails: [{ height: 0, url: data.thumbnail, width: 0 }],
        view_count: '0',
        views: {
          count: data.views.count,
          label: data.views.label,
        },
      },
      musicly: {
        cover: {
          color: '#fff',
          name: data.cover?.name ?? '',
          uri: '',
        },
        file: {
          downloadDate: data.file?.downloadedAt ?? new Date(0),
          id: data.file?.id ?? '',
          path: data.file?.id ?? '',
          size: data.file?.size ?? 0,
        },
        flags: {
          hasCover: false,
          isDownloaded: !!data.file,
          isFavourite: false,
        },
        playListsIDs: [],
        version: data.version,
        wasPlayed: 0,
      },
      url: '',
      title: data.name,
    };
  }
}

export class SongModel extends Realm.Object<SongType, keyof Omit<SongType, 'cover' | 'file'>> {
  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      channel: 'Channel',
      file: 'File?',
      id: 'string',
      metadata: 'Metadata',
      url: 'string',
      title: 'string',
      version: 'int',
    },
  };

  channel!: Channel;
  cover?: Cover;
  duration!: {
    label: string;
    seconds: number;
  };
  file?: File;
  id!: SongId;
  name!: string;
  published!: string;
  thumbnail!: string;
  version!: number;
  views!: {
    count: number;
    label: string;
  };

  static generate({
    channel,
    duration,
    id,
    name,
    published,
    thumbnail,
    views,
  }: Omit<SongType, 'cover' | 'file' | 'version'>): SongType {
    return {
      channel,
      duration,
      id,
      name,
      published,
      thumbnail,
      version: CURRENT_SCHEMA_VERSION,
      views,
    };
  }
}
