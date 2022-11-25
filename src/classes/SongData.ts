import {PlaylistData, SavedSongMetadata, SongMetadata} from '../../typings/interfaces.js';
import config from '../config';


interface CoverStats {
	color: string;
	name?: string;
	uri?: string;
}

interface FileStats {
	id: string;
	path: string;
	size: number;
}

export interface SongDataOptions {
	coverStats?: CoverStats;
	fileStats?: FileStats;
	isFavourite?: boolean;
	playLists?: PlaylistData[];
}

export default class SongData implements SavedSongMetadata {
	channel: { id: string; name: string; url: string };
	description: string;
	id: string;
	metadata: { badges: []; duration: { accessibility_label: string; seconds: number; simple_text: string }; owner_badges: []; published: string; short_view_count_text: { accessibility_label: string; simple_text: string }; thumbnails: { height: number; url: string; width: number }[]; view_count: string };
	musicly: { cover: { color: string; name: string; uri: string | undefined }; file: { downloadDate: Date, id: string | undefined, path: string | undefined; size: number | undefined }; flags: { hasCover: boolean; isDownloaded: boolean; isFavourite: boolean }; playlists: PlaylistData[]; version: number; wasPlayed: number };
	title: string;
	url: string;

	constructor(id: string, metadata: SongMetadata, {coverStats, fileStats, isFavourite, playLists}: SongDataOptions) {
		this.channel = metadata.channel;
		this.description = metadata.description;
		this.id = id;
		this.metadata = metadata.metadata;

		this.musicly = {
			cover: {
				color: coverStats?.color ?? Math.floor(Math.random() * 16777215).toString(16),
				name: coverStats?.name ?? metadata.title + '-' + metadata.id,
				uri: coverStats?.name
			},
			file: {
				downloadDate: new Date(),
				id: fileStats?.id,
				path: fileStats?.path,
				size: fileStats?.size ?? 0
			},
			flags: {
				hasCover: !!coverStats?.uri,
				isDownloaded: !!fileStats,
				isFavourite: !!isFavourite
			},
			playlists: playLists ?? [],
			// todo: dynamically load version
			version: config.current_schema_version,
			wasPlayed: 0
		};

		this.title = metadata.title;
		this.url = metadata.url;
	}
}