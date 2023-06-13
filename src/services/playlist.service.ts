import {Musicly} from '../../types';
import PlayListController from '../datastore/PlayListController';
import SongsController from '../datastore/SongsController';
import useAssetRemoval from '../hooks/useAssetRemoval';
import useRandomId from '../hooks/useRandomId';


export default class PlayListService {
    static async create(name: string) {
        const id = useRandomId();
        await PlayListController.store.insertAsync({
            id: id,
            cover: {
                name: id + '_cover_' + name,
                uri: undefined
            },
            flags: {
                hasCover: false
            },
            name,
            order: await PlayListController.countAsync({}),
            songsCount: 0,
            version: 1
        });
    }

    static async remove(id: string) {
        const songs = await SongsController.store.findAsync({'musicly.playListsIDs': id}) as Musicly.Data.Song[];
        for (const song of songs)
            await SongsController.removeFromPlayList(song.id, id);

        await PlayListController.store.removeAsync({id: id}, {});
    }

    static async removeCover(id: string, coverUri: string) {
        await useAssetRemoval(coverUri);
        await PlayListController.updateCover(id);
    }
}
