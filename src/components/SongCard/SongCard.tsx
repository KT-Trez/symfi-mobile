import type { BaseItem, SongType, SongTypeApi } from '@types';
import { HStack, Text, useColorModeValue, VStack } from 'native-base';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Thumbnail } from './Thumbnail';

interface SongCardProps {
  bottomLabel: string;
  imageUri?: string;
  item: (SongType | SongTypeApi) & BaseItem;
  isHighlighted?: boolean;
  onLongPress?: (id: string) => void;
  onPress?: (id: string) => void;
}

export const SongCard = memo(
  ({ bottomLabel, imageUri, item, isHighlighted, onLongPress, onPress }: SongCardProps) => {
    const bgColor = useColorModeValue('light.200', 'light.700');

    const onLongPressHandler = () => {
      // song card's onLongPress handle
      if (onLongPress) onLongPress(item.id);
    };

    const onPressHandler = () => {
      // song card's onPress handle
      if (onPress) onPress(item.id);
    };

    return (
      <TouchableOpacity onLongPress={onLongPressHandler} onPress={onPressHandler}>
        <HStack bgColor={isHighlighted ? 'primary.200' : bgColor} m={'auto'} rounded={'md'}>
          <Thumbnail id={item.id} loadPlaceholder={!imageUri} timestamp={item.duration.label} uri={imageUri} />

          <VStack alignItems={'flex-start'} ml={2} pr={2.5} w={'60%'}>
            <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
              {item.name + '\n'}
            </Text>
            <Text bold color={'text.900'} fontSize={'xs'}>
              {item.channel.name}
            </Text>
            <Text color={'text.700'} fontSize={'xs'}>
              {bottomLabel} • {item.published}
            </Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  },
  (prevProps, newProps) => prevProps.isHighlighted === newProps.isHighlighted,
);
