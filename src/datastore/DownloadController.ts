import DataStore from 'react-native-local-mongodb';
import DefaultDataStore from './Default';


export class DownloadDatabase extends DefaultDataStore {
	static _db: DataStore;
	static db = new DownloadDatabase().db;

	get db() {
		if (!DownloadDatabase._db)
			DownloadDatabase._db = this.initDataStore();
		return DownloadDatabase._db;
	}

	protected store = 'downloads';
}

export default class DownloadController extends DownloadDatabase {

}