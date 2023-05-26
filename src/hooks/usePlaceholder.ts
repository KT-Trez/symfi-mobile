import {useMemo} from 'react';
import useRandomInt from './useRandomInt';


const COVER_PATHS = [
	require('../../assets/cover-placeholders/cover-0.jpg'),
	require('../../assets/cover-placeholders/cover-1.jpg'),
	require('../../assets/cover-placeholders/cover-2.jpg'),
	require('../../assets/cover-placeholders/cover-3.jpg'),
	require('../../assets/cover-placeholders/cover-4.jpg'),
	require('../../assets/cover-placeholders/cover-5.jpg'),
	require('../../assets/cover-placeholders/cover-6.jpg'),
	require('../../assets/cover-placeholders/cover-7.jpg'),
	require('../../assets/cover-placeholders/cover-8.jpg'),
	require('../../assets/cover-placeholders/cover-9.jpg'),
	require('../../assets/cover-placeholders/cover-10.jpg'),
	require('../../assets/cover-placeholders/cover-11.jpg'),
	require('../../assets/cover-placeholders/cover-12.jpg'),
	require('../../assets/cover-placeholders/cover-13.jpg'),
	require('../../assets/cover-placeholders/cover-14.jpg'),
	require('../../assets/cover-placeholders/cover-15.jpg'),
	require('../../assets/cover-placeholders/cover-16.jpg'),
	require('../../assets/cover-placeholders/cover-17.jpg'),
	require('../../assets/cover-placeholders/cover-18.jpg'),
	require('../../assets/cover-placeholders/cover-19.jpg'),
	require('../../assets/cover-placeholders/cover-20.jpg'),
	require('../../assets/cover-placeholders/cover-21.jpg'),
	require('../../assets/cover-placeholders/cover-22.jpg'),
	require('../../assets/cover-placeholders/cover-23.jpg'),
	require('../../assets/cover-placeholders/cover-24.jpg')
];

export default function usePlaceholder() {
	const imageIndex = useMemo(() => {
		return useRandomInt(0, COVER_PATHS.length - 1, true);
	}, []);

	return COVER_PATHS[imageIndex];
}