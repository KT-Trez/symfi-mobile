import DataStore from 'react-native-local-mongodb';
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
	async updateCover(songID: string, uri?: string) {
		await this.db.update({id: songID}, {
			$set: {
				'musicly.cover.uri': uri,
				'musicly.flags.hasCover': !!uri
			}
		}, {});
	}
}