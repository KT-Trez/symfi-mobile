import { List, PageHeader } from '@components';
import { SongModel } from '@models';
import { useQuery } from '@realm/react';
import { useMemo, useState } from 'react';
import { useSongDownload, useSongFetch } from './hooks';
import { Song } from './Song';
import { SongSearchBar } from './SongSearchBar';

export const SongsSearchPage = () => {
  const downloadSong = useSongDownload();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, songs } = useSongFetch(searchQuery);

  const songsIds = useMemo<string[]>(() => songs.map(({ id }) => id), [songs]);
  const downloaded = useQuery(SongModel, songs => songs.filtered('id IN $0', songsIds), [songsIds]);

  const downloadedMap = useMemo<Record<string, boolean>>(
    () =>
      downloaded.reduce<Record<string, boolean>>((acc, { id }) => {
        acc[id] = true;

        return acc;
      }, {}),
    [downloaded],
  );

  return (
    <PageHeader subtitle="Powered by YouTube" title="Songs Downloader">
      <List.Content
        data={songs}
        emptyIcon="music-note"
        emptyText="Search online for music"
        Header={<SongSearchBar onSearch={setSearchQuery} />}
        isLoading={isLoading}
        renderItem={({ item }) => <Song download={downloadSong} isDownloaded={downloadedMap[item.id]} item={item} />}
      />
    </PageHeader>
  );
};
