import { PageHeader, TextField } from '@components';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps } from '@types';
import { Divider } from 'native-base';
import { useCallback } from 'react';

export const CollectionForm = () => {
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();

  const createCollection = useCallback(
    (input: string) => {
      const name = input.length !== 0 ? input : `collection #0`;
      realm.write(() => {
        realm.create(CollectionModel.schema.name, CollectionModel.generate({ name }));
      });
      navigate('CollectionPage');
    },
    [navigate, realm],
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
