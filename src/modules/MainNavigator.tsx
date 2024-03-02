import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainNavigatorParams } from '@types';
import { CollectionNavigator } from './collections';
import { SettingsNavigator } from './settings';

const { Navigator, Screen } = createBottomTabNavigator<MainNavigatorParams>();

const defaultOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

export const MainNavigator = () => (
  <Navigator initialRouteName={'CollectionNavigator'}>
    <Screen
      component={CollectionNavigator}
      name={'CollectionNavigator'}
      options={{
        ...defaultOptions,
        tabBarIcon: iconProps => <MaterialIcons {...iconProps} name={'playlist-play'} />,
        tabBarLabel: 'Collections',
      }}
    />
    <Screen
      component={SettingsNavigator}
      name={'SettingsNavigator'}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name={'settings'} size={size} />,
        tabBarLabel: 'Settings',
      }}
    />
    {/*<Screen*/}
    {/*  component={SongsSearch}*/}
    {/*  name={'search'}*/}
    {/*  options={{*/}
    {/*    headerShown: false,*/}
    {/*    tabBarIcon: ({ color, size }) => (<MaterialIcons color={color} name={'search'} size={size}/>),*/}
    {/*    tabBarLabel: 'Search',*/}
    {/*  }}*/}
    {/*/>*/}
    {/*<Screen*/}
    {/*  component={SongListNavigator}*/}
    {/*  name={'SongList'}*/}
    {/*  options={{*/}
    {/*    headerShown: false,*/}
    {/*    tabBarIcon: ({ color, size }) => (*/}
    {/*      <MaterialIcons color={color} name={'audiotrack'} size={size}/>),*/}
    {/*    tabBarLabel: 'SongsList',*/}
    {/*  }}*/}
    {/*/>*/}
  </Navigator>
);
