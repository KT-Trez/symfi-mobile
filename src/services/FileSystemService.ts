import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {ToastAndroid} from 'react-native';


export default class FileSystemService {
	static audioCacheDir = FileSystem.cacheDirectory;

	static async getMediaLibraryPermission() {
		const perm = await MediaLibrary.requestPermissionsAsync();
		if (perm.status !== MediaLibrary.PermissionStatus.GRANTED)
			ToastAndroid.showWithGravity('No permission to save audio file.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
		return MediaLibrary.PermissionStatus.GRANTED;
	}

	static async saveAsset(uri: string) {
		await MediaLibrary.createAssetAsync(uri);
		return await FileSystem.getInfoAsync(uri);
	}
}