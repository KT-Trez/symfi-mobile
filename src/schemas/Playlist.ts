import Realm from 'realm';

const PlaylistSchema = {
	name: 'Playlist',
	primaryKey: '_id',
	properties: {
		_id: 'string',
		//cover: {
		//	name: 'string',
		//	uri: 'string',
		//},
		name: 'string',
		songs: 'int'
	}
};

(async () => {
	const realm = await Realm.open({
		path: 'myrealm',
		schema: [PlaylistSchema]
	})
})();