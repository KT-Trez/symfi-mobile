import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { CollectionNavigatorParams, CollectionType } from 'types';
import { Musicly } from '../../../types';
import { Store } from '../../datastore/Store';
import { CollectionAdapter } from '../../models/Collection';
import ResourceManager from '../../services/ResourceManager';
import { CollectionDetails } from './CollectionDetails';
import { CollectionEdit } from './CollectionEdit';
import { CollectionForm } from './CollectionForm';
import { CollectionPage } from './CollectionPage';
import { ListProvider } from './context';

const { Navigator, Screen } = createNativeStackNavigator<CollectionNavigatorParams>();

const defaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const CollectionNavigator = () => {
  const onFetch = useCallback(async () => {
    const ps = await ResourceManager.PlayList.deserializeAll();

    const ca: CollectionType[] = [];
    for (const p of ps) {
      const songs = (await Store.songPlayLists.findAsync({ playListID: p.id })) as Musicly.Data.SongPlayList[];
      const songs2 = p.songs ?? [];

      const c = CollectionAdapter.fromPLAYLIST(p, songs.map(s => s.songID).concat(songs2));

      ca.push(c as CollectionType);
    }

    return ca;
  }, []);

  return (
    <ListProvider onFetch={onFetch}>
      <Navigator initialRouteName={'CollectionPage'}>
        <Screen component={CollectionDetails} name={'CollectionDetails'} options={defaultOptions} />
        <Screen component={CollectionEdit} name={'CollectionEdit'} options={defaultOptions} />
        <Screen component={CollectionForm} name={'CollectionForm'} options={defaultOptions} />
        <Screen component={CollectionPage} name={'CollectionPage'} options={defaultOptions} />
      </Navigator>
    </ListProvider>
  );
};
