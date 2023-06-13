import {NavigationContext} from '@react-navigation/native';
import {Avatar, HStack, Text, VStack} from 'native-base';
import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {PlayList as CPlayList} from '../../../services/ResourceManager';


interface PlayListProps {
    item: CPlayList;
    openActions: (id: string) => void;
}

function PlayList({item, openActions}: PlayListProps) {
    const navigation = useContext(NavigationContext);

    const goToPlayList = () => navigation?.navigate('PlaylistContent', {id: item.id});

    return (
        <TouchableOpacity onPress={goToPlayList}
                          onLongPress={() => openActions(item.id)}>
            <HStack bg={'primary.100'} m={'auto'} mt={0.5} mb={0.5} rounded={'md'} w={'98%'}>
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

export default PlayList;
