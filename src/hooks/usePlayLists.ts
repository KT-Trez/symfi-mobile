import {useEffect, useState} from 'react';
import ResourceManager, {PlayList} from '../services/ResourceManager';
import useCompare from './useCompare';


function usePlayLists(): [boolean, PlayList[], () => Promise<void>, (extractor: (item: PlayList) => (Date | number | string), revers?: boolean) => void, (item: PlayList[]) => void] {
    const [isLoading, setIsLoading] = useState(false);
    const [playLists, setPlayLists] = useState<PlayList[]>([]);

    const getPlayLists = async () => {
        setIsLoading(true);
        setPlayLists(useCompare(await ResourceManager.PlayList.deserializeAll(), item => item.order));
        setIsLoading(false);
    };

    // ?? todo: fix
    const sortPlayLists = (extractor: (item: PlayList) => Date | number | string, revers?: boolean) => {
        setPlayLists(arr => {
            console.log('changing');
            return useCompare(arr, extractor, revers);
        });
    };

    useEffect(() => {
        getPlayLists();
    }, []);

    // ?? todo: fix
    useEffect(() => {
        console.log('new');
        console.log(playLists.map(p => p.id));
    }, [playLists]);

    return [isLoading, playLists, getPlayLists, sortPlayLists, setPlayLists];
}

export default usePlayLists;
