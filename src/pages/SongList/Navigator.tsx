import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootSongsStackParamList } from '../../../types/navigation';
import List from './List/List';

const { Navigator, Screen } = createNativeStackNavigator<RootSongsStackParamList>();

function SongListNavigator() {
  const defaultOptions = {
    headerShown: false,
  };

  return (
    <Navigator>
      <Screen component={List} name={'SongsList'} options={defaultOptions} />
    </Navigator>
  );
}

export default SongListNavigator;
