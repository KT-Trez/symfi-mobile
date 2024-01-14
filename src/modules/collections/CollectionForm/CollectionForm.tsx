import { useNavigation } from '@react-navigation/native';
import { Divider } from 'native-base';
import { useCallback } from 'react';
import type { CollectionNavigatorProps } from 'types';
import { PageHeader, TextField } from '../../../components';
import PlayListController from '../../../datastore/PlayListController';
import PlayListService from '../../../services/playlist.service';
import { useList } from '../context';

export const CollectionForm = () => {
  const { reload } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();

  // todo: add validation ?
  const createCollection = useCallback(
    async (name: string) => {
      const collectionsCount = await PlayListController.countAsync({});
      await PlayListService.create(name.length !== 0 ? name : `collection #${collectionsCount + 1}`);
      await reload();
      navigate('CollectionPage');
    },
    [navigate, reload],
  );

  return (
    <PageHeader title="Create Collection">
      <TextField
        buttonIcon={false}
        buttonLabel="Create"
        label="Name"
        onUpdate={createCollection}
        placeholder="Cristina's music"
      />
      <Divider />
      {/* todo: add songs selector */}
    </PageHeader>
  );
};
