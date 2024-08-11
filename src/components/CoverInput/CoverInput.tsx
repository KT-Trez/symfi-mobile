import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Cover } from '../Cover';

type CoverInputProps = {
  coverUri: string | undefined;
  gutterBottom?: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

export const CoverInput = ({ coverUri, gutterBottom, onEdit, onRemove }: CoverInputProps) => {
  return (
    <View style={[styles.container, { marginBottom: gutterBottom ? 8 : 0 }]}>
      <Cover text="PLACEHOLDER" uri={coverUri} width="50%" />

      <View style={styles.buttons}>
        <Button icon="pencil" mode="contained" onPress={onEdit} style={styles.button}>
          Edit
        </Button>
        <Button disabled={!coverUri} icon="delete" mode="contained" onPress={onRemove} style={styles.button}>
          Remove
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 130,
  },
  buttons: {
    alignItems: 'flex-end',
    gap: 8,
    justifyContent: 'center',
    width: '50%',
  },
  container: {
    flexDirection: 'row',
  },
});
