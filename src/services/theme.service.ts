import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorMode, StorageManager} from 'native-base';


export default () => {
	const colorModeManager: StorageManager = {
		get: async () => {
			try {
				const mode = await AsyncStorage.getItem('@config--theme-mode');
				return mode ? 'dark' : 'light';
			} catch (err) {
				console.error(err);
				return 'light';
			}
		},
		set: async (value: ColorMode) => {
			try {
				await AsyncStorage.setItem('@config--theme-mode', value ?? 'light');
			} catch (err) {
				console.error(err);
			}
		}
	};
	return colorModeManager;
}