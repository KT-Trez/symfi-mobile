import {PlaylistData} from './interfaces';


export declare module Musicly {
	export module Components {
		export type ManageDialogOptions = DeleteDialog | EditDialog;

		interface DeleteDialog {
			isDelete: true;
			isEdit?: boolean;
			message: string;
			title: string;
		}

		interface EditDialog {
			isDelete?: false;
			isEdit: true;
			message?: string;
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
			id: string;
			isFavourite: boolean;
			order: number;
			songID: string;
		}
	}
}