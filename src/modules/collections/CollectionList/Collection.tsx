import { Cover } from '@components';
import { usePluralFormV3 } from '@hooks';
import { CollectionModel, SongModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps } from '@types';
import { Text } from 'native-base';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

type CollectionProps = {
  isInSelectionMode: boolean;
  isSelected: boolean;
  item: CollectionModel;
  toggleSelect: (id: string, item: CollectionModel) => void;
};

export const Collection = memo(
  ({ isInSelectionMode, isSelected, item, toggleSelect }: CollectionProps) => {
    const { navigate } = useNavigation<CollectionNavigatorProps>();
    const { roundness } = useTheme();

    const songsCount = useMemo<number>(() => item.linkingObjects(SongModel.schema.name, 'collections').length, [item]);
    const s = usePluralFormV3(songsCount);

    const onLongPress = useCallback(() => {
      toggleSelect(item.id.toHexString(), item);
    }, [item, toggleSelect]);

    const onPress = useCallback(() => {
      isInSelectionMode
        ? toggleSelect(item.id.toHexString(), item)
        : navigate('CollectionDetails', { id: item.id.toHexString() });
    }, [isInSelectionMode, item, navigate, toggleSelect]);

    return (
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={onPress}
        style={[styles.container, { borderRadius: roundness }]}
      >
        <View style={styles.imageContainer}>
          <Cover uri={item.coverUri || undefined} />

          {isSelected && (
            <View style={[styles.icon, { borderRadius: roundness }]}>
              <Icon color="rgba(255, 255, 255, 0.9)" source="check-circle-outline" size={50} />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
            {item.name}
          </Text>
          <Text color={'text.700'} fontSize={'xs'}>
            {`${songsCount} song${s}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (itemA, itemB) => {
    const hasTheSameIsInSelectionModeState = itemA.isInSelectionMode === itemB.isInSelectionMode;
    const hasTheSameItem = itemA.item === itemB.item;
    const hasTheSameSelectedState = itemA.isSelected === itemB.isSelected;

    return hasTheSameIsInSelectionModeState && hasTheSameSelectedState && hasTheSameItem;
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '40%',
  },
  textContainer: {
    justifyContent: 'center',
    maxWidth: '60%',
    paddingHorizontal: 8,
  },
});
