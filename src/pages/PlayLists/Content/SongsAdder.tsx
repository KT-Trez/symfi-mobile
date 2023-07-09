import {MaterialIcons} from '@expo/vector-icons';
import moment from 'moment';
import {Box, Icon, Input, Modal, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {SavedSongMetadata} from '../../../../types/interfaces';
import SongsController from '../../../datastore/SongsController';
import useCompare from '../../../hooks/useCompare';


interface SongsAdderProps {
    close: () => void;
    isOpen: boolean;
    playListID: string;
    refreshPlayList: () => void;
}

function SongsAdder({close, playListID, refreshPlayList, isOpen}: SongsAdderProps) {
    const [isBlocked, setIsBlocked] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchedSongs, setSearchedSongs] = useState<SavedSongMetadata[]>([]);

    const [songs, setSongs] = useState<SavedSongMetadata[]>([]);

    const getSongs = useCallback(async () => {
        setSongs(useCompare(await SongsController.store.findAsync({$not: {'musicly.playListsIDs': playListID}}) as SavedSongMetadata[], item => item.musicly.file.downloadDate, true));
    }, []);

    const addToPlaylist = async (itemID: string) => {
        if (isBlocked)
            return;
        setIsBlocked(true);

        await SongsController.addToPlayList(itemID, playListID);

        setSearchedSongs(arr => arr.filter(song => song.id !== itemID));

        refreshPlayList();
        setIsBlocked(false);
    };

    useEffect(() => {
        setSearchedSongs([...songs.filter(song => song.title.toLowerCase().match(searchQuery.toLowerCase()) || song.channel.name.toLowerCase().match(searchQuery.toLowerCase()))]);
    }, [searchQuery]);

    useEffect(() => {
        if (isOpen) {
            getSongs();
            setSearchQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        setSearchedSongs([...songs]);
    }, [songs.length]);

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>Add Song To Playlist</Modal.Header>
                <Modal.Body>
                    <Input bg={'#fff'}
                           borderRadius={'4'}
                           fontSize={'md'}
                           InputLeftElement={
                               <Icon color='gray.400' m={2} ml={3} size='6' as={<MaterialIcons name='search'/>}/>
                           }
                           onChangeText={setSearchQuery}
                           placeholder={'Search Songs'}
                           px={'1'}
                           py={'3'}
                           value={searchQuery}
                           width='100%'
                    />

                    <Box mt={3}>
                        {searchedSongs.map(song =>
                            <TouchableOpacity key={song.id} onPress={() => addToPlaylist(song.id)}>
                                <Box bg={'gray.100'} mb={1} mt={1} p={2} rounded={'md'}>
                                    <Text fontSize={'xs'} textAlign={'right'}>
                                        {moment(song.musicly.file.downloadDate).format('HH:mm:ss • DD/MM/YYYY')}
                                    </Text>
                                    <VStack>
                                        <Text bold fontSize={'sm'} numberOfLines={2}>{`${song.title}\n`}</Text>
                                        <Text
                                            fontSize={'xs'}>{song.channel.name} • {song.metadata.duration.seconds}s
                                        </Text>
                                    </VStack>
                                </Box>
                            </TouchableOpacity>
                        )}

                        {searchedSongs.length === 0 &&
                            <Text fontSize={'md'} mb={3} textAlign={'center'}>No results.</Text>
                        }
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}

export default SongsAdder;
