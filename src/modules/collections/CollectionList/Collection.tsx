import { usePluralFormV3 } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import type { CollectionListItem, CollectionNavigatorProps } from '@types';
import { Text } from 'native-base';
import { memo, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { useList } from '../context';

type CollectionProps = {
  item: CollectionListItem;
};

export const Collection = memo(
  ({ item }: CollectionProps) => {
    const { navigate } = useNavigation<CollectionNavigatorProps>();
    const { isInSelectionMode, items, selectItem, unselectItem } = useList();
    const s = usePluralFormV3(items.length);
    const { colors } = useTheme();

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

    useEffect(() => {
      console.log(new Date(), 'collection render', item.id, item.isSelected);
    });

    return (
      <TouchableOpacity onLongPress={onLongPress} onPress={onPress} style={styles.touchableOpacity}>
        <View>
          {item.isSelected ? (
            <Avatar.Icon
              color={colors.secondaryContainer}
              icon="check"
              style={[{ borderColor: colors.secondaryContainer }, styles.icon]}
            />
          ) : item.coverUri ? (
            <Avatar.Image source={{ uri: item.coverUri }} />
          ) : (
            <Avatar.Text label={item.name[0].toUpperCase()} />
          )}
        </View>

        <View style={styles.descriptionView}>
          <Text bold color={'text.900'} fontSize={'md'} isTruncated numberOfLines={2}>
            {item.name}
          </Text>
          <Text color={'text.700'} fontSize={'xs'}>
            {`${0} song${s}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  ({ item: itemA }, { item: itemB }) =>
    itemA.id.toHexString() === itemB.id.toHexString() && itemA.isSelected === itemB.isSelected,
);

const styles = StyleSheet.create({
  descriptionView: {
    marginLeft: 8,
  },
  icon: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  touchableOpacity: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
