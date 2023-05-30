import React from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';
import PlayListController from '../../../datastore/PlayListController';
import SongsController from '../../../datastore/SongsController';
import {Song as SongC} from '../../../services/ResourceManager';


interface RemoveFromPlayListDialogProps {
	hide: () => void;
	playListID: string;
	refreshSongList: () => Promise<void>;
	shows: boolean;
	song: SongC | null;
}

function RemoveFromPlayListDialog({hide, playListID, refreshSongList, shows, song}: RemoveFromPlayListDialogProps) {
	const {colors} = useTheme();

	const removeSongFromPlayList = async () => {
		await SongsController.removeFromPlayList(song!.id, playListID);
		await PlayListController.store.updateAsync({id: playListID}, {$inc: {songsCount: -1}});

		await refreshSongList();
		hide();
	};

	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hide} visible={shows}>
				<Dialog.Title>Remove from playlist</Dialog.Title>
				<Dialog.Content>
					<Paragraph>{song?.title}</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					<Button icon={'playlist-remove'}
							onPress={removeSongFromPlayList}
							textColor={colors.error}>remove</Button>
					<Button onPress={hide}>cancel</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default RemoveFromPlayListDialog;