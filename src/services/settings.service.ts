import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import PlayListController from '../datastore/PlayListController';
import SongsController from '../datastore/SongsController';
import ApiService from './api.service';
import ResourceManager from './ResourceManager';

export default class SettingsService {
  static async exportUserData() {
    try {
      const res = await ApiService.axios({
        data: {
          playLists: await PlayListController.store.findAsync({}),
          songsList: await SongsController.store.findAsync({}),
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        method: 'post',
        responseType: 'json',
        url: '/sync',
      });

      ToastAndroid.showWithGravity('Settings ID: ' + res.data.uid, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      return res.data.uid;
    } catch (err) {
      console.error(err);
      ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  }

  static async importUserData(uid: string) {
    if (!uid) return ToastAndroid.showWithGravity('UID not specified', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

    if (!/\d{6}/gm.test(uid))
      return ToastAndroid.showWithGravity('Incorrect UID', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

    try {
      const res = await ApiService.axios({
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        method: 'get',
        responseType: 'json',
        url: '/sync/' + uid,
      });

      for (const playList of res.data.playLists)
        await PlayListController.store.updateAsync({ id: playList.id }, playList, { upsert: true });

      // todo: find a better way to download songs
      // IMPORTANT: update database in case of duplicated song
      for (const song of res.data.songsList) {
        delete song.musicly;
        // todo: restore song's playlists
        const songC = await ResourceManager.Song.create(song);
        songC.getRemoteAudio();
      }
    } catch (err) {
      console.error(err);
      ToastAndroid.showWithGravity('Export unsuccessful, try again later', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  }

  static async reloadSongsFromDisc() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== MediaLibrary.PermissionStatus.GRANTED)
      return ToastAndroid.showWithGravity('Missing media library permission.', ToastAndroid.LONG, ToastAndroid.BOTTOM);

    const assetsToValidate = [];

    const assets = (
      await MediaLibrary.getAssetsAsync({
        first: 1000,
        mediaType: 'audio',
      })
    ).assets.filter(asset => asset.filename.endsWith('.wav'));

    for (const asset of assets) {
      const assetID = asset.filename.slice(0, asset.filename.lastIndexOf('.'));
      if ((await SongsController.countAsync({ id: assetID })) === 0) assetsToValidate.push(assetID);
    }

    if (assetsToValidate.length === 0)
      return ToastAndroid.showWithGravity(`There Are No New Songs On Disc`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);

    try {
      const res = await ApiService.axios({
        data: assetsToValidate,
        method: 'post',
        responseType: 'json',
        url: '/v2/content/check',
      });

      ToastAndroid.showWithGravity(`Found ${res.data.length} New Songs`, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      if (res.data.length !== 0)
        for (const songMetadata of res.data) {
          const asset = assets.find(asset => asset.filename === songMetadata.id + '.wav');
          const fileInfo = await FileSystem.getInfoAsync(asset!.uri);

          if (fileInfo.exists)
            await ResourceManager.Song.create(songMetadata, {
              file: {
                downloadDate: new Date(asset!.creationTime),
                id: asset!.id,
                path: asset!.uri,
                size: fileInfo.size,
              },
            });
        }
    } catch (err) {
      console.error(err);
      ToastAndroid.showWithGravity(
        'Cannot Check Songs IDs: Incorrect Server Response',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  }
}
