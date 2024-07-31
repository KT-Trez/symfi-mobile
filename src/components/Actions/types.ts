import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export type ActionType = {
  color?: string;
  icon: IconSource;
  isHidden?: boolean;
  onPress?: () => void;
};
