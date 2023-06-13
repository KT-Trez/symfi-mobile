import * as MediaLibrary from 'expo-media-library';
import {PermissionStatus} from 'expo-media-library';
import {Musicly} from '../../types';
import PlayListController from '../datastore/PlayListController';
import SongsController from '../datastore/SongsController';
import {Store} from '../datastore/Store';
import useAssetRemoval from '../hooks/useAssetRemoval';


export default class SongService {
    static async remove(id: string) {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if (status !== PermissionStatus.GRANTED)
            throw Error('missing media library permissions');

        // todo: update schema
        // todo: check if resource is downloaded
        // get song and it's file metadata
        const song = await SongsController.store.findOneAsync({id}) as Musicly.Data.Song;
        const asset = await MediaLibrary.getAssetInfoAsync(song.musicly.file.id!);

        // delete song and it's cover
        await MediaLibrary.deleteAssetsAsync(asset);
        if (song.musicly.flags.hasCover)
            await useAssetRemoval(song.musicly.cover.uri!);

        // decrease songsCount and remove from playLists
        await PlayListController.decreaseSongsCount(song.musicly.playListsIDs);
        await Store.songPlayLists.removeAsync({songID: id});

        // remove song from db
        await SongsController.store.removeAsync({id}, {});
    }

    static async removeFromPlayList(id: string, playListId: string) {
        await SongsController.removeFromPlayList(id, playListId);
        await PlayListController.store.updateAsync({id: playListId}, {$inc: {songsCount: -1}});
    }
}
