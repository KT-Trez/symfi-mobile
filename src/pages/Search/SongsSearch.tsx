import {MaterialIcons} from '@expo/vector-icons';
import {Box, FlatList, HStack, Icon, Input, Spinner, Text} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {Musicly} from '../../../types';
import {AppBar} from '../../components/AppBar';
import Song from '../../components/Song/Song';
import useOpen from '../../hooks/useOpen';
import ApiService from '../../services/api.service';
import SongActions from './SongActions';


function SongsSearch() {
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedSong, setSelectedSong] = useState<Musicly.Api.MediaInfo>();
    const [songs, setSongs] = useState<Musicly.Api.MediaInfo[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [hideActionSheet, actionSheetShows, showActionSheet] = useOpen([() => setSelectedSong(undefined)]);

    const fetchSongs = useCallback(async () => {
        if (!searchQuery || isLoading)
            return;

        setIsLoading(true);
        try {
            setSongs(await ApiService.searchSongs(searchQuery));
        } catch (err) {
            console.error(err);
            ToastAndroid.showWithGravity(`Server returned an error [${err ?? 'unknown'}]. Try again later`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery])

    // useDebounce(fetchSongs, 2500, [searchQuery]);

    useEffect(() => {
        if (selectedSong)
            showActionSheet();
    }, [selectedSong]);

    return (
        <>
            <AppBar subtitle={'Powered by YouTube'} title={'Search'}/>

            <Box bg={'primary.100'}>
                <Input bg={'#fff'}
                       borderRadius={'4'}
                       fontSize={'md'}
                       InputLeftElement={
                           <Icon color='gray.400' m={2} ml={3} size='6' as={<MaterialIcons name='search'/>}/>
                       }
                       m={'auto'}
                       mb={3}
                       mt={3}
                       onChangeText={setSearchQuery}
                       onSubmitEditing={fetchSongs}
                       placeholder={'Search Songs'}
                       px={'1'}
                       py={'3'}
                       value={searchQuery}
                       width='94%'
                />
            </Box>

            {isLoading ?
                <HStack alignItems={'flex-start'} bg={'primary.50'} h={'full'} justifyContent={'center'}>
                    <Spinner accessibilityLabel='Loading songs' size={'lg'}/>
                </HStack>
                :
                <FlatList bg={'primary.100'}
                          data={songs}
                          ListEmptyComponent={
                              <Text color={'gray.400'} fontSize={'xs'} mt={'2'} textAlign={'center'}>
                                  Use search bar to view results.
                              </Text>
                          }
                          keyExtractor={item => item.id}
                          renderItem={({item}) =>
                              <Song bottomLabel={item.metadata.views.label}
                                    data={item}
                                    imageURI={item.metadata.thumbnails[0].url}
                                    selectOnPress={() => setSelectedSong(item)}/>
                          }/>
            }

            <SongActions data={selectedSong}
                         hide={hideActionSheet}
                         isVisible={actionSheetShows}/>
        </>
    );
}

export default SongsSearch;
