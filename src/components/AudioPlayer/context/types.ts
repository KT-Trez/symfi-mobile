import type { SongType } from '@types';

export type UseAudioPlayer = {
  currentSong: SongType | null;
  isBuffering: boolean;
  isLooping: boolean;
  isPaused: boolean;
  isShuffled: boolean;
  moveTo: (position: number) => void;
  play: (song: SongType) => void;
  playNext: () => void;
  playPrevious: () => void;
  progress: number;
  stop: () => void;
  toggleLooping: () => void;
  togglePause: () => void;
  toggleShuffle: () => void;
  updateQueue: (songs: SongType[]) => void;
};
