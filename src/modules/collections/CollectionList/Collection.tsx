import { usePluralFormV2 } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import type { CollectionListItem, CollectionNavigatorProps } from '@types';
import { Avatar, Checkbox, HStack, Text, useColorModeValue, VStack } from 'native-base';
import { memo, useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useList } from '../context';

type CollectionProps = {
  item: CollectionListItem;
};

export const Collection = memo(({ item }: CollectionProps) => {
  const bgColor = useColorModeValue('light.200', 'light.700');
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const { isInSelectionMode, items, selectItem, unselectItem } = useList();
  const { s } = usePluralFormV2(items.length);

  const onLongPress = useCallback(() => {
    selectItem(item);
  }, [item, selectItem]);

  const onPress = useCallback(() => {
    if (!isInSelectionMode) {
      navigate('CollectionDetails', { id: item.id.toHexString() });
    } else {
      item.isSelected ? unselectItem(item) : selectItem(item);
    }
  }, [isInSelectionMode, item, navigate, selectItem, unselectItem]);

  const onSelect = useCallback(
    (newIsSelected: boolean) => {
      newIsSelected ? selectItem(item) : unselectItem(item);
    },
    [item, selectItem, unselectItem],
  );

  useEffect(() => {
    console.log(new Date(), 'collection render');
  });

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
      <HStack bgColor={bgColor} rounded={'md'}>
        <HStack alignItems={'center'} justifyContent={'center'} p={2} w={'20%'}>
          <Avatar bg={'secondary.700'} color={'red.50'} source={{ uri: item?.coverUri }}>
            {item.name[0].toUpperCase()}
          </Avatar>
        </HStack>

        <VStack alignItems={'flex-start'} p={2} w={'70%'}>
          <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
            {item.name}
          </Text>
          <Text color={'text.700'} fontSize={'xs'}>
            {`${NaN} song${s}`}
          </Text>
        </VStack>
        <VStack justifyContent="center" width={5}>
          {isInSelectionMode && (
            <Checkbox
              accessibilityLabel={`checkbox`}
              isChecked={item.isSelected}
              onChange={onSelect}
              rounded={'xl'}
              value={item.id.toHexString()}
            />
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
});
