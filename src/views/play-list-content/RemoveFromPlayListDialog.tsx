import React, {useRef} from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';
import {SavedSongMetadata} from '../../../types/interfaces';
import SongsController from '../../datastore/SongsController';
import {dbs} from '../../datastore/Store';


interface RemoveFromPlayListDialogProps {
	hide: () => void;
	playListID: string;
	refreshSongList: () => Promise<void>;
	shows: boolean;
	song: SavedSongMetadata | null;
}

function RemoveFromPlayListDialog({hide, playListID, refreshSongList, shows, song}: RemoveFromPlayListDialogProps) {
	const {colors} = useTheme();
	const songsDB = useRef(new SongsController());

	const removeSongFromPlayList = async () => {
		await songsDB.current.removePlayListFromSong(playListID, song!.id);
		await dbs.playLists.updateAsync({id: playListID}, {$inc: {songsCount: -1}}, {});
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