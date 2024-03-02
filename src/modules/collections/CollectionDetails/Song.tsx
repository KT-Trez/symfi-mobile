import { SongCard, useAudioPlayer } from '@components';
import type { SongListItem } from '@types';
import { useMemo } from 'react';

type SongProps = {
  item: SongListItem;
};

export const Song = ({ item }: SongProps) => {
  const { addToQueue, currentSong } = useAudioPlayer();

  const size = useMemo<string>(
    () => `${Math.round(((item.file?.size ?? 0) / 1024 / 1024) * 100) / 100}MB`,
    [item.file?.size],
  );

  return (
    <SongCard
      bottomLabel={size}
      data={item}
      isHighlighted={currentSong?.id === item.id}
      onPress={() => addToQueue(item)}
    />
  );
};
