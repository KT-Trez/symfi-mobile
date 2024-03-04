import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootPlayListsStackParamList } from '../../../types/navigation';
import PlayListContent from './Content/PlayListContent';
import PlayListEdit from './Edit/PlayListEdit';
import List from './List/List';
import ChangeOrder from './Order/ChangeOrder';

const { Navigator, Screen } = createNativeStackNavigator<RootPlayListsStackParamList>();

function PlayListsNavigator() {
  const defaultOptions = {
    headerShown: false,
  };

  return (
    <Navigator initialRouteName={'PlaylistMenu'}>
      <Screen component={PlayListContent} name={'PlaylistContent'} options={defaultOptions} />
      <Screen component={PlayListEdit} name={'PlaylistEdit'} options={defaultOptions} />
      <Screen component={List} name={'PlaylistMenu'} options={defaultOptions} />
      <Screen component={ChangeOrder} name={'PlayListOrder'} options={defaultOptions} />
    </Navigator>
  );
}

export default PlayListsNavigator;
