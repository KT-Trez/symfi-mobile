import {HStack, Text, VStack} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Musicly} from '../../../types';
import {Song as SongC} from '../../services/ResourceManager';
import Thumbnail from './Thumbnail';


interface SongProps {
    bottomLabel: string;
    data: Musicly.Api.MediaInfo | SongC;
    imageURI?: string;
    selectOnLongPress?: (id: string) => void;
    selectOnPress?: (id: string) => void;
}

function Song({bottomLabel, data, imageURI, selectOnLongPress, selectOnPress}: SongProps) {
    const handleLongPress = () => { // song card's onLongPress handle
        if (selectOnLongPress)
            selectOnLongPress(data.id);
    };

    const handlePress = () => { // song card's onPress handle
        if (selectOnPress)
            selectOnPress(data.id);
    };

    return (<TouchableOpacity onLongPress={handleLongPress} onPress={handlePress}>
            <HStack bg={'primary.100'} m={'1'} rounded={'md'}>
                <Thumbnail id={data.id}
                           loadPlaceholder={!!imageURI} //@ts-ignore todo
                           timestamp={data.metadata.duration.label ?? data.metadata.duration.simple_text}
                           uri={imageURI}/>

                <VStack alignItems={'flex-start'} ml={2} pr={2} w={'60%'}>
                    <Text
                        bold
                        color={'text.900'}
                        fontSize={'md'}
                        isTruncated
                        numberOfLines={2}
                    >{data.title + '\n'}</Text>
                    <Text bold color={'text.900'} fontSize={'xs'}>{data.channel.name}</Text>
                    <Text color={'text.700'} fontSize={'xs'}>{bottomLabel} • {data.metadata.published}</Text>
                </VStack>
            </HStack>
        </TouchableOpacity>
    );
}

export default Song;
