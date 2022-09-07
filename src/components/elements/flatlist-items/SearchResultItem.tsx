import {MaterialIcons} from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, LayoutChangeEvent, StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import {SavedSongMetadata, SongMetadata} from '../../../../typings/interfaces';
import {SongsDatabase} from '../../../schemas/schemas';


interface SearchResultItemProps {
	item: SongMetadata;
}

function SearchResultItem({item}: SearchResultItemProps) {
	const {colors} = useTheme();

	const [isDownloaded, setIsDownloaded] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const [loadingFailed, setLoadingFailed] = useState(false);

	const [imageDimensions, setImageDimensions] = useState({height: 0, width: 0});

	// todo: measure performance, remove if unnecessary
	const checkDownloadedStatus = useCallback(async () => {
		const db = SongsDatabase.getInstance();
		const songRecord = await db.find<SavedSongMetadata[]>({id: item.id});
		if (songRecord.length > 0)
			setIsDownloaded(true);
	}, []);

	const downloadSong = useCallback(async () => {
		const perm = await MediaLibrary.requestPermissionsAsync();
		if (perm.status != MediaLibrary.PermissionStatus.GRANTED)
			return ToastAndroid.showWithGravity('No permission to save audio file.', ToastAndroid.LONG, ToastAndroid.BOTTOM);

		setIsDownloading(true);

		try {
			const savePath = FileSystem.cacheDirectory + item.id + '.wav';
			const {uri} = await FileSystem.downloadAsync('https://musicly-api.herokuapp.com/download/youtube?audioID=' + item.id, savePath);

			const asset = await MediaLibrary.createAssetAsync(uri);
			const assetMetadata = await FileSystem.getInfoAsync(uri);

			const savedAudio = Object.assign(item, {
				musicly: {
					cover: {
						color: Math.floor(Math.random() * 16777215).toString(16),
						name: item.title + '_' + item.id,
						uri: undefined
					},
					file: {
						path: asset.uri,
						size: assetMetadata.size ?? 0
					},
					flags: {
						hasCover: false,
						isDownloaded: true,
						isFavourite: false
					},
					playlists: [],
					version: 1,
					wasPlayed: 0
				}
			});

			const db = SongsDatabase.getInstance();
			await db.insert<SavedSongMetadata>(savedAudio);

			await checkDownloadedStatus();
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Error, audio file NOT downloaded.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} finally {
			setIsDownloading(false);
		}
	}, []);

	const scaleImage = (id: number, event: LayoutChangeEvent) => {
		if (id === 0 && !imageDimensions.width)
			setImageDimensions({height: imageDimensions.height, width: event.nativeEvent.layout.width - 2});
		else if (id === 1 && !imageDimensions.height)
			setImageDimensions({height: event.nativeEvent.layout.height - 2, width: imageDimensions.width});
	};

	useEffect(() => {
		checkDownloadedStatus();
	}, []);

	return (
		<View style={[css.container, {backgroundColor: colors.elevation.level1}]}>
			<View onLayout={(event) => scaleImage(0, event)}
				  style={css.imageContainer}>
				{item.metadata.thumbnails.length === 0 ?
					<View style={css.imageBroken}>
						<MaterialIcons color='gray' name='broken-image' size={30}/>
					</View>
					:
					loadingFailed ?
						<MaterialIcons color='gray' name='error-outline' size={30}/>
						:
						<Image onError={() => setLoadingFailed(true)}
							   resizeMode={'contain'}
							   resizeMethod={'resize'}
							   source={{uri: item.metadata.thumbnails[0].url}}
							   style={{height: imageDimensions.height, width: imageDimensions.width}}/>
				}
			</View>
			<View onLayout={(event) => scaleImage(1, event)} style={css.metadataContainer}>
				<Text numberOfLines={2} variant={'titleSmall'}>{item.title + '\n'}</Text>
				<Text numberOfLines={1} variant={'bodySmall'}>{item.channel.name}</Text>
				<Text numberOfLines={1} variant={'labelSmall'}>
					{item.metadata.short_view_count_text.simple_text} • {item.metadata.published}
				</Text>
			</View>
			<TouchableOpacity disabled={isDownloaded || isDownloading}
							  onPress={downloadSong}
							  style={css.addButtonContainer}>
				{!isDownloading ?
					<MaterialIcons color={colors.secondary} name={!isDownloaded ? 'file-download' : 'file-download-done'} size={28}/>
					:
					<ActivityIndicator/>
				}
			</TouchableOpacity>
		</View>
	);
}

const css = StyleSheet.create({
	addButtonContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		margin: 5
	},
	imageContainer: {
		alignItems: 'center',
		flex: 3,
		justifyContent: 'center'
	},
	imageBroken: {
		alignItems: 'center',
		backgroundColor: 'lightgray',
		flex: 1,
		justifyContent: 'center',
		width: '100%'
	},
	metadataContainer: {
		flex: 4,
		padding: 5,
		paddingLeft: 10
	}
});

export default SearchResultItem;