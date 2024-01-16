import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { NativeBaseProvider, StatusBar, useColorMode, useTheme } from 'native-base';
import { useEffect } from 'react';
import { AudioPlayerProvider, Loader } from './components';
import { useCustomTheme } from './hooks';
import useSchemaUpdate, { useSchemaUpdate2 } from './hooks/useSchemaUpdate';
import { CollectionModel, ConfigItemModel } from './models';
import { MainNavigator } from './modules';
import ApiService from './services/api.service';

export const AppWrapper = () => (
  <NativeBaseProvider>
    <RealmProvider deleteRealmIfMigrationNeeded fallback={Loader} schema={[CollectionModel, ConfigItemModel]}>
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
    getMigratedSchemas();
  }, [getMigratedSchemas]);

  return (
    <AudioPlayerProvider>
      <NavigationContainer theme={customTheme}>
        <StatusBar backgroundColor={colors.primary['800']} barStyle={colorMode ? `${colorMode}-content` : 'default'} />
        <MainNavigator />
      </NavigationContainer>
    </AudioPlayerProvider>
  );
};
