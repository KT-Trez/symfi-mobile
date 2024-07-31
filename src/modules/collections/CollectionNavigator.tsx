import { SongPicker } from '@components';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { CollectionNavigatorParams } from '@types';
import { CollectionDetails } from './CollectionDetails';
import { CollectionEdit } from './CollectionEdit';
import { CollectionForm } from './CollectionForm';
import { CollectionList } from './CollectionList';
import { SongsSearchPage } from './SongsSearch';

const { Navigator, Screen } = createNativeStackNavigator<CollectionNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const CollectionNavigator = () => (
  <Navigator initialRouteName={'CollectionPage'} screenOptions={defaultOptions}>
    <Screen component={CollectionDetails} name="CollectionDetails" />
    <Screen component={CollectionEdit} name="CollectionEdit" />
    <Screen component={CollectionForm} name="CollectionForm" />
    <Screen component={CollectionList} name="CollectionPage" />
    <Screen component={SongPicker} name="SongPicker" />
    <Screen component={SongsSearchPage} name="SongsSearch" />
  </Navigator>
);
