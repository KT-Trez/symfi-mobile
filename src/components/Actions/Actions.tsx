import type { ActionType } from '@/components/Actions/types';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { Action } from './Action';

type ActionsProps = {
  actions: ActionType[];
  onBulkSelect?: () => void;
  onCancel?: () => void;
};

export const Actions = memo(({ actions, onBulkSelect, onCancel }: ActionsProps) => {
  const { colors } = useTheme();

  const hasBulkSelect = !!onBulkSelect;
  const hasCancel = !!onCancel;

  return (
    <View style={[{ justifyContent: hasBulkSelect ? 'space-between' : 'flex-end' }, styles.view]}>
      <View style={styles.bulkActionsView}>
        {hasBulkSelect && <IconButton iconColor={colors.onSurface} icon="select-all" onPress={onBulkSelect} />}
        {hasCancel && <IconButton iconColor={colors.onSurface} icon="cancel" onPress={onCancel} />}
      </View>

      <View style={styles.actionsView}>
        {actions.map((action, index) => (
          <Action item={action} key={index} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  actionsView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bulkActionsView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  view: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
