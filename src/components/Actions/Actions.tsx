import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HStack, Icon, IconButton, Menu } from 'native-base';

export type Action = {
  icon?: string;
  isHidden?: boolean;
  onPress?: () => void;
} & (ActionWithMenu | ActionWithoutMenu);

type ActionWithMenu = {
  isMenu: true;
  options: MenuOption[];
};

type ActionWithoutMenu = {
  isMenu?: false;
};

type MenuOption = {
  icon?: string;
  name: string;
  onPress?: () => void;
};

type ActionsProps = {
  actions: Action[];
};

export const Actions = ({ actions }: ActionsProps) => {
  return (
    <HStack alignItems={'center'} justifyContent={'center'}>
      {actions.map((action, index) => {
        if (action.isHidden) {
          return undefined;
        }

        if (action.isMenu) {
          return (
            <Menu
              key={index}
              trigger={triggerProps => (
                <IconButton {...triggerProps} icon={<Icon as={MaterialCommunityIcons} name={action.icon} />} />
              )}
            >
              {action.options.map((option, index) => (
                <Menu.Item key={index} onPress={option.onPress}>
                  {/*<Icon as={MaterialCommunityIcons} name={option.icon} />*/}
                  {option.name}
                </Menu.Item>
              ))}
            </Menu>
          );
        }

        return (
          <IconButton
            icon={<Icon as={MaterialCommunityIcons} name={action.icon} />}
            key={index}
            onPress={action.onPress}
          />
        );
      })}
    </HStack>
  );
};
