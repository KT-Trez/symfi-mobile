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
	setPlayList: (playList: CPlayList | null) => void;
}

function PlayList({item, manageOptions, setPlayList}: PlayListProps) {
	const {colors} = useTheme();
	const navigation = useContext(NavigationContext);

	const chosePlayList = () => setPlayList(item);

	const goToPlayList = () => navigation?.navigate('PlaylistContent', {id: item.id});

	return (
		<TouchableOpacity disabled={!!manageOptions}
						  onPress={goToPlayList}
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
			{manageOptions &&
                <Stack alignItems={'center'} justifyContent={'center'} sx={css.buttons}>
					{manageOptions.isEdit ?
						<IconButton icon={'playlist-edit'} onPress={chosePlayList} size={30}/> : <></>}
					{manageOptions.isDelete ?
						<IconButton iconColor={colors.error}
									icon={'delete-forever'}
									onPress={chosePlayList}
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