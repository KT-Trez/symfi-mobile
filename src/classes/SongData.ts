import {PlaylistData, SavedSongMetadata, SongMetadata} from '../../typings/interfaces.js';


interface FileStats {
	path: string;
	size: number;
}

interface SongDataOptions {
	fileStats?: FileStats;
	isFavourite?: boolean;
	playLists?: PlaylistData[];
}

export default class SongData implements SavedSongMetadata {
	channel: { id: string; name: string; url: string };
	description: string;
	id: string;
	metadata: { badges: []; duration: { accessibility_label: string; seconds: number; simple_text: string }; owner_badges: []; published: string; short_view_count_text: { accessibility_label: string; simple_text: string }; thumbnails: { height: number; url: string; width: number }[]; view_count: string };
	musicly: { cover: { color: string; name: string; uri: string | undefined }; file: { downloadDate: Date, path: string | undefined; size: number | undefined }; flags: { hasCover: boolean; isDownloaded: boolean; isFavourite: boolean }; playlists: PlaylistData[]; version: number; wasPlayed: number };
	title: string;
	url: string;

	constructor(metadata: SongMetadata, {fileStats, isFavourite, playLists}: SongDataOptions ) {
		this.channel = metadata.channel;
		this.description = metadata.description;
		this.id = metadata.id;
		this.metadata = metadata.metadata;

		this.musicly = {
			cover: {
				color: Math.floor(Math.random() * 16777215).toString(16),
				name: metadata.title + '-' + metadata.id,
				uri: undefined
			},
			file: {
				downloadDate: new Date(),
				path: fileStats?.path,
				size: fileStats?.size ?? 0
			},
			flags: {
				hasCover: false,
				isDownloaded: !!fileStats,
				isFavourite: !!isFavourite
			},
			playlists: playLists ?? [],
			version: 2,
			wasPlayed: 0
		};

		this.title = metadata.title;
		this.url = metadata.url;
	}
}