import {MaterialIcons} from '@expo/vector-icons';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, LayoutChangeEvent, StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import {DownloadType} from '../../../typings/enums';
import {SongMetadata} from '../../../typings/interfaces';
import SongsController from '../../datastore/SongsController';
import NetService from '../../services/NetService';


interface SongProps {
	item: SongMetadata;
}

function Song({item}: SongProps) {
	// todo: !IMPORTANT optimize
	const {colors} = useTheme();
	const songsDB = useRef(new SongsController());

	const [isDownloaded, setIsDownloaded] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const [loadingFailed, setLoadingFailed] = useState(false);

	const [imageDimensions, setImageDimensions] = useState({height: 0, width: 0});

	// todo: measure performance, remove if unnecessary
	const checkDownloadedStatus = useCallback(async () => {
		if (await songsDB.current.countAsync({id: item.id}) > 0)
			setIsDownloaded(true);
	}, []);

	const downloadSong = useCallback(async () => {
		setIsDownloading(true);

		try {
			await new NetService().download(DownloadType.Audio, item);
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
					<MaterialIcons color={colors.secondary}
								   name={!isDownloaded ? 'file-download' : 'file-download-done'} size={28}/>
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

export default Song;