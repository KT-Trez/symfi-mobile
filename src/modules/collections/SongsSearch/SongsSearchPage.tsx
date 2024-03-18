import { List, PageHeader, SongCard } from '@components';
import { useState } from 'react';
import { useSongDownload, useSongFetch } from './hooks';
import { SongSearchBar } from './SongSearchBar';

export const SongsSearchPage = () => {
  const downloadSong = useSongDownload();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, songs } = useSongFetch(searchQuery);


  return (
    <PageHeader subtitle="Powered by YouTube" title="Songs Downloader">
      <List
        data={songs}
        emptyIcon="music-note"
        emptyText="Search online for music"
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
