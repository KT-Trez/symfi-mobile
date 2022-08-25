import {Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS, PitchCorrectionQuality} from 'expo-av';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import {SavedSongMetadata} from '../../../typings/interfaces';
import useRandomIntInclusive from '../hooks/useRandomIntInclusive';


interface AudioPlayerProps {
	audioID: string | undefined;
	setAudioID: (id: string | undefined) => void;
	songs: SavedSongMetadata[];
}

function AudioPlayer({audioID, setAudioID, songs}: AudioPlayerProps) {
	const AudioPlayer = useRef(new Audio.Sound());

	const [isVisible, setIsVisible] = useState(false);

	const [isPaused, setIsPaused] = useState(false);
	const [progress, setProgress] = useState<number | undefined>();
	const [progressSimpleText, setProgressSimpleText] = useState<string | undefined>();

	const [song, setSong] = useState<SavedSongMetadata | undefined>(undefined);
	const [songsLeft, setSongsLeft] = useState<SavedSongMetadata[]>([]);

	const [autoplay, setAutoplay] = useState(false);
	const [shuffle, setShuffle] = useState(false);

	const audioStatus = async (status: AVPlaybackStatus) => {
		if (!status.isLoaded)
			return;

		if (status.durationMillis) {
			const progressFloat = status.positionMillis / status.durationMillis;
			if (progressFloat >= (progress ?? 0) + 0.01)
				setProgress(progressFloat);
		}

		// todo: progress
		const hDiff = Math.floor(status.positionMillis / 3600 / 1000);
		const minDiff = Math.floor(status.positionMillis / 60 / 1000);
		const secDiff = Math.floor(status.positionMillis / 1000);

		const timestamp = (hDiff > 0 ? hDiff + ':' : '') + doubleDigits(minDiff) + ':' + doubleDigits(secDiff);
		if (timestamp != progressSimpleText)
			setProgressSimpleText(timestamp);

		if (status.didJustFinish) {
			cleanControls();

			if (autoplay && shuffle) {
				let songsArr = [...songsLeft].filter(songLeft => songLeft.id !== song?.id);
				if (songsArr.length === 0)
					songsArr = [...songs];

				setSongsLeft(songsArr);
				setSong(songsArr[useRandomIntInclusive(0, songsArr.length - 1)]);
			} else if (autoplay)
				setSong(songs[(songs.indexOf(song!) + 1) % songs.length]);
			else
				endPlayback();
		}
	};

	const doubleDigits = (number: number) => {
		if (number.toString().length === 1)
			return '0' + number;
		return number;
	};

	const cleanControls = () => {
		setIsPaused(false);

		setProgress(0);
		setProgressSimpleText(undefined);

		setAutoplay(false);
		setShuffle(false);
	};

	const endPlayback = async () => {
		await AudioPlayer.current.unloadAsync();
		cleanControls();

		setAudioID(undefined);

		setIsVisible(false);
		setSong(undefined);
	};

	const pause = async () => {
		if (isPaused)
			await AudioPlayer.current.playAsync();
		else
			await AudioPlayer.current.pauseAsync();

		setIsPaused(value => !value);
	};

	const playResource = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
			interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
			playsInSilentModeIOS: false,
			playThroughEarpieceAndroid: false,
			shouldDuckAndroid: true,
			staysActiveInBackground: true
		});

		const {isLoaded} = await AudioPlayer.current.getStatusAsync()
		if (isLoaded)
			await AudioPlayer.current.unloadAsync();

		await AudioPlayer.current.loadAsync({uri: song!.musicly.file.path}, {
			pitchCorrectionQuality: PitchCorrectionQuality.High,
			shouldCorrectPitch: true
		}, true);
		const status = await AudioPlayer.current.getStatusAsync();

		if (status.isLoaded)
			if (!status.isPlaying)
				AudioPlayer.current.playAsync();
	};

	const toggleAutoplay = () => {
		if (autoplay)
			setShuffle(false);
		setAutoplay(value => !value);
	};

	const toggleShuffle = () => {
		if (!shuffle)
			setAutoplay(true);
		setShuffle(value => !value);
	};

	useEffect(() => {
		if (audioID)
			if (!song || song.id !== audioID) {
				cleanControls();
				setSong(songs.find(song => song.id === audioID));
			}
	}, [audioID]);

	useEffect(() => {
		if (song) {
			setIsVisible(true);
			playResource();
		}
	}, [song]);

	useEffect(() => {
		return () => {
			endPlayback();
		};
	}, []);

	AudioPlayer.current.setOnPlaybackStatusUpdate(audioStatus);

	return (
		<Surface style={[css.container, {display: isVisible ? 'flex' : 'none'}]}>
			<Text variant={'titleMedium'}>Music controls</Text>
			<View>
				<Text numberOfLines={1} variant={'bodyLarge'}>{song?.title ?? '- no music -'}</Text>
				<Text numberOfLines={1} variant={'labelSmall'}>{song?.channel.name ?? '- no music -'}</Text>
			</View>
			<View style={css.containerButtons}>
				<IconButton icon={'repeat'} iconColor={autoplay ? '#03a9f4' : undefined} onPress={toggleAutoplay}
							size={30}/>
				<View style={css.containerButtonsInner}>
					<IconButton icon={'skip-previous-circle-outline'} size={40}/>
					<IconButton icon={!isPaused ? 'pause-circle-outline' : 'play-circle-outline'}
								onPress={pause}
								size={50}/>
					<IconButton icon={'skip-next-circle-outline'} size={40}/>
				</View>
				<IconButton icon={'shuffle'} iconColor={shuffle ? '#03a9f4' : undefined} onPress={toggleShuffle}
							size={30}/>
			</View>
			<View style={css.containerProgress}>
				<Text style={css.progressText}>{progressSimpleText ?? '00:00'}</Text>
				<View style={css.progressBar}>
					{/* todo: fix progressBAR*/}
					{/*<ProgressBar progress={progress}/>*/}
				</View>
				<Text style={css.progressText}>{song?.metadata.duration.simple_text ?? '00:00'}</Text>
			</View>
		</Surface>
	);
}

const css = StyleSheet.create({
	container: {
		margin: 5,
		padding: 10
	},
	containerButtons: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	containerButtonsInner: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	containerProgress: {
		flexDirection: 'row'
	},
	progressBar: {
		alignItems: 'center',
		flex: 4,
		justifyContent: 'center'
	},
	progressText: {
		flex: 1,
		textAlign: 'center'
	}
});

export default AudioPlayer;