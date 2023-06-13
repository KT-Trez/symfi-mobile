import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React, {useEffect} from 'react';
import {MD3DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import useSchemaUpdate from './hooks/useSchemaUpdate';
import MainNavigator from './pages/Navigator';
import ResourceManager from './services/ResourceManager';


// async function playerSetup() {
// 	TrackPlayer.registerPlaybackService(() => PlaybackService);
//
// 	await TrackPlayer.setupPlayer();
// 	await TrackPlayer.updateOptions({
// 		android: {
// 			appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback
// 		},
// 		capabilities: [
// 			Capability.Play,
// 			Capability.Pause,
// 			Capability.SeekTo,
// 			Capability.SkipToNext,
// 			Capability.SkipToPrevious,
// 			Capability.Stop
// 		],
// 		compactCapabilities: [Capability.Play, Capability.Pause],
// 		// color: 'argb',
// 		// icon: require('path'),
// 		progressUpdateEventInterval: 1,
// 		// ratingType: RatingType.Heart
// 	});
// }

export default function App() {
    useEffect(() => {
        // playerSetup();

        ResourceManager.Net.loadRemote();
        useSchemaUpdate();
    }, []);

    return (
        <NativeBaseProvider>
            <PaperProvider theme={MD3DarkTheme}>
                <NavigationContainer theme={DarkTheme}>
                    <MainNavigator/>
                </NavigationContainer>
            </PaperProvider>
        </NativeBaseProvider>
    );
}
