import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {SavedSongMetadata, SongMetadata} from '../../typings/interfaces';
import SongData, {SongDataOptions} from '../classes/SongData';
import SongsController from '../datastore/SongsController';


class Net {
	static readonly remote = 'https://musicly-api.herokuapp.com';
}

class PlayList {

}

class Song extends SongData {
	private static storage = new SongsController();

	static async deserialize(id: string) {
		const song = await this.storage.db.findOneAsync({id}) as SavedSongMetadata;

		const options: SongDataOptions = {
			coverStats: song.musicly.cover,
			fileStats: song.musicly.flags.isDownloaded ? {
				id: song.musicly.file.id!,
				path: song.musicly.file.path!,
				size: song.musicly.file.size!
			} : undefined,
			isFavourite: song.musicly.flags.isFavourite,
			playLists: song.musicly.playlists
		};

		return new Song(song.id, song, options);
	}

	// instance
	constructor(id: string, metadata: SongMetadata, {coverStats, fileStats, isFavourite, playLists}: SongDataOptions) {
		super(id, metadata, {coverStats, fileStats, isFavourite, playLists});
	}

	private async downloadResource(type: 'audio' | 'cover', remoteURL?: string) {
		if (type === 'audio' && this.musicly.flags.isDownloaded)
			throw new Error('audio already downloaded');

		// todo: add resumable download
		const downloadURL = remoteURL ? remoteURL : ResourceManager.Net.remote + '/download/youtube?audioID=' + this.id;
		const fileExt = type === 'audio' ? '.wav' : '.png';
		return await FileSystem.downloadAsync(downloadURL, FileSystem.cacheDirectory + this.id + fileExt);
	}

	async getRemoteAudio(url?: string) {
		if (!this.musicly)
			throw new Error('song not deserialized');

		const {uri} = await this.downloadResource('audio', url);
		await this.saveAudio(uri);
		await this.updateAudioFileInDB();
	}

	async getRemoteCover(url: string) {
		if (!this.musicly)
			throw new Error('song not deserialized');

		const {uri} = await this.downloadResource('cover', url);
		await this.saveCover(uri);
		await this.updateCoverInDB();
	}

	private async saveAudio(uri: string) {
		if (this.musicly.flags.isDownloaded)
			try {
				await FileSystem.deleteAsync(this.musicly.file.path!);
			} catch (err) {
				const asset = await MediaLibrary.getAssetInfoAsync(this.musicly.file.id!);
				await MediaLibrary.deleteAssetsAsync(asset);
			}

		const asset = await MediaLibrary.createAssetAsync(uri);
		const {size} = await FileSystem.getInfoAsync(uri);

		this.musicly.file = {
			downloadDate: new Date(),
			id: asset.id,
			path: asset.uri,
			size
		};
		this.musicly.flags.isDownloaded = true;
	}

	private async saveCover(uri: string) {
		if (this.musicly.flags.hasCover)
			try {
				await FileSystem.deleteAsync(this.musicly.cover.uri!);
			} catch (err) {
				const asset = await MediaLibrary.getAssetInfoAsync(this.musicly.cover.uri!);
				await MediaLibrary.deleteAssetsAsync(asset);
			}

		const asset = await MediaLibrary.createAssetAsync(uri);
		const coverUri = FileSystem.documentDirectory + '/assets/' + this.id + '-thumbnail.png';

		await FileSystem.copyAsync({from: asset.uri, to: coverUri});
		await MediaLibrary.deleteAssetsAsync(asset);

		this.musicly.cover = {
			...this.musicly.cover,
			uri: coverUri
		};
		this.musicly.flags.hasCover = true;
	}

	private async updateAudioFileInDB() {
		await Song.storage.db.updateAsync({id: this.id}, {
			$set: {
				'musicly.file': this.musicly.file
			}
		});
	}

	private async updateCoverInDB() {
		await Song.storage.updateCover(this.id, this.musicly.cover.uri);
	}
}

export default class ResourceManager {
	static Net = Net;

	static PlayList = PlayList;
	static Song = Song;
}