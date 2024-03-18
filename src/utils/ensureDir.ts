import * as FileSystem from 'expo-file-system';

export const ensureDir = async (dir: string) => {
  const { exists } = await FileSystem.getInfoAsync(dir);
  if (!exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};
