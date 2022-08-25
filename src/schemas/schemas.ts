import DefaultSchema from './defaultSchema';


export class PlaylistDatabase {
	static database: DefaultSchema | undefined;

	static getInstance() {
		if (!PlaylistDatabase.database)
			PlaylistDatabase.database = new DefaultSchema('playlists');
		return PlaylistDatabase.database;
	}
}

export class SongsDatabase {
	static database: DefaultSchema | undefined;

	static getInstance() {
		if (!SongsDatabase.database)
			SongsDatabase.database = new DefaultSchema('songs');
		return SongsDatabase.database;
	}
}