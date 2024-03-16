import { List, PageHeader, SongCard } from '@components';
import { useState } from 'react';
import { useSongDownload, useSongFetch } from './hooks';
import { SongSearchBar } from './SongSearchBar';

export const SongsSearchPage = () => {
  const downloadSong = useSongDownload();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, songs } = useSongFetch(searchQuery);

  // todo: add loading state
  // todo: add empty text

  return (
    <PageHeader subtitle="Powered by YouTube" title="Songs Downloader">
      <List
        data={songs}
        Header={<SongSearchBar onSearch={setSearchQuery} />}
        isLoading={isLoading}
        renderItem={({ item }) => (
          <SongCard
            bottomLabel={item.views.label}
            item={item}
            imageUri={item.thumbnail}
            onPress={() => downloadSong(item)}
          />
        )}
      />
    </PageHeader>
  );
};
