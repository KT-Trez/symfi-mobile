import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React, {useEffect} from 'react';
import useSchemaUpdate from './hooks/useSchemaUpdate';
import MainNavigator from './pages/Navigator';
import ApiService from './services/api.service';


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

        ApiService.loadRemote();
        useSchemaUpdate();
    }, []);

    return (
        <NativeBaseProvider>
            <NavigationContainer theme={DarkTheme}>
                <MainNavigator/>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}
