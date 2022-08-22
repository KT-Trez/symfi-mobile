import {MaterialIcons} from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SongMetadata} from '../../../typings/interfaces';
import {SongsDatabase} from '../../schemas/schemas';


interface SearchResultItemProps {
	item: SongMetadata;
}

function SearchResultItem({item}: SearchResultItemProps) {
	const [isDownloaded, setIsDownloaded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [loadingFailed, setLoadingFailed] = useState(false);

	const [imageDimensions, setImageDimensions] = useState({height: 0, width: 0});

	// todo: measure performance, remove if unnecessary
	const checkDownloadedStatus = useCallback(async () => {
		const db = new SongsDatabase('songs');
		const songRecord = await db.find<SongMetadata[]>({id: item.id});
		if (songRecord.length > 0)
			setIsDownloaded(true);
	}, []);

	const downloadSong = useCallback(async () => {
		const perm = await MediaLibrary.requestPermissionsAsync();
		if (perm.status != MediaLibrary.PermissionStatus.GRANTED)
			return // todo: add informative toast

		//const permStorageWrite = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(FileSystem.cacheDirectory + item.id + '.wav');
		//if (!permStorageWrite.granted)
		//	return // todo: add informative toast

		try {
			const savePath = FileSystem.cacheDirectory + item.id + '.wav';
			const {status, uri} = await FileSystem.downloadAsync('https://musicly-api.herokuapp.com/download/youtube?audioID=' + item.id, savePath);

			const asset = await MediaLibrary.createAssetAsync(uri);

			Object.assign(item, {
				path: asset.uri,
				playlistsIDs: []
			});

			const db = new SongsDatabase('songs');
			await db.insert<SongMetadata>(item);

			await checkDownloadedStatus();

			console.info(status, uri);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const scaleImage = (event: LayoutChangeEvent) => {
		setImageDimensions({height: event.nativeEvent.layout.height, width: event.nativeEvent.layout.width})
	};

	useEffect(() => {
		checkDownloadedStatus();
	}, []);

	return (
		<View style={css.container}>
			<View onLayout={scaleImage} style={css.imageContainer}>
				{item.metadata.thumbnails.length === 0 ?
					<View style={css.imageBroken}>
						<MaterialIcons color='gray' name='broken-image' size={30}/>
					</View>
					:
					isLoading ?
						<ActivityIndicator size={'small'}/>
						:
						loadingFailed ?
							<MaterialIcons color='gray' name='error-outline' size={30}/>
							:
							<Image
								onError={() => setLoadingFailed(true)}
								onLoadEnd={() => setIsLoading(false)}
								resizeMode={'contain'}
								resizeMethod={'resize'}
								source={{
									height: imageDimensions.height,
									uri: item.metadata.thumbnails[0].url,
									width: imageDimensions.width,
								}}/>
				}
			</View>
			<View style={css.metadataContainer}>
				<Text numberOfLines={2} style={css.textTitle}>{item.title + '\n'}</Text>
				<Text numberOfLines={1} style={css.textAuthor}>{item.channel.name}</Text>
				<Text numberOfLines={1} style={css.textInfo}>
					{item.metadata.short_view_count_text.simple_text} • {item.metadata.published}
				</Text>
			</View>
			<TouchableOpacity disabled={isDownloaded} onPress={downloadSong} style={css.addButtonContainer}>
				<MaterialIcons name={!isDownloaded ? 'file-download' : 'file-download-done'} size={28}/>
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
		flexDirection: 'row'
	},
	imageContainer: {
		alignItems: 'center',
		flex: 2,
		justifyContent: 'center',
		padding: 5
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
		padding: 5
	},
	textAuthor: {
		color: '#212121',
		fontSize: 14
	},
	textInfo: {
		color: '#757575',
		fontSize: 12
	},
	textTitle: {
		color: '#212121',
		fontSize: 14,
		fontWeight: 'bold'
	}
});

export default SearchResultItem;