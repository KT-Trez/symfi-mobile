import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from 'expo-av';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SongType } from 'types';
import { AudioPlayerContext, AudioPlayerContextProps } from './context';

type AudioPlayerProviderProps = {
  children?: ReactNode;
};

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const currentSound = useRef<null | Audio.SoundObject>(null);

  const [currentSong, setCurrentSong] = useState<null | SongType>(null);
  const [queue, setQueue] = useState<SongType[]>([]);

  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // startup
  const updateAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    });
  }, []);

  const mountStatusEvents = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        // todo: report error
      }

      return;
    }

    if (status.isBuffering) {
      // todo: update buffering
    }

    if (status.isPlaying) {
      // todo: update progress
    }

    if (status.didJustFinish && !status.isLooping) {
      setCurrentSong(null);
      currentSound.current = null;
      setQueue(prevState => prevState.slice(1));
    }
  }, []);

  const updateCurrentSound = useCallback(async () => {
    if (currentSound.current) {
      return;
    }

    const nextSong = queue.at(0);
    if (!nextSong || !nextSong.file.isDownloaded) {
      return;
    }

    setCurrentSong(nextSong);

    currentSound.current = await Audio.Sound.createAsync(
      { uri: nextSong.file.download.path },
      { isLooping, shouldPlay: true },
    );
    currentSound.current.sound.playAsync();
    currentSound.current.sound.setOnPlaybackStatusUpdate(mountStatusEvents);
    currentSound.current.sound.setProgressUpdateIntervalAsync(800);
  }, [isLooping, mountStatusEvents, queue]);

  useEffect(() => {
    updateAudioMode();
  }, [updateAudioMode]);

  // queue handlers
  const addToQueue = useCallback(
    (songs: SongType | SongType[]) => {
      setQueue(prevState => {
        Array.isArray(songs) ? prevState.concat(songs) : prevState.push(songs);
        return prevState;
      });
      updateCurrentSound();
    },
    [updateCurrentSound],
  );

  const toggleLooping = () => setIsLooping(prevState => !prevState);

  const togglePause = useCallback(async () => {
    isPaused ? await currentSound.current?.sound.playAsync() : await currentSound.current?.sound.pauseAsync();
    setIsPaused(prevState => !prevState);
  }, [isPaused]);

  const removeFromQueue = useCallback((songs: SongType | SongType[]) => {
    setQueue(prevState => {
      const songsToRemove = Array.isArray(songs) ? songs : [songs];

      return prevState.filter(prevSong => !songsToRemove.some(song => song.id === prevSong.id));
    });
  }, []);

  const providerProps: AudioPlayerContextProps = useMemo(
    () => ({
      addToQueue,
      currentSong,
      isLooping,
      isPaused,
      toggleLooping,
      togglePause,
      removeFromQueue,
    }),
    [addToQueue, currentSong, isLooping, isPaused, removeFromQueue, togglePause],
  );

  return <AudioPlayerContext.Provider value={providerProps}>{children}</AudioPlayerContext.Provider>;
};
