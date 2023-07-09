import React from 'react';
import {Musicly} from '../../../types';
import Song from '../../components/Song/Song';


interface SearchItemProps {
    item: Musicly.Api.MediaInfo;
    onPress: () => void;
}

function SearchItem({item, onPress}: SearchItemProps) {
    return (
        <>
            <Song bottomLabel={item.metadata.views.label}
                  data={item}
                  imageURI={item.metadata.thumbnails[0].url}
                  selectOnPress={onPress}
            />
        </>
    );
}

export default SearchItem;
