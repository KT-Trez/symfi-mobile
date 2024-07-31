import type { BaseItem, SongType, SongTypeApi } from '@types';
import { memo } from 'react';
import { type StyleProp, StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { Thumbnail } from './Thumbnail';

interface SongCardProps {
  bottomLabel: string;
  imageUri?: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  item: (SongType | SongTypeApi) & BaseItem;
  onLongPress?: (id: string) => void;
  onPress?: (id: string) => void;
}

export const SongCard = memo(
  ({ bottomLabel, imageUri, item, isHighlighted, isSelected, onLongPress, onPress }: SongCardProps) => {
    const { colors, roundness } = useTheme();

    const highlightedStyle: StyleProp<ViewStyle> = isHighlighted
      ? {
          backgroundColor: colors.surface,
          borderRadius: roundness,
          elevation: 1,
        }
      : { borderRadius: roundness };

    return (
      <TouchableOpacity
        onLongPress={() => onLongPress?.(item.id)}
        onPress={() => onPress?.(item.id)}
        style={[styles.container, highlightedStyle]}
      >
        <View style={styles.imageContainer}>
          <Thumbnail id={item.id} loadPlaceholder={!imageUri} timestamp={item.duration.label} uri={imageUri} />

          {isSelected && (
            <View style={[styles.icon, { borderRadius: roundness }]}>
              <Icon color="rgba(255, 255, 255, 0.9)" source="check-circle-outline" size={50} />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text ellipsizeMode="tail" numberOfLines={2} variant="titleSmall">
            {item.name + '\n'}
          </Text>

          <Text variant="bodySmall">{item.channel.name}</Text>

          <Text style={{ color: colors.outline }} variant="bodySmall">
            {bottomLabel} • {item.published}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, newProps) => {
    const hasTheSameIsHighlightedState = prevProps.isHighlighted === newProps.isHighlighted;
    const hasTheSameIsSelectedState = prevProps.isSelected === newProps.isSelected;
    const hasTheSameLongPressHandler = prevProps.onLongPress === newProps.onLongPress;
    const hasTheSamePressHandler = prevProps.onPress === newProps.onPress;

    return (
      hasTheSameIsHighlightedState && hasTheSameIsSelectedState && hasTheSameLongPressHandler && hasTheSamePressHandler
    );
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
