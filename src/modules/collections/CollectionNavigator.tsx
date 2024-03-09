import { useListContextProps } from '@hooks';
import { CollectionModel } from '@models';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useQuery } from '@realm/react';
import { BaseItem, CollectionNavigatorParams, CollectionType } from '@types';
import { CollectionDetails } from './CollectionDetails';
import { CollectionEdit } from './CollectionEdit';
import { CollectionForm } from './CollectionForm';
import { CollectionPage } from './CollectionPage';
import { CollectionListContext } from './context';
import { SongsSearchPage } from './SongsSearch';

const { Navigator, Screen } = createNativeStackNavigator<CollectionNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const CollectionNavigator = () => {
  const collections = useQuery(CollectionModel);
  const value = useListContextProps<CollectionType & BaseItem, CollectionModel>(collections);

  return (
    <CollectionListContext.Provider value={value}>
      <Navigator initialRouteName={'CollectionPage'} screenOptions={defaultOptions}>
        <Screen component={CollectionDetails} name="CollectionDetails" />
        <Screen component={CollectionEdit} name="CollectionEdit" />
        <Screen component={CollectionForm} name="CollectionForm" />
        <Screen component={CollectionPage} name="CollectionPage" />
        <Screen component={SongsSearchPage} name="SongsSearch" />
      </Navigator>
    </CollectionListContext.Provider>
  );
};
