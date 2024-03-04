import type { Action } from '@/components/Actions/types';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type ActionsProps = {
  actions: Action[];
  onBulkDeselect?: () => void;
  onBulkSelect?: () => void;
};

export const Actions = memo(({ actions, onBulkDeselect, onBulkSelect }: ActionsProps) => {
  const isVisible = useMemo<boolean>(() => actions.some(action => !action.isHidden), [actions]);

  return (
    <View style={styles.view}>
      {/*{isVisible && !!onBulkSelect && <IconButton icon="cancel" onPress={onBulkSelect} />}*/}

      {/*<HStack alignItems={'center'} justifyContent={'center'}>*/}
      {/*  {actions.map((action, index) => {*/}
      {/*    if (action.isHidden) {*/}
      {/*      return undefined;*/}
      {/*    }*/}

      {/*    if (action.isMenu) {*/}
      {/*      return (*/}
      {/*        <Menu*/}
      {/*          key={index}*/}
      {/*          trigger={triggerProps => (*/}
      {/*            <IconButton {...triggerProps} icon={<Icon as={MaterialCommunityIcons} name={action.icon} />} />*/}
      {/*          )}*/}
      {/*        >*/}
      {/*          {action.options.map((option, index) => (*/}
      {/*            <Menu.Item key={index} onPress={option.onPress}>*/}
      {/*              /!*<Icon as={MaterialCommunityIcons} name={option.icon} />*!/*/}
      {/*              {option.name}*/}
      {/*            </Menu.Item>*/}
      {/*          ))}*/}
      {/*        </Menu>*/}
      {/*      );*/}
      {/*    }*/}

      {/*    return (*/}
      {/*      <IconButton*/}
      {/*        icon={<Icon as={MaterialCommunityIcons} color={action.color || 'primary.500'} name={action.icon} />}*/}
      {/*        key={index}*/}
      {/*        onPress={action.onPress}*/}
      {/*      />*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</HStack>*/}
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
