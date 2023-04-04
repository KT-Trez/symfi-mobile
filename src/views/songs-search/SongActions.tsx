import {MaterialCommunityIcons} from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import {Actionsheet, Icon, Spinner, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {Musicly} from '../../../types';
import SongsController from '../../datastore/SongsController';
import ResourceManager from '../../services/ResourceManager';


interface SongActionsProps {
	data?: Musicly.Api.MediaInfo;
	hide: () => void;
	isVisible: boolean;
}

// todo: move to song's card
function SongActions({data, hide, isVisible}: SongActionsProps) {
	const songsDB = useRef(new SongsController());

	const [isDownloaded, setIsDownloaded] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	// todo: measure performance, remove if unnecessary
	const checkDownloadedStatus = useCallback(async () => {
		if (!data)
			return;

		if (await songsDB.current.countAsync({id: data.id}) > 0)
			setIsDownloaded(true);
		else
			setIsDownloaded(false);
	}, [data]);

	const downloadSong = useCallback(async () => {
		if (!data)
			return;

		setIsDownloading(true);

		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== MediaLibrary.PermissionStatus.GRANTED) {
			setIsDownloading(false);
			return ToastAndroid.showWithGravity('Can\'t save a file without media library permission.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
		}

		try {
			const song = await ResourceManager.Song.create({
				channel: data.channel,
				description: data.description,
				id: data.id,
				metadata: {
					badges: [],
					duration: {
						accessibility_label: data.metadata.duration.label,
						seconds: data.metadata.duration.seconds,
						simple_text: data.metadata.duration.label
					},
					owner_badges: [],
					published: data.metadata.published,
					short_view_count_text: {
						accessibility_label: data.metadata.views.label,
						simple_text: data.metadata.views.label
					},
					thumbnails: data.metadata.thumbnails,
					view_count: data.metadata.views.label
				},
				title: data.title,
				url: ''
			});
			await song.getRemoteAudio();
			await checkDownloadedStatus();
		} catch (err) {
			console.error(err);
			ToastAndroid.showWithGravity('Error, audio file NOT downloaded.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} finally {
			setIsDownloading(false);
		}
	}, [data]);

	useEffect(() => {
		checkDownloadedStatus();
	}, [data]);

	return (
		<Actionsheet isOpen={isVisible} onClose={hide}>
			<Actionsheet.Content>
				<VStack h={60} px={4} justifyContent='center' space={4} w='100%'>
					<Text isTruncated>
						Song: <Text bold> {data?.title}</Text>
					</Text>
					{isDownloading &&
						<Spinner/>
					}
				</VStack>
				<Actionsheet.Item disabled={isDownloaded || isDownloading}
				                  onPress={downloadSong}
				                  startIcon={<Icon as={MaterialCommunityIcons}
				                                   color={'success.500'}
				                                   name={isDownloaded ? 'check-circle-outline' : 'download-circle-outline'}
				                                   size='6'/>}>{isDownloaded ? 'Downloaded' : 'Download'}</Actionsheet.Item>
				<Actionsheet.Item onPress={hide}
				                  startIcon={<Icon as={MaterialCommunityIcons} name={'close'}
				                                   size='6'/>}>Cancel</Actionsheet.Item>
			</Actionsheet.Content>
		</Actionsheet>
	);
}

export default SongActions;