export type Action = {
  color?: string;
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
