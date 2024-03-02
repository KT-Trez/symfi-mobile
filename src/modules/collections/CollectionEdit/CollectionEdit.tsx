import { CollectionModel } from '@/models';
import { PageHeader, TextField } from '@components';
import { useImagePickerV2 } from '@hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Realm, useObject, useRealm } from '@realm/react';
import type { CollectionNavigatorParams } from '@types';
import { Divider, VStack } from 'native-base';
import { useCallback } from 'react';
import { CoverSelector } from '../../../components/Settings';

type CollectionEditRouteProp = RouteProp<CollectionNavigatorParams, 'CollectionEdit'>;

export const CollectionEdit = () => {
  // constants
  const {
    params: { id },
  } = useRoute<CollectionEditRouteProp>();

  const collection = useObject(CollectionModel, new Realm.BSON.ObjectId(id));
  const realm = useRealm();

  const { pickImage, removeImage } = useImagePickerV2();

  // methods
  const editCover = useCallback(async () => {
    const imageUri = await pickImage([1, 1]);
    if (!collection || !imageUri) return;

    realm.write(() => {
      collection.coverUri = imageUri;
    });
  }, [collection, pickImage, realm]);

  const removeCover = useCallback(async () => {
    console.log('removeCover', collection?.coverUri);
    if (!collection?.coverUri) return;

    await removeImage(collection.coverUri);
    realm.write(() => {
      collection.coverUri = undefined;
    });
  }, [collection, realm, removeImage]);

  const updateName = useCallback(
    (name: string) => {
      if (!collection || !name) return;

      realm.write(() => {
        collection.name = name;
      });
    },
    [collection, realm],
  );

  return (
    <PageHeader subtitle={collection?.name} title="Edit Collection">
      <VStack h={'full'}>
        <CoverSelector coverUri={collection?.coverUri} onEdit={editCover} onDelete={removeCover} />

        <Divider />
        <TextField initialValue={collection?.name} label="Name" onUpdate={updateName} />

        <Divider />
        {/*<SongPicker collectionId={collection?.id} collectionSongs={collection?.songs} />*/}
      </VStack>
    </PageHeader>
  );
};
