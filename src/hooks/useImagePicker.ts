import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


type ImagePicker = [string, false];
type ImagePickerCanceled = [undefined, true];

export default async function useImagePicker(id: string, aspect: [number, number]): Promise<ImagePicker | ImagePickerCanceled> {
	const thumbnail = await ImagePicker.launchImageLibraryAsync({
		allowsEditing: true,
		aspect: aspect,
		base64: false,
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		quality: 1
	});

	if (thumbnail.cancelled)
		return [undefined, thumbnail.cancelled];

	const asset = await MediaLibrary.createAssetAsync(thumbnail.uri);
	const coverUri = FileSystem.documentDirectory + '/assets/' + id + '-thumbnail.png';

	await FileSystem.copyAsync({from: asset.uri, to: coverUri});
	await MediaLibrary.deleteAssetsAsync(asset);

	return [coverUri, thumbnail.cancelled];
}