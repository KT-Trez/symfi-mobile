import { Actions, PageHeader } from '@components';
import { usePluralFormV3 } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps } from '@types';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { CollectionList, usePageHeaderActions } from './CollectionList';
import { useList } from './context';

export const CollectionPage = () => {
  const actions = usePageHeaderActions();
  const { isInSelectionMode, items, selectAllItems, unselectAllItems } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const s = usePluralFormV3(items.length);
  const [isBulkSelected, setIsBulkSelected] = useState<boolean>(false);

  const handleCancelBulkSelect = useCallback(() => {
    setIsBulkSelected(false);
    unselectAllItems(true);
  }, [unselectAllItems]);

  const onBulkSelect = useCallback(() => {
    isBulkSelected ? unselectAllItems() : selectAllItems();
    setIsBulkSelected(prev => !prev);
  }, [isBulkSelected, selectAllItems, unselectAllItems]);

  const areActionsVisible = isBulkSelected || isInSelectionMode;

  return (
    <PageHeader
      actions={
        areActionsVisible && <Actions actions={actions} onBulkSelect={onBulkSelect} onCancel={handleCancelBulkSelect} />
      }
      subtitle={`${items.length} item${s}`}
      title="Collections"
    >
      <CollectionList />
      <FAB icon="plus" onPress={() => navigate('CollectionForm')} style={styles.fab} />
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
