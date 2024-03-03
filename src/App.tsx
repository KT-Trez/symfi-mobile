import { AudioPlayerProvider, Loader } from '@components';
import { useCustomTheme } from '@hooks';
import {
  ChannelModel,
  CollectionModel,
  ConfigItemModel,
  CoverModel,
  DurationModel,
  FileModel,
  SongModel,
  ViewsModel,
} from '@models';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { NativeBaseProvider, StatusBar, useColorMode, useTheme } from 'native-base';
import { useEffect } from 'react';
import useSchemaUpdate, { useSchemaUpdate2 } from './hooks/useSchemaUpdate';
import { MainNavigator } from './modules';
import ApiService from './services/api.service';

export const AppWrapper = () => (
  <NativeBaseProvider>
    <RealmProvider
      deleteRealmIfMigrationNeeded={!!process.env.EXPO_PUBLIC_DEVELOPMENT}
      fallback={Loader}
      schema={[
        ChannelModel,
        CollectionModel,
        ConfigItemModel,
        CoverModel,
        DurationModel,
        FileModel,
        SongModel,
        ViewsModel,
      ]}
    >
      <App />
    </RealmProvider>
  </NativeBaseProvider>
);

const App = () => {
  const { colorMode } = useColorMode();
  const { customTheme } = useCustomTheme();
  const { getMigratedSchemas } = useSchemaUpdate2();
  const { colors } = useTheme();

  useEffect(() => {
    ApiService.loadRemote();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSchemaUpdate();
    getMigratedSchemas().then(r => console.log(r));
  }, [getMigratedSchemas]);

  useEffect(() => {
    console.log('re-rendered');
  }, []);

  return (
    <AudioPlayerProvider>
      <NavigationContainer theme={customTheme}>
        <StatusBar backgroundColor={colors.primary['900']} barStyle={colorMode ? `${colorMode}-content` : 'default'} />
        <MainNavigator />
      </NavigationContainer>
    </AudioPlayerProvider>
  );
};
