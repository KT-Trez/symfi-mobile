import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, HStack, Icon, Text } from 'native-base';
import React from 'react';
import { FlatListProps } from 'react-native';
import type { BaseListItem } from 'types';

type ListProps<T extends BaseListItem> = {
  data: T[];
  emptyText?: string;
  isLoading: boolean;
  onRefresh?: FlatListProps<T>['onRefresh'];
  renderItem: FlatListProps<T>['renderItem'];
};

export const List = <T extends BaseListItem>({ data, emptyText, isLoading, onRefresh, renderItem }: ListProps<T>) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
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
      pb={1}
      pt={1}
      refreshing={isLoading}
      renderItem={renderItem}
    />
  );
};
