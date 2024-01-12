import { Text, useColorModeValue, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import PlayListController from '../../datastore/PlayListController';
import { SongType } from '../../types';

type SongProps = {
  collectionId?: string;
  item: SongType;
  isOnList: boolean;
};

export const Song = ({
  collectionId,
  item: {
    channel: { name },
    file,
    id,
    metadata: { duration },
    title,
  },
  isOnList,
}: SongProps) => {
  const bgColor = useColorModeValue('light.200', 'light.700');
  const [isOnListState, setIsOnListState] = useState<boolean>(isOnList);

  const onPress = useCallback(async () => {
    if (!collectionId) {
      return;
    }

    if (isOnListState) {
      await PlayListController.store.updateAsync({ id: collectionId }, { $pull: { songs: id } });
      setIsOnListState(false);
    } else {
      await PlayListController.store.updateAsync({ id: collectionId }, { $push: { songs: id } });
      setIsOnListState(true);
    }
  }, [collectionId, id, isOnListState]);

  return (
    <TouchableOpacity onPress={onPress}>
      <VStack
        bgColor={bgColor}
        m={'auto'}
        mb={1}
        mt={1}
        opacity={isOnListState ? 0.5 : 1}
        p={4}
        pb={2}
        pt={2}
        rounded={'md'}
        w={'96%'}
      >
        <Text>
          Downloaded at:{' '}
          <Text bold color={'text.900'}>
            {new Intl.DateTimeFormat(window.navigator.language, {
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              month: '2-digit',
              weekday: 'long',
              year: 'numeric',
            }).format(new Date(file.download?.downloadedAt ?? 0))}
          </Text>
        </Text>

        <Text>
          Author:{' '}
          <Text bold color={'text.900'} isTruncated numberOfLines={1}>
            {name}
          </Text>
        </Text>

        <Text>
          Duration:{' '}
          <Text bold color={'text.900'}>
            {duration.label}
          </Text>
        </Text>

        <Text>
          Title:{' '}
          <Text bold color={'text.900'} isTruncated numberOfLines={2}>
            {title + '\n'}
          </Text>
        </Text>
      </VStack>
    </TouchableOpacity>
  );
};
