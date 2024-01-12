import { Box, FormControl, Switch } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { SavedSongMetadata } from '../../../types/interfaces';
import SongsController from '../../datastore/SongsController';
import { SongAdapter } from '../../models/Song';
import { SongType } from '../../types';
import { List } from '../List';
import { Song } from './Song';

type SongPickerProps = {
  collectionId?: string;
  collectionSongs?: string[];
};

export const SongPicker = ({ collectionId, collectionSongs }: SongPickerProps) => {
  const [songChoice, setSongChoice] = useState<SongType[]>([]);
  const [songs, setSongs] = useState<SongType[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAdd = useCallback(
    async (isSwitched: boolean) => {
      if (isSwitched) {
        setSongChoice(songs.filter(song => !collectionSongs?.includes(song.id)));
      } else {
        setSongChoice(songs);
      }
    },
    [collectionSongs, songs],
  );

  const getSongs = useCallback(async () => {
    setIsLoading(true);

    const fetchedSongs = (await SongsController.store.findAsync({})) as SavedSongMetadata[];
    const mappedSongs = fetchedSongs.map(song => new SongAdapter(song));
    setSongs(mappedSongs);
    setSongChoice(mappedSongs);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  // todo: add search
  // todo: sort by date

  return (
    <Box>
      <FormControl m={1} p={2}>
        <FormControl.Label>Hide already added</FormControl.Label>
        <Switch onValueChange={onAdd} />
      </FormControl>

      <List
        data={songChoice}
        emptyText='No songs found. Try to add some from "Songs" tab.'
        isLoading={isLoading}
        onRefresh={getSongs}
        renderItem={({ item }) => (
          <Song collectionId={collectionId} item={item} isOnList={collectionSongs?.includes(item.id) ?? false} />
        )}
      />
    </Box>
  );
};
