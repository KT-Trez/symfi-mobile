import { RouteProp, useRoute } from '@react-navigation/native';
import { Divider, VStack } from 'native-base';
import { useCallback } from 'react';
import type { CollectionNavigatorParams } from 'types';
import { Loader, PageHeader, SongPicker, TextField } from '../../../components';
import { CoverSelector } from '../../../components/Settings';
import PlayListController from '../../../datastore/PlayListController';
import { useCollection, useImagePickerV2 } from '../../../hooks';

type CollectionEditRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionEdit'>;

export const CollectionEdit = () => {
  // constants
  const {
    params: { id },
  } = useRoute<CollectionEditRouteProp>();

  const { collection, isLoading, update } = useCollection(id);
  const { pickImage, removeImage } = useImagePickerV2();

  // methods
  const editCover = useCallback(async () => {
    const imageUri = await pickImage([1, 1]);
    if (!imageUri) {
      return;
    }
    await PlayListController.updateCover(id, imageUri);
  }, [id, pickImage]);

  const removeCover = useCallback(async () => {
    if (!collection?.hasCover) {
      return;
    }
    await removeImage(collection.cover.uri);
    await PlayListController.updateCover(id);
  }, [collection?.cover.uri, collection?.hasCover, id, removeImage]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <PageHeader subtitle={collection?.name} title="Edit Collection">
      <VStack h={'full'}>
        <CoverSelector coverUri={collection?.cover.uri} onEdit={editCover} onDelete={removeCover} />

        <Divider />
        <TextField clearOnUpdate initialValue={collection?.name} label="Name" onUpdate={name => update({ name })} />

        <Divider />
        <SongPicker collectionId={collection?.id} collectionSongs={collection?.songs} />
      </VStack>
    </PageHeader>
  );
};
