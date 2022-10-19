import axios, {AxiosInstance} from 'axios';
import * as FileSystem from 'expo-file-system';
import {DownloadType} from '../../typings/enums';
import {PlaylistData, SongMetadata} from '../../typings/interfaces';
import SongData from '../classes/SongData';
import SongsController from '../datastore/SongsController';
import FileSystemService from './FileSystemService';


export default class NetService {
	private static readonly remote: string = 'https://musicly-api.herokuapp.com';
	private static readonly songsDB = new SongsController();

	// instance
	private readonly axios: AxiosInstance;
	private readonly baseUrl?: string;

	// todo: fix axios integration
	get REST() {
		return this.axios;
	}

	constructor(baseUrl?: string) {
		this.axios = axios.create({
			baseURL: baseUrl ?? NetService.remote,
			timeout: 20000
		});
		this.baseUrl = baseUrl;
	}

	async download(resourceType: DownloadType.Audio, metadata: SongMetadata, playLists?: PlaylistData[]): Promise<void>
	async download(resourceType: DownloadType, ...args: any[]): Promise<void> {
		switch (resourceType) {
			case DownloadType.Audio:
				await this.getAudio(args[0], args[1]);
				break;
			case DownloadType.Image:
				await this.getImage();
				break;
		}
	}

	private async getAudio(metadata: SongMetadata, playLists?: PlaylistData[]) {
		if (!await FileSystemService.getMediaLibraryPermission())
			return;

		// todo: add entry to download database

		const savePath = FileSystemService.audioCacheDir + metadata.id + '.wav';
		const {uri} = await FileSystem.downloadAsync((this.baseUrl ?? NetService.remote) + '/download/youtube?audioID=' + metadata.id, savePath);

		// todo: refactor saving to db; make it optional
		const assetMetadata = await FileSystemService.saveAsset(uri);
		const audio = new SongData(metadata.id, metadata, {
			fileStats: {
				id: assetMetadata.id,
				path: assetMetadata.uri,
				size: assetMetadata.size!
			},
			playLists
		});

		await NetService.songsDB.db.insertAsync(audio);
	}

	private async getImage() {
		// todo: implement
	}
}