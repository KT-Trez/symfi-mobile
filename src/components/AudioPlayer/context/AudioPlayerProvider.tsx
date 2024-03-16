import { Audio, AVPlaybackStatus, InterruptionModeAndroid } from 'expo-av';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SongType } from 'types';
import { AudioPlayerContext } from './context';
import type { UseAudioPlayer } from './types';

type AudioPlayerProviderProps = {
  children?: ReactNode;
};

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const currentSound = useRef<null | Audio.SoundObject>(null);

  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  // todo: move to ref
  const queue = useRef<SongType[]>([]);

  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // queue handlers
  const play = useCallback((song: SongType) => setCurrentSong(song), []);

  const playNext = useCallback(() => {
    const currentSongIndex = queue.current.findIndex(item => item.id === currentSong?.id);
    if (currentSongIndex === -1) {
      setCurrentSong(null);
    }

    const nextSongIndex = (currentSongIndex + 1) % queue.current.length;
    setCurrentSong(queue.current[nextSongIndex]);
  }, [currentSong?.id, queue]);

  const playPrevious = useCallback(() => {
    const currentSongIndex = queue.current.findIndex(item => item.id === currentSong?.id);
    if (currentSongIndex === -1) {
      setCurrentSong(null);
    }

    const previousSongIndex = currentSongIndex - 1 < 0 ? queue.current.length - 1 : currentSongIndex - 1;
    setCurrentSong(queue.current[previousSongIndex]);
  }, [currentSong?.id, queue]);

  const stop = useCallback(() => {
    setCurrentSong(null);
    currentSound.current?.sound.unloadAsync();
    currentSound.current = null;
  }, []);

  const toggleLooping = () => setIsLooping(prevState => !prevState);

  const togglePause = useCallback(async () => {
    isPaused ? await currentSound.current?.sound.playAsync() : await currentSound.current?.sound.pauseAsync();
    setIsPaused(prevState => !prevState);
  }, [isPaused]);

  const updateQueue = useCallback((song: SongType | SongType[]) => {
    queue.current = Array.isArray(song) ? song : [song];
  }, []);

  // startup
  const mountStatusEvents = useCallback(
    (status: AVPlaybackStatus): void => {
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
        stop();
      }

      if (status.didJustFinish) {
        playNext();
      }
    },
    [playNext, stop],
  );

  const updateCurrentSound = useCallback(async () => {
    if (currentSound.current) {
      await currentSound.current.sound.unloadAsync();
    }

    if (!currentSong) return;
    if (!currentSong.file) return playNext();

    currentSound.current = await Audio.Sound.createAsync(
      { uri: currentSong.file.uri },
      { isLooping, shouldPlay: true },
    );
    currentSound.current.sound.setOnPlaybackStatusUpdate(mountStatusEvents);
    await currentSound.current.sound.setProgressUpdateIntervalAsync(800);

    await currentSound.current.sound.playAsync();
  }, [currentSong, isLooping, mountStatusEvents, playNext]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    });
  }, []);

  useEffect(() => {
    updateCurrentSound();
  }, [currentSong, updateCurrentSound]);

  const providerProps: UseAudioPlayer = useMemo(
    () => ({
      currentSong,
      isLooping,
      isPaused,
      play,
      playNext,
      playPrevious,
      stop,
      toggleLooping,
      togglePause,
      updateQueue,
    }),
    [currentSong, isLooping, isPaused, play, playNext, playPrevious, stop, togglePause, updateQueue],
  );

  return <AudioPlayerContext.Provider value={providerProps}>{children}</AudioPlayerContext.Provider>;
};
