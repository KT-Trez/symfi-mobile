import { DEFAULT_API_ORIGIN } from '@config';
import { ConfigItemModel, FileModel, SongModel } from '@models';
import { useObject, useRealm } from '@realm/react';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiSuccess, File, SongTypeApi } from '@types';
import { API_ORIGIN, QueryKeys } from '@utils';
import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';

export const useSongDownload = () => {
  const customOrigin = useObject(ConfigItemModel, API_ORIGIN);
  const realm = useRealm();
  const queryClient = useQueryClient();

  const origin = customOrigin?.value || DEFAULT_API_ORIGIN;

  return useCallback(
    async (song: SongTypeApi) => {
      // check if song already exists
      const songIndex = realm.objects(SongModel.schema.name).findIndex(({ id }) => id === song.id);
      if (songIndex !== -1) {
        return;
      }

      //get download url
      const { meta } = await queryClient.fetchQuery<ApiSuccess<string>>({
        queryFn: () => fetch(`${origin}/v3/song/download?id=${song.id}`).then(res => res.json()),
        queryKey: [QueryKeys.DOWNLOAD_URL, song.id],
      });

      // download song
      const { uri } = await FileSystem.downloadAsync(meta, `${FileSystem.documentDirectory}${song.id}.webm`);
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      if (!fileInfo.exists) {
        // todo: add toast
        return;
      }

      // todo: download cover image if selected

      const { modificationTime, size } = fileInfo;

      // save song to realm
      const songToSave = SongModel.generate(song);
      Object.assign<SongTypeApi, { file: File }>(songToSave, {
        file: FileModel.generate({ modifiedDate: new Date(modificationTime), size, uri }),
      });

      realm.write(() => {
        realm.create(SongModel.schema.name, songToSave);
      });

      console.log('downloaded song!', uri);
    },
    [origin, queryClient, realm],
  );
};
