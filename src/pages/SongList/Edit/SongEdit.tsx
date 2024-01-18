import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Button, Divider, HStack, Icon, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SavedSongMetadata } from '../../../../types/interfaces';
import { RootSongsStackParamList } from '../../../../types/navigation';
import { AppBar } from '../../../components/AppBar';
import { CoverSelector, TextSetting } from '../../../components/Settings';
import SongsController from '../../../datastore/SongsController';
import useImagePicker from '../../../hooks/useImagePicker';
import ResourceManager from '../../../services/ResourceManager';
import SongService from '../../../services/song.service';
import useSongUpdate from '../hooks/useSongUpdate';

type ProfileScreenRouteProp = RouteProp<RootSongsStackParamList, 'SongEdit'>;

function SongEdit() {
  // constants
  const route = useRoute<ProfileScreenRouteProp>();
  const songId = route.params?.id;

  // song metadata
  const [song, setSong] = useState<SavedSongMetadata | undefined>(undefined);

  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [title, setTitle] = useState('');
  const [views, setViews] = useState('');

  // updating
  const [isAuthorUpdating, updateAuthor] = useSongUpdate('author', song?.id, author);
  const [isPublishedUpdating, updatePublished] = useSongUpdate('published on', song?.id, published);
  const [isTitleUpdating, updateTitle] = useSongUpdate('title', song?.id, title);
  const [isViewsUpdating, updateViews] = useSongUpdate('views', song?.id, views);

  const [isCoverDownloading, setIsCoverDownloading] = useState(false);

  // methods
  const deleteCover = async () => {
    if (!song || !song.musicly.flags.hasCover) return;

    await SongService.removeCover(song.id, song.musicly.cover.uri!);
    await getSong();
  };

  const editCover = async () => {
    const [uri, isCanceled] = await useImagePicker(songId, [16, 9]);

    if (isCanceled) return;

    await SongsController.updateCover(songId, uri);
    await getSong();
  };

  const getYouTubeCover = async () => {
    setIsCoverDownloading(true);

    const songResource = await ResourceManager.Song.deserialize(songId);
    await songResource.getRemoteCover(song?.metadata.thumbnails[0].url!);

    setIsCoverDownloading(false);

    await getSong();
  };

  const getSong = async () => {
    setSong((await SongsController.store.findOneAsync({ id: songId })) as SavedSongMetadata);
  };

  // effects
  useEffect(() => {
    if (songId) getSong();
  }, []);

  useEffect(() => {
    if (song) {
      setAuthor(song.channel.name);
      setPublished(song.metadata.published);
      setTitle(song.title); // @ts-ignore
      if (song.metadata?.views?.label)
        // @ts-ignore
        setViews(song.metadata.views.label);
    }
  }, [song]);

  return (
    <>
      <AppBar subtitle={song?.title ?? ''} title={'Edit SongCard'} />

      <VStack bg={'primary.100'} h={'full'}>
        <CoverSelector coverUri={song?.musicly.cover.uri} onDelete={deleteCover} onEdit={editCover} />
        <HStack justifyContent={'flex-end'} m={1} mt={-1} p={2} pt={0} w={'100%'}>
          <Button.Group direction={'column'} w={'1/3'}>
            <Button
              isLoading={isCoverDownloading}
              onPress={getYouTubeCover}
              startIcon={<Icon as={MaterialCommunityIcons} name={'youtube'} size={6} />}
            >
              YouTube
            </Button>
          </Button.Group>
        </HStack>

        <Divider />
        <TextSetting
          isInvalid={author.length === 0}
          isSaving={isAuthorUpdating}
          name={'Author'}
          onSave={updateAuthor}
          onTextChange={setAuthor}
          value={author}
        />

        <Divider />
        <TextSetting
          isInvalid={published.length === 0}
          isSaving={isPublishedUpdating}
          name={'Published On'}
          onSave={updatePublished}
          onTextChange={setPublished}
          value={published}
        />

        <Divider />
        <TextSetting
          isInvalid={title.length === 0}
          isSaving={isTitleUpdating}
          name={'Title'}
          onSave={updateTitle}
          onTextChange={setTitle}
          value={title}
        />

        <Divider />
        <TextSetting
          isInvalid={views.length === 0}
          isSaving={isViewsUpdating}
          name={'Views'}
          onSave={updateViews}
          onTextChange={setViews}
          value={views}
        />
      </VStack>
    </>
  );
}

export default SongEdit;
