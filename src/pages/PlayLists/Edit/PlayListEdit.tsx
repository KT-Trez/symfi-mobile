import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Button, Divider, FormControl, Icon, Input, VStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { PlaylistMetadata } from '../../../../types/interfaces';
import { RootPlayListsStackParamList } from '../../../../types/navigation';
import { AppBar } from '../../../components/AppBar';
import { CoverSelector } from '../../../components/Settings';
import PlayListController from '../../../datastore/PlayListController';
import useImagePicker from '../../../hooks/useImagePicker';
import PlayListService from '../../../services/playlist.service';

type ProfileScreenRouteProp = RouteProp<RootPlayListsStackParamList, 'PlaylistEdit'>;

function PlayListEdit() {
  // constants
  const route = useRoute<ProfileScreenRouteProp>();
  const playListId = route.params?.id;

  // flags
  const [isSavingName, setIsSavingName] = useState(false);

  // playlist metadata
  const [name, setName] = useState('');
  const [playList, setPlayList] = useState<PlaylistMetadata | undefined>();

  // methods
  const deleteCover = async () => {
    if (!playList || !playList.flags.hasCover) return;

    await PlayListService.removeCover(playList.id, playList.cover.uri!);
    await getPlayList();
  };

  const editCover = async () => {
    const [uri, isCanceled] = await useImagePicker(playListId, [1, 1]);

    if (isCanceled) return;

    await PlayListController.updateCover(playListId, uri);
    await getPlayList();
  };

  const getPlayList = async () => {
    setPlayList((await PlayListController.store.findOneAsync({ id: playListId })) as PlaylistMetadata);
  };

  const saveName = useCallback(async () => {
    if (!name) return;
    setIsSavingName(true);

    await PlayListController.store.updateAsync({ id: playListId }, { $set: { name: name } }, {});
    await getPlayList();

    setIsSavingName(false);
  }, [name]);

  // effects
  useEffect(() => {
    if (playListId) getPlayList();
  }, []);

  useEffect(() => {
    if (playList) setName(playList.name);
  }, [playList]);

  return (
    <>
      <AppBar subtitle={playList?.name ?? ''} title={'Edit Playlist'} />

      <VStack bg={'primary.100'} h={'full'}>
        <CoverSelector coverUri={playList?.cover.uri} onEdit={editCover} onDelete={deleteCover} />

        <Divider />

        <FormControl m={1} p={2}>
          <FormControl.Label>Name</FormControl.Label>
          <Input
            InputRightElement={
              <Button
                h={'full'}
                isLoading={isSavingName}
                onPress={saveName}
                rounded={'none'}
                startIcon={<Icon as={MaterialCommunityIcons} name={'content-save-outline'} size={6} />}
                w={'1/3'}
              >
                Save
              </Button>
            }
            onChangeText={setName}
            size={'md'}
            variant={'filled'}
            value={name}
          />
        </FormControl>

        <Divider />
      </VStack>
    </>
  );
}

export default PlayListEdit;
