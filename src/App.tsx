import { AudioPlayerProvider, ConfirmDialogProvider, Loader } from '@components';
import { theme } from '@config';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator } from './modules';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const AppWrapper = () => (
  <NativeBaseProvider>
    <SafeAreaProvider>
      <RealmProvider
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <ConfirmDialogProvider>
                <App />
              </ConfirmDialogProvider>
            </NavigationContainer>
          </PaperProvider>
        </QueryClientProvider>
      </RealmProvider>
    </SafeAreaProvider>
  </NativeBaseProvider>
);

const App = () => {
  const { colors, dark } = useTheme();

  useEffect(() => {
    console.log('re-rendered');
  });

  return (
    <AudioPlayerProvider>
      <StatusBar backgroundColor={colors.inversePrimary} style={dark ? 'light' : 'dark'} translucent={false} />
      <MainNavigator />
    </AudioPlayerProvider>
  );
};
