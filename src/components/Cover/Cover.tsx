import {AspectRatio, Image, Skeleton} from 'native-base';
import {ResponsiveValue} from 'native-base/lib/typescript/components/types';
import React, {useState} from 'react';
import usePlaceholder from '../../hooks/usePlaceholder';


interface CoverProps {
	alt?: string;
	uri?: string | undefined;
	width?: ResponsiveValue<'px' | '0' | 'sm' | 'md' | 'lg' | 'xl' | string | number>;
}

function Cover({alt, uri, width}: CoverProps) {
	// flag corresponding to image loading errors
	const [imageNotLoaded, setImageNotLoaded] = useState(false);

	return (
		<AspectRatio ratio={16 / 9} w={width}>
			{imageNotLoaded ?
				<Skeleton startColor={'light.600'} endColor={'light.700'} h={'100%'}
				          rounded={'md'}/>
				:
				<Image alt={alt ?? 'cover image'}
				       onError={() => setImageNotLoaded(true)}
				       resizeMode={'contain'}
				       resizeMethod={'resize'}
				       rounded={'md'}
				       h={'100%'}
				       w={'100%'}
				       source={uri ? {uri} : usePlaceholder()}/>
			}
		</AspectRatio>
	);
}

export default Cover;