import DataStore from 'react-native-local-mongodb';
import {SavedSongMetadata} from '../../typings/interfaces';
import DefaultDataStore from './Default';


export class SongsDatabase extends DefaultDataStore {
	static _db: DataStore;
	static db = new SongsDatabase().db;

	get db() {
		if (!SongsDatabase._db)
			SongsDatabase._db = this.initDataStore();
		return SongsDatabase._db;
	}

	protected store = 'songs';
}

export default class SongsController extends SongsDatabase {
	async removePlayListFromSong(playListID: string, songID: string) {
		if (!this.db)
			throw new Error('Controller not initialized; Are you missing \'new\' keyword?');

		const song = await this.db.findOneAsync({id: songID}) as SavedSongMetadata;
		const playList = song.musicly.playlists.find(p => p.id === playListID);

		await this.db.updateAsync({id: songID}, {$pull: {'musicly.playlists': playList}}, {});
	}

	async updateCover(songID: string, uri?: string) {
		await this.db.update({id: songID}, {
			$set: {
				'musicly.cover.uri': uri,
				'musicly.flags.hasCover': !!uri
			}
		}, {});
	}
}