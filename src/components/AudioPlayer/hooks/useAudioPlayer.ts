import { useContext } from 'react';
import { AudioPlayerContext, AudioPlayerContextProps } from '../context/context';

export const useAudioPlayer = (): AudioPlayerContextProps => {
  const actions = useContext(AudioPlayerContext);
  if (!actions) {
    throw Error('Missing provider. Hook useAudioPlayer must be used inside AudioPlayerProvider.');
  }

  return actions;
};
