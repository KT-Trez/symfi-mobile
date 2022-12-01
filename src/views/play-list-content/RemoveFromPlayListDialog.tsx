import React from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';
import {Song as SongC} from '../../services/ResourceManager';
import TempSongController from '../../datastore/TempSongController';
import {dbs} from '../../datastore/Store';


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
		await TempSongController.removeFromPlayList(song!.id, playListID);
		await dbs.playLists.updateAsync({id: playListID}, {$inc: {songsCount: -1}});

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