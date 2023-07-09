import {Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS, PitchCorrectionQuality} from 'expo-av';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import useRandomInt from '../hooks/useRandomInt';
import {Song as SongC} from '../services/ResourceManager';


interface AudioPlayerProps {
    audioID: string | undefined;
    setAudioID: (id: string | undefined) => void;
    songs: SongC[];
}

function AudioPlayer({audioID, setAudioID, songs}: AudioPlayerProps) {
    const AudioPlayer = useRef(new Audio.Sound());
    // const {colors} = useTheme();

    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // todo: smooth sliding and time feedback
    const [duration, setDuration] = useState<number | undefined>(undefined);
    const [progress, setProgress] = useState<number | undefined>();
    const [progressSimpleText, setProgressSimpleText] = useState<string | undefined>();

    const [song, setSong] = useState<SongC | undefined>(undefined);
    const [songsLeft, setSongsLeft] = useState<SongC[]>([]);

    const [autoplay, setAutoplay] = useState(true);
    const [shuffle, setShuffle] = useState(false);

    const audioStatus = async (status: AVPlaybackStatus) => {
        if (!status.isLoaded)
            return;

        if (status.durationMillis) {
            const currentSecond = Math.round(status.positionMillis / 1000);
            if (currentSecond >= (progress ?? 0) + 1)
                setProgress(currentSecond);
        }

        const timestamp = moment.utc(status.positionMillis).format('HH:mm:ss');
        if (timestamp !== progressSimpleText)
            setProgressSimpleText(timestamp.slice(0, 2) === '00' ? timestamp.slice(3, timestamp.length) : timestamp);

        if (status.didJustFinish) {
            cleanControls();

            if (autoplay && shuffle) {
                let songsArr = [...songsLeft].filter(songLeft => songLeft.id !== song?.id);
                if (songsArr.length === 0)
                    songsArr = [...songs];

                setSongsLeft(songsArr);
                setSong(songsArr[useRandomInt(0, songsArr.length - 1)]);
            } else if (autoplay)
                setSong(songs[(songs.indexOf(song!) + 1) % songs.length]);
            else
                await endPlayback();
        }
    };

    const cleanControls = () => {
        setIsPaused(false);

        setDuration(undefined);
        resetProgress();
    };

    const endPlayback = async () => {
        await AudioPlayer.current.unloadAsync();
        cleanControls();

        setAutoplay(false);
        setShuffle(false);

        setAudioID(undefined);

        setIsVisible(false);
        setSong(undefined);
    };

    const moveTo = async (position: number) => {
        const status = await AudioPlayer.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying)
            await AudioPlayer.current.setPositionAsync(position * 1000);
    };

    const nextSong = () => {
        if (!song)
            return;
        setSong(songs[(songs.indexOf(song) + 1) % songs.length]);
    };

    const pause = async () => {
        if (isPaused)
            await AudioPlayer.current.playAsync();
        else
            await AudioPlayer.current.pauseAsync();

        setIsPaused(value => !value);
    };

    // todo: add exception catch
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

        const {isLoaded} = await AudioPlayer.current.getStatusAsync();
        if (isLoaded)
            await AudioPlayer.current.unloadAsync();

        await AudioPlayer.current.loadAsync({uri: song!.musicly.file.path!}, {
            pitchCorrectionQuality: PitchCorrectionQuality.High,
            progressUpdateIntervalMillis: 900,
            shouldCorrectPitch: true
        }, true);
        const status = await AudioPlayer.current.getStatusAsync();

        if (status.isLoaded) {
            setDuration(Math.round((status.durationMillis ?? 0) / 1000));
            resetProgress();
            if (!status.isPlaying)
                await AudioPlayer.current.playAsync();
        }
    };

    const previousSong = () => {
        if (!song)
            return;
        const currentIndex = songs.indexOf(song);
        setSong(songs[currentIndex - 1 >= 0 ? currentIndex - 1 : songs.length - 1]);
    };

    const resetProgress = () => {
        setProgress(undefined);
        setProgressSimpleText(undefined);
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
                resetProgress();
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
        <>
            {/*<Surface style={[css.container, {display: isVisible ? 'flex' : 'none'}]}>*/}
            {/*    /!* todo: check which looks nicer *!/*/}
            {/*    /!*<TextSetting variant={'titleMedium'}>Music controls</TextSetting>*!/*/}
            {/*    <View>*/}
            {/*        <Text numberOfLines={2} variant={'bodyLarge'}>{song?.title ?? '- no music -'}</Text>*/}
            {/*        <Text numberOfLines={1} variant={'labelSmall'}>{song?.channel.name ?? '- no music -'}</Text>*/}
            {/*    </View>*/}
            {/*    <View style={css.containerButtons}>*/}
            {/*        <IconButton icon={'motion-play-outline'}*/}
            {/*                    iconColor={autoplay ? '#03a9f4' : undefined}*/}
            {/*                    onPress={toggleAutoplay}*/}
            {/*                    size={30}/>*/}
            {/*        <View style={css.containerButtonsInner}>*/}
            {/*            <IconButton icon={'skip-previous-circle-outline'}*/}
            {/*                        onPress={previousSong}*/}
            {/*                        size={40}/>*/}
            {/*            <IconButton icon={!isPaused ? 'pause-circle-outline' : 'play-circle-outline'}*/}
            {/*                        onLongPress={endPlayback}*/}
            {/*                        onPress={pause}*/}
            {/*                        size={50}/>*/}
            {/*            <IconButton icon={'skip-next-circle-outline'}*/}
            {/*                        onPress={nextSong}*/}
            {/*                        size={40}/>*/}
            {/*        </View>*/}
            {/*        <IconButton icon={'shuffle'}*/}
            {/*                    iconColor={shuffle ? '#03a9f4' : undefined}*/}
            {/*                    onPress={toggleShuffle}*/}
            {/*                    size={30}/>*/}
            {/*    </View>*/}
            {/*    <View style={css.containerProgress}>*/}
            {/*        <Text style={css.progressText}>{progressSimpleText ?? '00:00'}</Text>*/}
            {/*        <View style={css.progressBar}>*/}
            {/*            <Slider maximumValue={duration ?? 1}*/}
            {/*                    maximumTrackTintColor={colors.primary}*/}
            {/*                    minimumValue={0}*/}
            {/*                    minimumTrackTintColor={colors.primary}*/}
            {/*                    onSlidingComplete={moveTo}*/}
            {/*                    style={{width: '100%'}}*/}
            {/*                    thumbTintColor={colors.primary}*/}
            {/*                    value={progress ?? 0}/>*/}
            {/*        </View>*/}
            {/*        <Text style={css.progressText}>{song?.metadata.duration.simple_text ?? '00:00'}</Text>*/}
            {/*    </View>*/}
            {/*</Surface>*/}
        </>
    );
}

const css = StyleSheet.create({
    container: {
        margin: 5,
        marginBottom: 0,
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
        alignItems: 'center',
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
