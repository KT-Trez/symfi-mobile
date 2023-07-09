import {NavigationContext} from '@react-navigation/native';
import {Avatar, HStack, Text, VStack} from 'native-base';
import React, {memo, useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {PlayList as CPlayList} from '../../../services/ResourceManager';


interface PlayListProps {
    item: CPlayList;
    selectOnPress: (id: string) => void;
}

function PlayList({item, selectOnPress}: PlayListProps) {
    const navigation = useContext(NavigationContext);

    const goToPlayList = () => navigation?.navigate('PlaylistContent', {id: item.id});

    const handleLongPress = () => {
        selectOnPress(item.id);
    };

    return (
        <TouchableOpacity onPress={goToPlayList}
                          onLongPress={handleLongPress}>
            <HStack bg={'primary.50'} m={'auto'} mt={1} mb={1} rounded={'md'} w={'96%'}>
                <HStack alignItems={'center'} justifyContent={'center'} w={'20%'}>
                    <Avatar bg={'gray.400'} source={{uri: item.cover.uri}}>
                        {item.name[0].toUpperCase()}
                    </Avatar>
                </HStack>

                <VStack alignItems={'flex-start'} p={2} w={'70%'}>
                    <Text bold
                          color={'text.900'}
                          fontSize={'md'}
                          isTruncated
                          numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                    <Text color={'text.700'} fontSize={'xs'}>
                        {item.songsCount} {item.songsCount !== 1 ? 'songs' : 'song'}
                    </Text>
                </VStack>
            </HStack>
        </TouchableOpacity>
    );
}

export default memo(PlayList);
