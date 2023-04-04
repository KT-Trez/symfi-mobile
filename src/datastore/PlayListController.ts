import DataStore from 'react-native-local-mongodb';
import {PlaylistData} from '../../types/interfaces';
import DefaultDataStore from './Default';


export class PlayListDatabase extends DefaultDataStore {
	static _db: DataStore;
	static db = new PlayListDatabase().db;

	get db() {
		if (!PlayListDatabase._db)
			PlayListDatabase._db = this.initDataStore();
		return PlayListDatabase._db;
	}

	protected store = 'playlists';
}

export default class PlayListController extends PlayListDatabase {
	async decreaseSongsCount(playLists: PlaylistData[]) {
		for (const playList of playLists) {
			await this.db.updateAsync({id: playList.id}, {
				$inc: {
					songsCount: -1
				}
			}, {})
		}
	}

	async updateCover(playListID: string, uri?: string) {
		await this.db.update({id: playListID}, {
			$set: {
				'cover.uri': uri,
				'flags.hasCover': !!uri
			}
		}, {});
	}
}