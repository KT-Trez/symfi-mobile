import {useEffect, useState} from 'react';
import ResourceManager, {Song} from '../services/ResourceManager';
import useCompare from './useCompare';


function useSongs(): [boolean, Song[], () => void, (extractor: (item: Song) => (Date | number | string), revers?: boolean) => void, (item: Song[]) => void] {
	const [isLoading, setIsLoading] = useState(false);
	const [songs, setSongs] = useState<Song[]>([]);

	const getSongs = async () => {
		setIsLoading(true);
		setSongs(useCompare(await ResourceManager.Song.deserializeAll(), item => item.title));
		setIsLoading(false);
	};

	const sortSongs = (extractor: (item: Song) => Date | number | string, revers?: boolean) => {
		setSongs(arr => useCompare(arr, extractor, revers));
	};

	useEffect(() => {
		getSongs();
	}, []);

	return [isLoading, songs, getSongs, sortSongs, setSongs];
}

export default useSongs;