import { DEFAULT_API_ORIGIN } from '@config';
import { ConfigItemModel } from '@models';
import { useObject } from '@realm/react';
import { useQuery } from '@tanstack/react-query';
import type { ApiError, CollectionFormat, SongTypeApi } from '@types';
import { API_ORIGIN, QueryKeys } from '@utils';

export const useSongFetch = (query: string) => {
  const customOrigin = useObject(ConfigItemModel, API_ORIGIN);
  const origin = customOrigin?.value || DEFAULT_API_ORIGIN;

  const { data, isLoading } = useQuery<CollectionFormat<SongTypeApi>, ApiError>({
    enabled: !!query,
    queryFn: () => fetch(`${origin}/v3/song/search?q=${query}`).then(res => res.json()),
    queryKey: [QueryKeys.SONGS, query],
  });

  return {
    isLoading,
    songs: data?.objects || [],
  };
};
