import { theme } from '@/theme';
import { AudioPlayerProvider, ConfirmDialogProvider, Loader } from '@components';
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
import { NativeBaseProvider, StatusBar, useColorMode } from 'native-base';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
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
      <PaperProvider theme={theme}>
        <ConfirmDialogProvider>
          <App />
        </ConfirmDialogProvider>
      </PaperProvider>
    </RealmProvider>
  </NativeBaseProvider>
);

const App = () => {
  const { colorMode } = useColorMode();
  const { customTheme } = useCustomTheme();
  const { getMigratedSchemas } = useSchemaUpdate2();

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
        <StatusBar backgroundColor="#406d78" barStyle={colorMode ? `${colorMode}-content` : 'default'} />
        <MainNavigator />
      </NavigationContainer>
    </AudioPlayerProvider>
  );
};
