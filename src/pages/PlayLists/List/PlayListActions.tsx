import {MaterialCommunityIcons} from '@expo/vector-icons';
import {NavigationContext} from '@react-navigation/native';
import {Actionsheet, Icon} from 'native-base';
import React, {useContext} from 'react';
import PlayListService from '../../../services/playlist.service';


interface PlayListActionsProps {
    close: () => void;
    isOpen: boolean;
    playListId: string | undefined;
    refreshPlaylistsList: () => void;
}

function PlayListActions({close, isOpen, playListId, refreshPlaylistsList}: PlayListActionsProps) {
    const navigation = useContext(NavigationContext);

    const deletePlayList = async () => {
        if (!playListId)
            return;
        await PlayListService.remove(playListId);
        refreshPlaylistsList();
        close();
    };

    const editPlayList = () => {
        if (!playListId)
            return;
        navigation?.navigate('PlaylistEdit', {id: playListId});
        close();
    };

    return (
        <Actionsheet isOpen={isOpen} onClose={close}>
            <Actionsheet.Content>
                <Actionsheet.Item onPress={deletePlayList}
                                  startIcon={<Icon as={MaterialCommunityIcons} name={'delete'} size={6}/>}
                >
                    Delete
                </Actionsheet.Item>
                <Actionsheet.Item onPress={editPlayList}
                                  startIcon={<Icon as={MaterialCommunityIcons} name={'pencil'} size={6}/>}
                >
                    Edit
                </Actionsheet.Item>
                <Actionsheet.Item onPress={close}>Cancel</Actionsheet.Item>
            </Actionsheet.Content>
        </Actionsheet>
    );
}

export default PlayListActions;
