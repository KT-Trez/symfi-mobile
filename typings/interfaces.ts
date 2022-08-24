export interface PlaylistMetadata {
	_id: string;
	cover: {
		name: string;
		uri?: string;
	}
	name: string;
	songs: number;
}

export interface SongMetadata {
	channel: {
		id: string;
		name: string;
		url: string;
	}
	description: string;
	id: string;
	metadata: {
		badges: [];
		duration: {
			accessibility_label: string;
			seconds: number;
			simple_text: string;
		}
		owner_badges: [];
		published: string;
		short_view_count_text: {
			accessibility_label: string;
			simple_text: string;
		}
		thumbnails: {
			height: number;
			url: string;
			width: number;
		}[];
		view_count: string;
	}
	path?: string;
	playlistsIDs?: string[];
	size?: number;
	title: string;
	url: string;
}