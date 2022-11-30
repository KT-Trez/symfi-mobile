import {NavigationContext} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Musicly} from '../../../typings';
import ManageDialog from '../../components/ManageDialog';


interface EditDialogProps {
	options: Musicly.Components.ManageDialogOptions | null;
	refreshPlaylistsList: () => void;
	setOptions: (options: Musicly.Components.ManageDialogOptions | null) => void;
}

function EditDialog({options, refreshPlaylistsList, setOptions}: EditDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const [isVisible, setIsVisible] = useState(false);

	const goToPlayListEdit = () => {
		navigation?.navigate('PlaylistEdit', {id: options?.playList?.id});
		hideDialog();
	};

	const hideDialog = () => {
		setOptions(null);
		setIsVisible(false);
	};

	const removePlayList = async () => {
		await options?.playList?.removePlayList();
		refreshPlaylistsList();
		hideDialog();
	};

	const showDialog = () => setIsVisible(true);

	useEffect(() => {
		if (options?.message && options.title)
			showDialog();
	}, [options]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={isVisible}
					  message={options?.message}
					  onCancel={hideDialog}
					  onDelete={options?.isDelete || options?.isManage ? removePlayList : undefined}
					  onEdit={options?.isEdit || options?.isManage ? goToPlayListEdit : undefined}
					  title={options?.title}/>
	);
}

export default EditDialog;