import type { SongType } from 'types';
import { SongCard, useAudioPlayer } from '../../../components';
import { SongAdapter } from '../../../models/Song';

type SongProps = {
  item: SongType;
};

export const Song = ({ item }: SongProps) => {
  const { addToQueue, currentSong } = useAudioPlayer();

  const sizeString = `${Math.round(((item.file.download?.size ?? 0) / 1024 / 1024) * 100) / 100}MB`;

  return (
    <SongCard
      bottomLabel={sizeString}
      data={SongAdapter.intoMediaInfo(item)}
      isHighlighted={currentSong?.id === item.id}
      onPress={() => addToQueue(item)}
    />
  );
};
