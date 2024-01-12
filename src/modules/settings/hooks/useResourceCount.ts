import { useCallback, useEffect, useState } from 'react';
import PlayListController from '../../../datastore/PlayListController';
import SongsController from '../../../datastore/SongsController';

export const useResourceCount = () => {
  const [counts, setCounts] = useState<[number, number]>([0, 0]);

  const countResources = useCallback(async () => {
    setCounts([await PlayListController.countAsync({}), await SongsController.countAsync({})]);
  }, []);

  useEffect(() => {
    countResources();
  }, [countResources]);

  return {
    counts,
    recount: countResources,
  };
};
