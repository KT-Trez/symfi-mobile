import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export type ActionType = {
  color?: string;
  icon: IconSource;
  isHidden?: boolean;
} & (ActionTypeWithMenu | ActionTypeWithoutMenu);

type ActionTypeWithMenu = {
  isMenu: true;
  options: MenuActionOptionType[];
};

type ActionTypeWithoutMenu = {
  onPress?: () => void;
  isMenu?: false;
};

type MenuActionOptionType = {
  icon?: IconSource;
  name: string;
  onPress?: () => void;
};
