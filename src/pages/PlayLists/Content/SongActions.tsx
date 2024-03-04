import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContext } from '@react-navigation/native';
import { Actionsheet, Icon } from 'native-base';
import React, { useContext } from 'react';
import { ToastAndroid } from 'react-native';
import SongService from '../../../services/song.service';

interface SongActionsProps {
  close: () => void;
  isOpen: boolean;
  playListId: string;
  refreshSongsList: () => void;
  songId: string | undefined;
}

function SongActions({ close, isOpen, playListId, refreshSongsList, songId }: SongActionsProps) {
  const navigation = useContext(NavigationContext);

  const deleteSong = async () => {
    if (!songId) return;
    try {
      await SongService.remove(songId);
    } catch (err) {
      console.error(err);
      ToastAndroid.showWithGravity('No permission to delete audio file', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
    refreshSongsList();
    close();
  };

  const editSong = () => {
    if (!songId) return;
    navigation?.navigate('SongList', { id: songId, screen: 'SongEdit' });
    close();
  };

  const removeSongFromPlayList = async () => {
    if (!playListId || !songId) return;
    await SongService.removeFromPlayList(songId, playListId);
    await refreshSongsList();
    close();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={close}>
      <Actionsheet.Content>
        <Actionsheet.Item
          onPress={deleteSong}
          startIcon={<Icon as={MaterialCommunityIcons} name={'delete'} size={6} />}
        >
          Delete
        </Actionsheet.Item>
        <Actionsheet.Item onPress={editSong} startIcon={<Icon as={MaterialCommunityIcons} name={'pencil'} size={6} />}>
          Edit
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={removeSongFromPlayList}
          startIcon={<Icon as={MaterialCommunityIcons} name={'playlist-remove'} size={6} />}
        >
          Remove
        </Actionsheet.Item>
        <Actionsheet.Item onPress={close}>Cancel</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

export default SongActions;
