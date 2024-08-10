import { CoverInput, PageHeader } from '@components';
import { useImagePickerV2 } from '@hooks';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import type { CollectionNavigatorProps, CollectionType } from '@types';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

export const CollectionForm = () => {
  const { pickImage, removeImage } = useImagePickerV2();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const realm = useRealm();
  const [coverUri, setCoverUri] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { roundness } = useTheme();

  const createCollection = useCallback(() => {
    const collection: Partial<CollectionType> = {
      coverUri: coverUri || undefined,
      name: name || 'New Collection',
    };

    realm.write(() => {
      realm.create(CollectionModel.schema.name, collection);
    });

    navigate('CollectionPage');
  }, [coverUri, name, navigate, realm]);

  const editCover = useCallback(async () => {
    const imageUri = await pickImage([16, 9]);
    if (imageUri) {
      setCoverUri(imageUri);
    }
  }, [pickImage]);

  const removeCover = useCallback(async () => {
    await removeImage(coverUri);
    setCoverUri('');
  }, [coverUri, removeImage]);

  return (
    <PageHeader title="Create Collection">
      <View style={styles.container}>
        <TextInput mode="outlined" onChangeText={setName} placeholder="Title" style={styles.input} value={name} />

        <CoverInput coverUri={coverUri} gutterBottom onEdit={editCover} onDelete={removeCover} />

        <Button icon="music-note-plus" mode="outlined" onPress={createCollection} style={{ borderRadius: roundness }}>
          Create
        </Button>
      </View>
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  input: {
    marginBottom: 8,
  },
});
