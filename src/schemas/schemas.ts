import DefaultSchema from './defaultSchema';


export class PlaylistDatabase extends DefaultSchema {
	store = 'playlists';
}

export class SongsDatabase extends DefaultSchema {
	store = 'songs';
}