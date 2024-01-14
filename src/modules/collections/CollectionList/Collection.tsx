import { useNavigation } from '@react-navigation/native';
import { Avatar, Checkbox, HStack, Text, useColorModeValue, VStack } from 'native-base';
import React, { memo, useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import type { CollectionNavigatorProps, CollectionType } from 'types';
import { usePluralFormV2 } from '../../../hooks/usePluralFormV2';
import { useList } from '../context';

type CollectionProps = {
  item: CollectionType;
};

export const Collection = memo(({ item }: CollectionProps) => {
  const bgColor = useColorModeValue('light.200', 'light.700');
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const { selectListItem, selectedData, unselectListItem } = useList();
  const { s } = usePluralFormV2(item.songs.length);

  const onPress = useCallback(() => {
    if (selectedData.size === 0) {
      navigate('CollectionDetails', { id: item.id });
    } else {
      selectedData.has(item.id) ? unselectListItem(item) : selectListItem(item);
    }
  }, [item, navigate, selectListItem, selectedData, unselectListItem]);

  const onSelect = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        selectListItem(item);
      } else {
        unselectListItem(item);
      }
    },
    [item, selectListItem, unselectListItem],
  );

  useEffect(() => {
    console.log(new Date(), 'collection render');
  }, []);

  return (
    <TouchableOpacity onLongPress={() => onSelect(true)} onPress={onPress}>
      <HStack bgColor={bgColor} m={'auto'} mt={1} mb={1} rounded={'md'} w={'96%'}>
        <HStack alignItems={'center'} justifyContent={'center'} p={2} w={'20%'}>
          <Avatar bg={'secondary.700'} color={'red.50'} source={{ uri: item.cover.uri }}>
            {item.name[0].toUpperCase()}
          </Avatar>
        </HStack>

        <VStack alignItems={'flex-start'} p={2} w={'70%'}>
          <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
            {item.name}
          </Text>
          <Text color={'text.700'} fontSize={'xs'}>
            {`${item.songs.length} song${s}`}
          </Text>
        </VStack>
        <VStack justifyContent="center" width={5}>
          {selectedData.size > 0 && (
            <Checkbox
              accessibilityLabel={`checkbox`}
              isChecked={selectedData.has(item.id)}
              onChange={onSelect}
              rounded={'xl'}
              value={item.id}
            />
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
});
