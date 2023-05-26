import {Box} from 'native-base';
import React from 'react';
import {Cover} from '../Cover';
import Timestamp from '../Timestamp';


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
			<Timestamp time={timestamp}/>
		</Box>
	);
}

export default Thumbnail;