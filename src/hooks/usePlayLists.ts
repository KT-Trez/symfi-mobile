import { useCallback, useEffect, useState } from 'react';
import ResourceManager, { PlayList } from '../services/ResourceManager';
import useCompare from './useCompare';

function usePlayLists(): [
  boolean, PlayList[], () => Promise<void>, (
    extractor: (item: PlayList) => (Date | number | string), revers?: boolean) => void, (item: PlayList[]) => void
] {
  const [isLoading, setIsLoading] = useState(false);
  const [playLists, setPlayLists] = useState<PlayList[]>([]);

  const getPlayLists = useCallback(async () => {
    setIsLoading(true);
    setPlayLists(useCompare(await ResourceManager.PlayList.deserializeAll(), item => item.order));
    setIsLoading(false);
  }, []);

  // ?? todo: fix
  // const sortPlayLists = useCallback((extractor: (item: PlayList) => Date | number | string, revers?: boolean) => {
  //     setPlayLists(arr => {
  //         console.log('changing');
  //         return useCompare(arr, extractor, revers);
  //     });
  // }, [collections]);

  const sortPlayLists = (extractor: (item: PlayList) => Date | number | string, revers?: boolean) => {
    console.log('sort', extractor);
    console.log(playLists.map(p => p.id));
    const temp = useCompare(playLists, extractor, revers);
    console.log(temp.map(p => p.id));
    setPlayLists(temp);

    // setPlayLists(useCompare(collections, extractor, revers));
  };

  // ?? todo: fix
  useEffect(() => {
    console.log('new', new Date().getTime());
    console.log(playLists.map(p => p.id));
  }, [playLists.map(p => p.id)]);

  useEffect(() => {
    getPlayLists();
  }, []);

  return [isLoading, playLists, getPlayLists, sortPlayLists, setPlayLists];
}

export default usePlayLists;
