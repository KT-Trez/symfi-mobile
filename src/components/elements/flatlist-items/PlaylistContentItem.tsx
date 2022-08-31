import React, {useRef} from 'react';
import {PlaylistData, SavedSongMetadata} from '../../../../typings/interfaces';
import {PlaylistDatabase, SongsDatabase} from '../../../schemas/schemas';
import SongEntry from '../SongEntry';


interface PlaylistContentItemProps {
	item: SavedSongMetadata;
	loadResource: (id: string) => void;
	playlistID: string;
	refreshPlaylist: () => void;
}

function PlaylistContentItem({item, loadResource, playlistID, refreshPlaylist}: PlaylistContentItemProps) {
	const playlistDB = useRef(PlaylistDatabase.getInstance());
	const songsDB = useRef(SongsDatabase.getInstance());

	const playAudio = () => {
		// todo: update flag for existing resources
		//if (!item.musicly.flags.isDownloaded)
		//	return;

		loadResource(item.id);
	};

	const removeFromPlayList = async () => {
		const playlistItem = (await songsDB.current.findOne({id: item.id})).musicly.playlists.find((p: PlaylistData) => p.id === playlistID);
		await songsDB.current.update({id: item.id}, {$pull: {'musicly.playlists': playlistItem}}, {});
		await playlistDB.current.update({id: playlistID}, {$inc: {songsCount: -1}}, {});

		refreshPlaylist();
	};

	return (
		<SongEntry imageOnLongPress={removeFromPlayList}
				   imageOnPress={playAudio}
				   item={item}
				   textOnLongPress={removeFromPlayList}
				   textOnPress={playAudio}/>
	);
}

export default PlaylistContentItem;