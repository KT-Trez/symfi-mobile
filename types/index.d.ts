import {PlaylistData} from './interfaces';
import {PlayList} from '../src/services/ResourceManager';


export declare module Musicly {
	export module Api {
		export interface MediaInfo {
			channel: {
				id: string
				name: string
				url: string
			};
			description: string;
			id: string;
			metadata: {
				duration: {
					label: string;
					seconds: number;
				}
				published: string;
				thumbnails: Thumbnail[];
				views: {
					count: number;
					label: string;
				}
			};
			title: string;
		}

		export interface Thumbnail {
			height: number;
			url: string;
			width: number;
		}
	}

	export module Components {
		export interface ManageDialogOptions {
			isDelete?: boolean;
			isEdit?: boolean;
			isManage?: boolean;
			message?: string;
			playList?: PlayList;
			title?: string;
		}
	}

	export module Data {
		export interface SongMusicly {
			cover: {
				color: string;
				name: string;
				uri: string | undefined;
			},
			file: {
				downloadDate: Date;
				id: string | undefined;
				path: string | undefined;
				size: number | undefined;
			},
			flags: {
				hasCover: boolean;
				isDownloaded: boolean;
				isFavourite: boolean;
			},
			playlists: PlaylistData[];
			version: number;
			wasPlayed: number;
		}

		export interface SongPlayList {
			flags: {
				isFavourite: boolean;
			};
			id: string;
			order: number;
			songID: string;
		}
	}
}