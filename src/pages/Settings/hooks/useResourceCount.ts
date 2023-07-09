import {useCallback, useEffect, useState} from 'react';
import PlayListController from '../../../datastore/PlayListController';
import SongsController from '../../../datastore/SongsController';


function useResourceCount(): [playListsCount: number, songsCount: number, recount: () => Promise<void>] {
    const [counts, setCounts] = useState<[number, number]>([0, 0]);

    const countResources = useCallback(async () => {
        setCounts([
            await PlayListController.countAsync({}),
            await SongsController.countAsync({})
        ]);
    }, []);

    useEffect(() => {
        countResources();
    }, []);

    return [...counts, countResources];
}

export default useResourceCount;
