import AsyncStorage from '@react-native-async-storage/async-storage';
import {SavedSongMetadata} from '../../types/interfaces';
import SongPlayListData, {SongPlayListDataConstructor} from '../classes/SongPlayListData';
import config from '../config';
import SongsController from '../datastore/SongsController';
import {Store} from '../datastore/Store';


// !important: implement
const useSchemaUpdate = async () => {
	const songs = await SongsController.store.findAsync({}) as SavedSongMetadata[];

	if (await AsyncStorage.getItem('version') ?? '0' >= config.current_schema_version.toString())
		return;

	for (const song of songs) {
		// schema v1 and older
		if (!song.musicly.version || song.musicly.version <= 1) {
			await SongsController.store.updateAsync({id: song.id}, {
				$set: { // @ts-ignore
					'musicly.file.downloadDate': song.createdAt,
					'musicly.flags.isDownloaded': true,
					'musicly.version': 1
				}
			});
		}

		// schema v2 and older
		if (song.musicly.version <= 2) {
			await SongsController.store.updateAsync({id: song.id}, {
				$set: {
					'musicly.playListsIDs': []
				}
			});

			for (const playlist of song.musicly.playlists) {
				const options: SongPlayListDataConstructor = {
					flags: {
						isFavourite: playlist.isFavourite
					},
					order: playlist.order,
					playListID: playlist.id,
					songID: song.id
				};

				const songPlayList = new SongPlayListData(options);
				await Store.songPlayLists.insertAsync(songPlayList);
				try {
					await SongsController.store.updateAsync({id: song.id}, {
						$push: {
							'musicly.playListsIDs': playlist.id
						}
					});
				} catch (err) {
					console.error(err);
				} finally {
					console.info(`${playlist.id} done`);
				}
			}

			await SongsController.store.updateAsync({id: song.id}, {
				$set: {
					'musicly.version': config.current_schema_version
				},
				$unset: {
					'musicly.playlists': true
				}
			});
		}

		await AsyncStorage.setItem('version', config.current_schema_version.toString());
	}
};

export default useSchemaUpdate;