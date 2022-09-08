import DefaultDataStore from './Default';


export class PlayListDatabase extends DefaultDataStore {
	store = 'playlists';
}

export default class PlayListController extends PlayListDatabase {
	static db = new PlayListController().db;
}