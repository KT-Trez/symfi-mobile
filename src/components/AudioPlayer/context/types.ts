import type { SongType } from '@types';

export type UseAudioPlayer = {
  currentSong: SongType | null;
  isLooping: boolean;
  isPaused: boolean;
  play: (song: SongType) => void;
  playNext: () => void;
  playPrevious: () => void;
  stop: () => void;
  toggleLooping: () => void;
  togglePause: () => void;
  updateQueue: (song: SongType | SongType[]) => void;
};
