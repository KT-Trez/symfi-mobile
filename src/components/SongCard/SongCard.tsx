import { HStack, Text, useColorModeValue, VStack } from 'native-base';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Musicly } from '../../../types';
import { Song as SongC } from '../../services/ResourceManager';
import { Thumbnail } from './Thumbnail';

interface SongProps {
  bottomLabel: string;
  data: Musicly.Api.MediaInfo | SongC;
  imageUri?: string;
  isHighlighted?: boolean;
  onLongPress?: (id: string) => void;
  onPress?: (id: string) => void;
}

export const SongCard = memo(
  ({ bottomLabel, data, imageUri, isHighlighted, onLongPress, onPress }: SongProps) => {
    const bgColor = useColorModeValue('light.200', 'light.700');

    const onLongPressHandler = () => {
      // song card's onLongPress handle
      if (onLongPress) {
        onLongPress(data.id);
      }
    };

    const onPressHandler = () => {
      // song card's onPress handle
      if (onPress) {
        onPress(data.id);
      }
    };

    return (
      <TouchableOpacity onLongPress={onLongPressHandler} onPress={onPressHandler}>
        <HStack bgColor={isHighlighted ? 'primary.200' : bgColor} m={'auto'} mb={1} mt={1} rounded={'md'} w={'96%'}>
          <Thumbnail
            id={data.id}
            // todo: fix ts silencers
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            loadPlaceholder={!!imageUri} //@ts-expect-error
            timestamp={data.metadata.duration.label ?? data.metadata.duration.simple_text}
            uri={imageUri}
          />

          <VStack alignItems={'flex-start'} ml={2} pr={2.5} w={'60%'}>
            <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
              {data.title + '\n'}
            </Text>
            <Text bold color={'text.900'} fontSize={'xs'}>
              {data.channel.name}
            </Text>
            <Text color={'text.700'} fontSize={'xs'}>
              {bottomLabel} • {data.metadata.published}
            </Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  },
  (prevProps, newProps) => prevProps.data.id === newProps.data.id && prevProps.isHighlighted === newProps.isHighlighted,
);

export default SongCard;
