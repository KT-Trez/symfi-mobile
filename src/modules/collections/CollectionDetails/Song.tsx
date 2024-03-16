import { SongCard, useAudioPlayer } from '@components';
import type { SongType } from '@types';
import { useMemo } from 'react';

type SongProps = {
  item: SongType;
};

export const Song = ({ item }: SongProps) => {
  const { currentSong, play } = useAudioPlayer();

  const size = useMemo<string>(
    () => `${Math.round(((item.file?.size ?? 0) / 1024 / 1024) * 100) / 100}MB`,
    [item.file?.size],
  );

  return (
    <SongCard bottomLabel={size} item={item} isHighlighted={currentSong?.id === item.id} onPress={() => play(item)} />
  );
};
