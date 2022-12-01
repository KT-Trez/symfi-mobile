import {dbs} from './Store';
import SongPlayListData, {SongPlayListDataConstructor} from '../classes/SongPlayListData';


export default class TempSongController {
	public static async addToPlayList(songID: string, playListID: string) {
		const options: SongPlayListDataConstructor = {
			flags: {
				isFavourite: false
			},
			order: (await dbs.playLists.findOneAsync({id: playListID})).songsCount,
			playListID,
			songID
		};
		await dbs.songPlayLists.insertAsync(new SongPlayListData(options));

		await dbs.playLists.updateAsync({id: playListID}, {$inc: {songsCount: 1}}, {});
		await dbs.songs.updateAsync({id: songID}, {$push: {'musicly.playListsIDs': playListID}});
	}

	public static async removeFromPlayList(songID: string, playListID: string) {
		await dbs.songPlayLists.removeAsync({songID, playListID});
		await dbs.songs.updateAsync({id: songID}, {$pull: {'musicly.playListsIDs': playListID}});
	}
}