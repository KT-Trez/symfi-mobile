import {NavigationContext} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Musicly} from '../../../types';
import ManageDialog from '../../components/ManageDialog';
import useVisibility from '../../hooks/useVisibility';


interface EditDialogProps {
	options: Musicly.Components.ManageDialogOptions | null;
	refreshPlaylistsList: () => void;
	setOptions: (options: Musicly.Components.ManageDialogOptions | null) => void;
}

function EditDialog({options, refreshPlaylistsList, setOptions}: EditDialogProps) {
	const navigation = React.useContext(NavigationContext);

	const [hideDialog, dialogShows, showDialog] = useVisibility([() => setOptions(null)]);

	const goToPlayListEdit = () => {
		navigation?.navigate('PlaylistEdit', {id: options?.playList?.id});
		hideDialog();
	};

	const removePlayList = async () => {
		await options?.playList?.removePlayList();
		refreshPlaylistsList();
		hideDialog();
	};

	useEffect(() => {
		if (options?.message && options.title)
			showDialog();
	}, [options]);

	return (
		<ManageDialog hide={hideDialog}
					  isVisible={dialogShows}
					  message={options?.message}
					  onCancel={hideDialog}
					  onDelete={options?.isDelete || options?.isManage ? removePlayList : undefined}
					  onEdit={options?.isEdit || options?.isManage ? goToPlayListEdit : undefined}
					  title={options?.title}/>
	);
}

export default EditDialog;