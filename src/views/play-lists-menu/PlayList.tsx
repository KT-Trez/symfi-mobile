import {NavigationContext} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, IconButton, Text, useTheme} from 'react-native-paper';
import {Musicly} from '../../../typings';
import Stack from '../../components/Stack';
import {PlayList as CPlayList} from '../../services/ResourceManager';


interface PlayListProps {
	item: CPlayList;
	manageOptions: Musicly.Components.ManageDialogOptions | null;
	setManageDialogOptions: (options: Musicly.Components.ManageDialogOptions | null) => void;
}

function PlayList({item, manageOptions, setManageDialogOptions}: PlayListProps) {
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);

	const deletePlayList = () => {
		setManageDialogOptions({
			isDelete: true,
			message: 'This action is permanent, are you sure?',
			playList: item,
			title: 'Delete'
		});
	};

	const editPlayList = () => {
		setManageDialogOptions(null);
		navigation?.navigate('PlaylistEdit', {id: item.id});
	};

	const managePlayList = () => {
		setManageDialogOptions({
			isManage: true,
			message: 'Chose your action:',
			playList: item,
			title: 'Manage'
		});
	};

	const goToPlayList = () => navigation?.navigate('PlaylistContent', {id: item.id});

	return (
		<TouchableOpacity disabled={!!manageOptions}
						  onPress={goToPlayList}
						  onLongPress={managePlayList}
						  style={[css.container, {backgroundColor: colors.elevation.level1}]}>
			<View style={css.imageContainer}>
				{item.cover.uri ?
					<Avatar.Image size={50}
								  source={
									  ({size}) => <Image source={{height: size, uri: item.cover.uri, width: size}}
														 style={css.image}/>}/>
					:
					<Avatar.Text label={item.cover.name.split('_')[2].slice(0, 1).toUpperCase()} size={50}/>
				}
			</View>

			<View style={css.textContainer}>
				<Text variant={'titleMedium'}>{item.name}</Text>
				<Text variant={'labelMedium'}>{item.songsCount} {item.songsCount !== 1 ? 'songs' : 'song'}</Text>
			</View>

			{/* todo: find more elegant way for conditional buttons */}
			{manageOptions && !manageOptions.isManage &&
				<Stack alignItems={'center'} justifyContent={'center'} sx={css.buttons}>
					{manageOptions.isEdit ?
						<IconButton icon={'playlist-edit'}
									onPress={editPlayList}
									size={30}/> : <></>}
					{manageOptions.isDelete ?
						<IconButton iconColor={colors.error}
									icon={'delete-forever'}
									onPress={deletePlayList}
									size={30}/> : <></>}
				</Stack>
			}
		</TouchableOpacity>
	);
}

const css = StyleSheet.create({
	container: {
		flexDirection: 'row',
		margin: 5,
		marginBottom: 2.5,
		marginTop: 2.5
	},
	buttons: {
		flex: 1
	},
	imageContainer: {
		flex: 1,
		padding: 10
	},
	image: {
		borderRadius: 25
	},
	textContainer: {
		flex: 4,
		padding: 10,
		paddingLeft: 0
	}
});

export default PlayList;