import { createContext } from 'react';
import type { SongType } from 'types';

export type AudioPlayerContextProps = {
  addToQueue: (songs: SongType | SongType[]) => void;
  currentSong: null | SongType;
  isLooping: boolean;
  isPaused: boolean;
  toggleLooping: () => void;
  togglePause: () => void;
  removeFromQueue: (song: SongType | SongType[]) => void;
};

export const AudioPlayerContext = createContext<undefined | AudioPlayerContextProps>(undefined);
