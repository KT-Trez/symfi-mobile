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

const { Navigator, Screen } = createNativeStackNavigator<CollectionNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const CollectionNavigator = () => {
  const collections = useQuery(CollectionModel);
  const value = useListContextProps<CollectionType & BaseItem, CollectionModel>(collections);

  return (
    <CollectionListContext.Provider value={value}>
      <Navigator initialRouteName={'CollectionPage'}>
        <Screen component={CollectionDetails} name={'CollectionDetails'} options={defaultOptions} />
        <Screen component={CollectionEdit} name={'CollectionEdit'} options={defaultOptions} />
        <Screen component={CollectionForm} name={'CollectionForm'} options={defaultOptions} />
        <Screen component={CollectionPage} name={'CollectionPage'} options={defaultOptions} />
      </Navigator>
    </CollectionListContext.Provider>
  );
};
