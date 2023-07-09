import {Box} from 'native-base';
import React from 'react';
import {Cover} from '../Cover';
import {Overlay} from '../Overlay';


interface ThumbnailProps {
	id: string;
	loadPlaceholder: boolean;
	timestamp: string;
	uri?: string;
}

function Thumbnail({id, loadPlaceholder, timestamp, uri}: ThumbnailProps) {
	return (
		<Box w={'40%'}>
			<Cover alt={`${id}'s cover`} uri={loadPlaceholder ? undefined : uri}/>
			<Overlay bottom={1} right={1} size={'xs'} text={timestamp}/>
		</Box>
	);
}

export default Thumbnail;
