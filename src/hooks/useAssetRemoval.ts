import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


export default async function useAssetRemoval(path: string) {
	try {
		await FileSystem.deleteAsync(path);
	} catch (err) {
		const asset = await MediaLibrary.getAssetInfoAsync(path);
		await MediaLibrary.deleteAssetsAsync(asset);
	}
}