import { useCallback, useState } from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import type { ActionType } from './types';

type ActionProps = {
  item: ActionType;
};

export const Action = ({ item }: ActionProps) => {
  const { colors } = useTheme();

  if (item.isMenu) return <MenuAction item={item} />;

  return <Appbar.Action color={item.color || colors.onSurface} icon={item.icon} onPress={item.onPress} />;
};

type MenuActionProps = {
  item: ActionType & { isMenu: true };
};

const MenuAction = ({ item }: MenuActionProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { colors } = useTheme();

  const onDismiss = useCallback(() => setIsVisible(false), []);

  const openMenu = useCallback(() => setIsVisible(true), []);

  return (
    <Menu
      anchor={<Appbar.Action color={item.color || colors.onSurface} icon={item.icon} onPress={openMenu} />}
      anchorPosition="bottom"
      onDismiss={onDismiss}
      visible={isVisible}
    >
      {item.options.map((option, index) => (
        <Menu.Item key={index} leadingIcon={option.icon} onPress={option.onPress} title={option.name} />
      ))}
    </Menu>
  );
};
