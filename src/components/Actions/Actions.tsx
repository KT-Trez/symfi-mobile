import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Action } from './Action';
import type { ActionType } from './types';

type ActionsProps = {
  actions: ActionType[];
};

export const Actions = memo(({ actions }: ActionsProps) => (
  <View style={styles.container}>
    {actions.map((action, index) => (
      <Action item={action} key={index} />
    ))}
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
