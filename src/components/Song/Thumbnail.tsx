import {AspectRatio, Box, Image, Skeleton} from 'native-base';
import React, {useState} from 'react';
import Timestamp from '../Timestamp';


interface ThumbnailProps {
	id: string;
	loadPlaceholder: boolean;
	timestamp: string;
	uri?: string;
}

function Thumbnail({id, loadPlaceholder, timestamp, uri}: ThumbnailProps) {
	// flag corresponding to image loading errors
	const [imageErrored, setImageErrored] = useState(false);

	return (
		<Box w={'40%'}>
			<AspectRatio ratio={16 / 9}>
				{imageErrored ?
					<Skeleton startColor={'light.600'} endColor={'light.700'} h={'100%'}
					          rounded={'md'}/>
					:
					<Image alt={`${id} cover`}
					       onError={() => setImageErrored(true)}
					       resizeMode={'contain'}
					       resizeMethod={'resize'}
					       rounded={'md'}
					       h={'100%'}
					       w={'100%'}
					       source={loadPlaceholder && uri ? {uri: uri} : require('../../../assets/song_placeholder.png')}/>
				}
			</AspectRatio>

			<Timestamp time={timestamp}/>
		</Box>
	);
}

export default Thumbnail;