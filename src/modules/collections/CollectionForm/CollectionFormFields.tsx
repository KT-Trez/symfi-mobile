import { CoverInput, PageHeader } from '@components';
import { useImagePickerV2 } from '@hooks';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

type CollectionFormFieldsProps = {
  collectionName?: string;
  initialCoverUri?: string;
  initialName?: string;
  isEdit?: boolean;
  onSubmit: (coverUri: string, name: string) => void;
};

export const CollectionFormFields = ({
  collectionName,
  initialCoverUri,
  initialName,
  isEdit,
  onSubmit,
}: CollectionFormFieldsProps) => {
  const { pickImage, removeImage } = useImagePickerV2();
  const [coverUri, setCoverUri] = useState<string>(initialCoverUri || '');
  const [name, setName] = useState<string>(initialName || '');
  const { roundness } = useTheme();

  const editCover = useCallback(async () => {
    const imageUri = await pickImage([16, 9]);
    if (imageUri) {
      setCoverUri(imageUri);
    }
  }, [pickImage, setCoverUri]);

  const removeCover = useCallback(async () => {
    await removeImage(coverUri);
    setCoverUri('');
  }, [coverUri, removeImage, setCoverUri]);

  const submit = useCallback(() => {
    onSubmit(coverUri, name);
  }, [coverUri, name, onSubmit]);

  return (
    <PageHeader subtitle={collectionName} title={isEdit ? 'Edit Collection' : 'Create Collection'}>
      <View style={styles.container}>
        <TextInput mode="outlined" onChangeText={setName} placeholder="Title" style={styles.input} value={name} />

        <CoverInput coverUri={coverUri} gutterBottom onEdit={editCover} onRemove={removeCover} />

        <Button icon="music-note-plus" mode="outlined" onPress={submit} style={{ borderRadius: roundness }}>
          {isEdit ? 'Save' : 'Create'}
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
