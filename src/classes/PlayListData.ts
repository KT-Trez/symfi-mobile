import {PlaylistMetadata} from '../../typings/interfaces';
import config from '../config';


interface Cover {
	name: string;
	uri: string | undefined;
}

interface PlayListFlags {
	hasCover: boolean;
}

export interface PlayListDataConstructor {
	cover?: Cover;
	flags?: PlayListFlags;
	id?: string;
	name: string;
	order: number;
	songsCount?: number;
	version?: number;
}

export default class PlayListData implements PlaylistMetadata {
	cover: { name: string; uri: string | undefined };
	flags: { hasCover: boolean };
	id: string;
	name: string;
	order: number;
	songsCount: number;
	version: number;

	constructor(options: PlayListDataConstructor) {
		this.cover = options.cover ?? {
			name: [options.name, parseInt(Math.round(Math.random() * 100).toString() + new Date().getTime()).toString(16)].join('-').replace(/\s*/, ''),
			uri: undefined
		};
		this.flags = options.flags ?? {
			hasCover: !!options.cover?.uri
		};
		this.id = options.id ?? parseInt(Math.round(Math.random() * 100).toString() + new Date().getTime()).toString(16);
		this.name = options.name;
		this.order = options.order;
		this.songsCount = options.songsCount ?? 0;
		this.version = options.version ?? config.current_schema_version;
	}
}