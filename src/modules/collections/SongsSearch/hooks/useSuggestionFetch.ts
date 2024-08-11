import { DEFAULT_API_ORIGIN } from '@config';
import { useConstDebounce } from '@hooks';
import { ConfigItemModel } from '@models';
import { useObject } from '@realm/react';
import { useQuery } from '@tanstack/react-query';
import type { ApiError, CollectionFormat } from '@types';
import { API_ORIGIN, QueryKeys } from '@utils';

export const useSuggestionFetch = (query: string) => {
  const apiOrigin = useObject(ConfigItemModel, API_ORIGIN);
  const origin = apiOrigin?.value || DEFAULT_API_ORIGIN;

  const debouncedQuery = useConstDebounce(query, 700);

  const { data, isLoading } = useQuery<CollectionFormat<string>, ApiError>({
    enabled: debouncedQuery.length >= 3,
    queryFn: () => fetch(`${origin}/v3/song/suggestion?q=${debouncedQuery}`).then(res => res.json()),
    queryKey: [QueryKeys.SUGGESTIONS, debouncedQuery],
  });

  return {
    isLoading,
    suggestions: data?.objects || [],
  };
};
