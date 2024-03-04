import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContext } from '@react-navigation/native';
import { Actionsheet, Icon } from 'native-base';
import React, { useContext } from 'react';
import { ToastAndroid } from 'react-native';
import SongService from '../../../services/song.service';

interface SongActionsProps {
  close: () => void;
  isOpen: boolean;
  refreshSongsList: () => void;
  songId: string | undefined;
}

// todo: remove duplicated fragment
function SongActions({ close, isOpen, refreshSongsList, songId }: SongActionsProps) {
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
    navigation?.navigate('SongEdit', { id: songId });
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
        <Actionsheet.Item onPress={close}>Cancel</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

export default SongActions;
