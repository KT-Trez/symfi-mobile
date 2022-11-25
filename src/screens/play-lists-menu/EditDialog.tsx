import {NavigationContext} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Musicly} from '../../../typings';
import ManageDialog from '../../components/ManageDialog';
import {PlayList} from '../../services/ResourceManager';


interface EditDialogProps {
	options: Musicly.Components.ManageDialogOptions | null;
	playList: PlayList | null;
	refreshPlaylistsList: () => void;
	setPlayList: (playList: PlayList | null) => void;
}

function EditDialog({options, playList, refreshPlaylistsList, setPlayList}: EditDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const [isVisible, setIsVisible] = useState(false);

	const goToPlayListEdit = () => {
		navigation?.navigate('PlaylistEdit', {id: playList?.id});
		hideDialog();
	};

	const hideDialog = () => {
		setPlayList(null);
		setIsVisible(false);
	};

	const removePlayList = async () => {
		await playList?.removePlayList();
		refreshPlaylistsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (playList && options?.isDelete)
			showDialog();
		else if (playList && options?.isEdit)
			goToPlayListEdit();
	}, [playList]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={isVisible}
					  message={options?.message}
					  onCancel={hideDialog}
					  onDelete={options?.isDelete ? removePlayList : undefined}
					  title={options?.title}/>
	);
}

export default EditDialog;