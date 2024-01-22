import type { BaseListItem } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, HStack, Icon, Text, useTheme } from 'native-base';
import { FlatListProps } from 'react-native';

type ListProps<T extends BaseListItem> = {
  data: T[];
  emptyText?: string;
  isLoading: boolean;
  onRefresh?: FlatListProps<T>['onRefresh'];
  renderItem: FlatListProps<T>['renderItem'];
};

export const List = <T extends BaseListItem>({ data, emptyText, isLoading, onRefresh, renderItem }: ListProps<T>) => {
  const { space } = useTheme();

  return (
    <FlatList
      contentContainerStyle={{ gap: space[1], paddingBottom: space[2], paddingTop: space[2] }}
      data={data}
      keyExtractor={item => item.id}
      h={'100%'}
      // ItemSeparatorComponent={ItemSeparator}
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
