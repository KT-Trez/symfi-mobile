import React from 'react';
import { Musicly } from '../../../types';
import Song from '../../components/SongCard/SongCard';

interface SearchItemProps {
  item: Musicly.Api.MediaInfo;
  onPress: () => void;
}

function SearchItem({ item, onPress }: SearchItemProps) {
  return (
    <>
      <Song
        bottomLabel={item.metadata.views.label}
        data={item}
        imageUri={item.metadata.thumbnails[0].url}
        onPress={onPress}
      />
    </>
  );
}

export default SearchItem;
