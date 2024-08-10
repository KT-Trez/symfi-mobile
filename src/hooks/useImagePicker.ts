import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { PermissionStatus, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useCallback } from 'react';
import { ToastAndroid } from 'react-native';
import { useRandom } from './useRandom';

type ImagePicker = [string, false];
type ImagePickerCanceled = [undefined, true];

export default async function useImagePicker(
  id: string,
  aspect: [number, number],
): Promise<ImagePicker | ImagePickerCanceled> {
  const { status } = await requestMediaLibraryPermissionsAsync();
  if (status !== PermissionStatus.GRANTED) {
    ToastAndroid.showWithGravity('No permission to select photo.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    return [undefined, true];
  }

  const thumbnail = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: aspect,
    base64: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (thumbnail.canceled) return [undefined, thumbnail.canceled];

  const asset = await MediaLibrary.createAssetAsync(thumbnail.assets[0].uri);
  const coverUri = FileSystem.documentDirectory + '/assets/' + id + '-thumbnail.png';

  await FileSystem.copyAsync({ from: asset.uri, to: coverUri });
  await MediaLibrary.deleteAssetsAsync(asset);

  return [coverUri, thumbnail.canceled];
}

export const useImagePickerV2 = () => {
  const { randomId } = useRandom();

  const ensurePermissions = useCallback(async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== PermissionStatus.GRANTED)
      ToastAndroid.showWithGravity('No permission to select photo.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    return status === PermissionStatus.GRANTED;
  }, []);

  const pickImage = useCallback(
    async (aspect: [number, number]) => {
      if (!(await ensurePermissions())) {
        return false;
      }

      const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect,
        base64: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (canceled) {
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(assets[0].uri);
      const coverUri = FileSystem.documentDirectory + '/assets/' + randomId() + '-thumbnail.png';

      await FileSystem.copyAsync({ from: asset.uri, to: coverUri });
      await MediaLibrary.deleteAssetsAsync(asset);

      return coverUri;
    },
    [ensurePermissions, randomId],
  );

  const removeImage = useCallback(
    async (imageUri: string) => {
      if (!(await ensurePermissions())) {
        return false;
      }

      try {
        await FileSystem.deleteAsync(imageUri);
      } catch (err) {
        const asset = await MediaLibrary.getAssetInfoAsync(imageUri);
        await MediaLibrary.deleteAssetsAsync(asset);
      }
    },
    [ensurePermissions],
  );

  return { pickImage, removeImage };
};
