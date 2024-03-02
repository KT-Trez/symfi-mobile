import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BaseItem } from '@types';
import { FlatList, HStack, Icon, Text, useTheme } from 'native-base';
import { useCallback } from 'react';
import { FlatListProps } from 'react-native';

type ListProps<T extends BaseItem> = {
  data: T[];
  emptyText?: string;
  isLoading: boolean;
  onRefresh?: FlatListProps<T>['onRefresh'];
  renderItem: FlatListProps<T>['renderItem'];
};

export const List = <T extends BaseItem>({ data, emptyText, isLoading, onRefresh, renderItem }: ListProps<T>) => {
  const { space } = useTheme();

  const keyExtractor = useCallback((item: T) => (typeof item.id === 'string' ? item.id : item.id.toHexString()), []);

  return (
    <FlatList
      contentContainerStyle={{ gap: space[1], paddingBottom: space[2], paddingTop: space[2] }}
      data={data}
      keyExtractor={keyExtractor}
      h={'100%'}
      ListEmptyComponent={
        <HStack alignItems="center" m={'auto'} mt={'5'}>
          <Text color="text.600" fontSize="sm" key={0}>
            {emptyText ?? 'No items found'}
          </Text>
          <Icon as={MaterialCommunityIcons} color="text.600" key={1} ml={1} name="emoticon-sad-outline" size="sm" />
        </HStack>
      }
      onRefresh={onRefresh}
      pl={2}
      pr={2}
      refreshing={isLoading}
      renderItem={renderItem}
    />
  );
};
